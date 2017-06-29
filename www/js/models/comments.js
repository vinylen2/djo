/* jshint browser: true */
const m = require('mithril');
const ipURL = 'http://freegeoip.net/json/';
let serverURL = 'http://localhost:3000/comments';
let Comments = {};

function fail(err) {
  console.log('Error ', err);
}

function compare(a, b) {
  let comparison = 0;
  if (a.rank < b.rank) {
    comparison = 1;
  } else if (b.rank < a.rank) {
    comparison = -1;
  }
  return comparison;
}

function getCommentsFromServer(input) {
  let date = null;
  if (input) {
    serverURL = `${serverURL}/date`;
    date = input;
  }

  return m
    .request({
      method: 'GET',
      url: serverURL,
      data: { date },
    }).then(result => Promise.resolve(result));
}

function relevanceAlgorithm(array, word) {
  let state = false;
  const allWords = array.split(' ');
  allWords.forEach((inputWord) => {
    const formattedWord = inputWord.toLowerCase();
    if (formattedWord === 'godmode') {
      Comments.cheat = true;
      // state = true;
    } else if (formattedWord === 'humanmode') {
      Comments.cheat = false;
      // state = true;
    } else {
      if (formattedWord === word) {
        state = true;
      } else if (formattedWord.startsWith(word)) {
        state = true;
      } else if (formattedWord.includes(word)) {
        state = true;
      } else {
        state = false;
      }
    }
  });
  return state;
}

Comments = {
  data: {
    comments: [],
  },
  inputComment: '',
  user: {
    published: false,
    ip: '',
    country: '',
  },
  relevance: true,
  count: null,
  network: true,
  online() {
    Comments.network = true;
    m.redraw();
  },
  offline() {
    Comments.network = false;
    m.redraw();
  },
  load(input) {
    Comments.relevance = true;
    if (navigator.connection.type === 'none') {
      Comments.network = false;
    } else {
      getCommentsFromServer(input).then((result) => {
        Comments.data.comments = result.data;
        Comments.sort();
      });
    }
  },
  ipFetch() {
    return m
      .request({
        metohd: 'GET',
        url: ipURL,
        withCredentials: false,
      })
      .then((result) => {
        Comments.user.ip = result.ip;
        Comments.user.country = result.country_name;
      });
  },
  save(word) {
    if (relevanceAlgorithm(Comments.inputComment, word)) {
      const apiData = {
        date: Comments.date,
        comment: Comments.inputComment,
        rank: 0,
        region: Comments.user.country,
        ip: Comments.user.ip,
      };
      // save comment with API
    } else {
      Comments.relevance = false;
      Comments.inputComment = '';
    }
  },
  vote(vnode, vote) {
    // vote comment with API
  },
  sort() {
    Comments.data.comments.sort(compare);
  },
};

module.exports = Comments;
