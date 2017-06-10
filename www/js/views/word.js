'use strict';
var m = require('mithril');
var Word = require('../models/word');
var UserComments = require('../models/usercomments');

var CommentComponent = {
  view: function(vnode) {
    return [
      m('div.comment', [
        m('div.commentPar', [
          m('p.commentText', vnode.attrs.comment),
          m('p.commentCountry', vnode.attrs.country),
        ]),
        m(
          'div.voting',
          UserComments.data.storage.votes[vnode.attrs.id]
            ? [
                m(
                  'button.vote.up.pressed',
                  {
                    onclick: function() {},
                  },
                  '∧',
                ),
                m(
                  'button.vote.down.pressed',
                  {
                    onclick: function() {},
                  },
                  '∨',
                ),
                m('p.rank', vnode.attrs.rank),
              ]
            : [
                m(
                  'button.vote.up',
                  {
                    onclick: function() {
                      UserComments.vote(vnode.attrs, true);
                    },
                  },
                  '∧',
                ),
                m(
                  'button.vote.down',
                  {
                    onclick: function() {
                      UserComments.vote(vnode.attrs, false);
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

var formComponent = {
  view: function() {
    return [
      m(
        'form',
        {
          onsubmit: function(event) {
            event.preventDefault();
          },
        },
        [
          m('div.inputBox', [
            m(
              'input.input[type=text][placeholder=Write a sentence using the word...]',
              {
                oninput: m.withAttr('value', function(value) {
                  UserComments.inputComment = value;
                }),
                value: UserComments.inputComment,
              },
            ),
          ]),
          m('div.buttonBox', [
            m(
              'button.button',
              {
                onclick: function() {
                  UserComments.save(Word.selected.word);
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

var badComment = {
  view: function() {
    return [
      m('div.comment.bad', [
        m('div.commentPar', [
          m(
            'p.alert',
            UserComments.network
              ? 'Comment must include word of the day.'
              : 'Offline - no comments allowed',
          ),
        ]),
      ]),
    ];
  },
};

var NewComment = {
  view: function() {
    return [
      m('div.comment', UserComments.network ? m(formComponent) : m(badComment)),
    ];
  },
};

var NoComment = {
  view: function() {
    return [
      m('div.comment', [
        m('div.commentPar', [m('p.alert', 'Comment submitted.')]),
      ]),
    ];
  },
};

var loadingScreen = {
  view: function() {
    return [m('div.loader', '')];
  },
};

var wordComponent = {
  view: function() {
    return [
      m('div.description', [
        m('h1', Word.data.word),
        m('div.content', [
          m('p.left', Word.data.definition),
          m('ul', [
            Word.data.synonyms.map(synonym => {
              return m('li.synonym', synonym);
            }),
          ]),
        ]),
      ]),
      m(
        'div.box.comments',
        UserComments.data.comments.map(comment => {
          return m(CommentComponent, comment);
        }),
      ),
      m(
        'div.box.comments',
        UserComments.data.storage.comment.published
          ? m(NoComment)
          : m(NewComment),
      ),
      m('div.box.comments', UserComments.relevance ? '' : m(badComment)),
    ];
  },
};

module.exports = {
  oninit: function() {
    Word.load();
    UserComments.load();
  },
  view: function() {
    return [
      m('div.appcontent', Word.loading ? m(loadingScreen) : m(wordComponent)),
    ];
  },
};
