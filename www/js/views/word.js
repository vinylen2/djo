const m = require('mithril');
const Word = require('../models/word');
const Comments = require('../models/comments');

const CommentComponent = {
  view(vnode) {
    return [
      m('div.comment', [
        m('div.commentPar', [
          m('p.commentText', vnode.attrs.text),
          m('p.commentCountry', vnode.attrs.region),
        ]),
        m(
          'div.voting',
          Comments.user.published
            ? [
              m(
                  'button.vote.up.pressed',
                {
                  onclick() {},
                },
                  '∧',
                ),
              m(
                  'button.vote.down.pressed',
                {
                  onclick() {},
                },
                  '∨',
                ),
              m('p.rank', vnode.attrs.rank),
            ]
            : [
              m(
                  'button.vote.up',
                {
                  onclick() {
                    Comments.vote(vnode.attrs, true);
                  },
                },
                  '∧',
                ),
              m(
                  'button.vote.down',
                {
                  onclick() {
                    Comments.vote(vnode.attrs, false);
                  },
                },
                  '∨',
                ),
              m('p.rank', vnode.attrs.rank),
            ],
        ),
      ]),
    ];
  },
};

const formComponent = {
  view() {
    return [
      m(
        'form',
        {
          onsubmit(event) {
            event.preventDefault();
          },
        },
        [
          m('div.inputBox', [
            m(
              'input.input[type=text][placeholder=Write a sentence using the word...]',
              {
                oninput: m.withAttr('value', (value) => {
                  Comments.inputComment = value;
                }),
                value: Comments.inputComment,
              },
            ),
          ]),
          m('div.buttonBox', [
            m(
              'button.button',
              {
                onclick() {
                  Comments.save(Word.selected.word);
                },
              },
              '>',
            ),
          ]),
        ],
      ),
    ];
  },
};

const badComment = {
  view() {
    return [
      m('div.comment.bad', [
        m('div.commentPar', [
          m(
            'p.alert',
            Comments.network
              ? 'Comment must include word of the day.'
              : 'Offline - no comments allowed',
          ),
        ]),
      ]),
    ];
  },
};

const NewComment = {
  view() {
    return [
      m('div.comment', Comments.network ? m(formComponent) : m(badComment)),
    ];
  },
};

const NoComment = {
  view() {
    return [
      m('div.comment', [
        m('div.commentPar', [m('p.alert', 'Comment submitted.')]),
      ]),
    ];
  },
};

const loadingScreen = {
  view() {
    return [m('div.loader', '')];
  },
};

const wordComponent = {
  view() {
    return [
      m('div.description', [
        m('h1', Word.data.word),
        m('div.content', [
          m('p.left', Word.data.definition),
          m('ul', [
            m('li.synonym', Word.data.synonyms),
          ]),
        ]),
      ]),
      m(
        'div.box.comments',
        Comments.data.comments.map(comment =>
          m(CommentComponent, comment),
        ),
      ),
      m(
        'div.box.comments',
          m(NewComment),
      ),
      m('div.box.comments', Comments.relevance ? '' : m(badComment)),
    ];
  },
};

module.exports = {
  oninit() {
    Word.load();
    Comments.load();
  },
  view() {
    return [
      m('div.appcontent', Word.loading ? m(loadingScreen) : m(wordComponent)),
    ];
  },
};
