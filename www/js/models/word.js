'use strict';
var m = require('mithril');
var Words = require('./words');
var UserComments = require('./usercomments');

function zero_pad(number) {
  if (number < 10) {
    number = '0' + number;
  }
  return number;
}

function setDate(input) {
  if (input) {
    Word.date = input;
  } else {
    var today = new Date();
    Word.date =
      today.getFullYear() +
      '-' +
      zero_pad(parseInt(today.getMonth()) + 1) +
      '-' +
      today.getDate();
  }
}

function setWord() {
  var result = Words.data.filter(obj => {
    return obj.date === Word.date;
  })[0];
  Word.selected = result;
  Word.loading = false;
  m.redraw();
}

var Word = {
  date: '',
  data: {
    word: '',
    type: '',
    definition: '',
    synonyms: [],
  },
  loading: true,
  load: function(input) {
    console.log(Words.load());
    setDate(input);
    setWord();
  },
};

module.exports = Word;
