'use strict';
var m = require('mithril');
var UserComments = require('../models/usercomments');
var Word = require('../models/word');

var CommentComponent = {
  view: function(vnode) {
    return [
      m('div.comment', [
        m('div.commentPar', [
          m(
            'a',
            {
              href: '/' + vnode.attrs.date,
              oncreate: m.route.link,
              onclick: function() {
                Word.load(vnode.attrs.date);
                console.log('clicked ' + vnode.attrs.date);
              },
            },
            m('p.commentText.old', vnode.attrs.date + ', ' + vnode.attrs.word),
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

var CommentComponentToday = {
  view: function(vnode) {
    return [
      m('div.comment.', [
        m('div.commentPar', [
          m(
            'a',
            { href: '/', oncreate: m.route.link },
            m(
              'p.commentText.today.old',
              vnode.attrs.date + ', ' + vnode.attrs.word,
            ),
          ),
        ]),
      ]),
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
      m('div.appcontent', [
        m('div.description', [m('h1', 'Archive')]),
        m(
          'div.box.comments',
          Words.data.map(word => {
            if (word.date === Words.date) {
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
