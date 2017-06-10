'use strict';
var m = require('mithril');
var Word = require('../models/word');
var UserComments = require('../models/usercomments');

var CommentComponent = {
  view: function(vnode) {
    return [
      m('div.comment', [
        m('div.commentPar', [m('p.commentText', vnode.attrs.comment)]),
        m('div.voting', [m('p.rank', vnode.attrs.rank)]),
      ]),
    ];
  },
};

var badComment = {
  view: function() {
    return [
      m('div.comment.bad', [
        m('div.commentPar', [
          m('p.alert', 'Comments only allowed on todays date.'),
        ]),
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

var NewComment = {
  view: function() {
    return [
      m('div.comment', UserComments.cheat ? m(formComponent) : m(badComment)),
    ];
  },
};

module.exports = {
  oninit: function(vnode) {
    Word.load(vnode.attrs.date);
    UserComments.load(vnode.attrs.date);
  },
  view: function() {
    UserComments.showCommentsOfSelectedDay();
    return [
      m('div.appcontent', [
        m('div.description', [
          m('h1', Word.selected.word + ', ' + Word.selected.date),
          m('div.content', [
            m('p.left', Word.selected.defenition),
            m('ul', [
              Word.selected.synonyms.map(synonym => {
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
        m(NewComment),
      ]),
    ];
  },
};
