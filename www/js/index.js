/* jshint browser: true */
'use strict';
var m = require('mithril');
var Layout = require('./views/layout');
var About = require('./views/about');
var Word = require('./views/word');
var mWord = require('./models/word');
var Comments = require('./models/comments');
var Words = require('./views/words');
var OldWord = require('./views/oldword');

function onOnline() {
  mWord.online();
  Comments.online();
}

function onOffline() {
  mWord.offline();
  Comments.offline();
}

var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener(
      'deviceready',
      this.onDeviceReady.bind(this),
      false,
    );
  },
  onDeviceReady: function() {
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
    m.route(document.body, '/', {
      '/': {
        render: function() {
          return m(Layout, m(Word));
        },
      },
      '/about': {
        render: function() {
          return m(Layout, m(About));
        },
      },
      '/old': {
        render: function() {
          return m(Layout, m(Words));
        },
      },
      '/:date': {
        render: function(vnode) {
          return m(Layout, m(OldWord, vnode.attrs));
        },
      },
    });
  },
};

app.initialize();
