const m = require('mithril');
const Words = require('./words');
const moment = require('moment');

let Word = {};

function setWord(data, input) {
  const result = data.filter(obj => obj.date === input)[0];
  Word.data = result;
  Word.loading = false;
  Word.date = input;
  m.redraw();
}


Word = {
  date: '',
  data: {
    word: '',
    type: '',
    definition: '',
    synonyms: [],
  },
  loading: true,
  load(input) {
    Words.load()
      .then((result) => {
        if (input) {
          setWord(result, input);
        } else {
          setWord(result, moment().format('YYYY-MM-DD'));
        }
      });
  },
};

module.exports = Word;
