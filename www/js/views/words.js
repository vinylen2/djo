const m = require('mithril');
const Comments = require('../models/comments');
const Words = require('../models/words');
const moment = require('moment');

const CommentComponent = {
  view(vnode) {
    return [
      m('div.comment', [
        m('div.commentPar', [
          m(
            'a',
            {
              href: `/${vnode.attrs.date}`,
              oncreate: m.route.link,
              onclick() {
                Words.load(vnode.attrs.date);
                console.log('clicked ' + vnode.attrs.date);
              },
            },
            m('p.commentText.old', `${vnode.attrs.date}, ${vnode.attrs.word}`),
          ),
        ]),
        m(
          'div.voting',
          [
            // m("p.rank", vnode.attrs.wo)
          ],
        ),
      ]),
    ];
  },
};

const CommentComponentToday = {
  view(vnode) {
    return [
      m('div.comment.', [
        m('div.commentPar', [
          m(
            'a',
            { href: '/', oncreate: m.route.link },
            m('p.commentText.today.old', `${vnode.attrs.date}, ${vnode.attrs.word}`),
          ),
        ]),
      ]),
    ];
  },
};
module.exports = {
  oninit() {
    Words.load();
    Comments.load();
  },
  view() {
    return [
      m('div.appcontent', [
        m('div.description', [m('h1', 'Archive')]),
        m(
          'div.box.comments',
          Words.data.map((word) => {
            if (word.date === moment().format('YYYY-MM-DD')) {
              return m(CommentComponentToday, word);
            } else {
              return m(CommentComponent, word);
            }
          }),
        ),
      ]),
    ];
  },
};
