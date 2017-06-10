'use strict';
var m = require('mithril');

var cComment = {
  view: function(vnode) {
    return [
      m('div.comment', [
        m('div.commentPar.about', [
          m('p.commentText.aboutText', vnode.attrs.data),
        ]),
      ]),
    ];
  },
};

var about = [
  {
    data: 'Are you looking to expand your vocabulary? Look no more!',
  },
  {
    data:
      'Every day we publish a new word. Users enter the app daily to publish comments using the word of the day.',
  },
  {
    data:
      'Be aware, you may only publish one sentence per day, articulate wisely.',
  },
];

module.exports = {
  oninit: function() {},
  view: function() {
    return [
      m('div.appcontent', [
        m('div.description', [m('h1', 'Dagens Ord')]),
        m(
          'div',
          about.map(data => {
            return m(cComment, data);
          }),
        ),
      ]),
    ];
  },
};
