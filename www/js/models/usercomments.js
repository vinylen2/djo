/* jshint browser: true */
'use strict';
var m = require('mithril');

var ipURL = 'http://freegeoip.net/json/';

var fileNameCachedCommentsAndroid = 'comments.json';

function fail(err) {
  console.log('Error ', err);
}

function compare(a, b) {
  var comparison = 0;
  if (a.rank < b.rank) {
    comparison = 1;
  } else if (b.rank < a.rank) {
    comparison = -1;
  }
  return comparison;
}

function writeDataAndroid(fileName, data) {
  window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(
    directoryEntry,
  ) {
    directoryEntry.getFile(fileName, { create: true }, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function() {
          console.log('Write of file ' + fileName + ' completed');
        };
        fileWriter.onerror = function(e) {
          console.log('Write failed: ' + e.toString());
        };

        var stringData = JSON.stringify(data);
        fileWriter.write(stringData);
      });
    });
  });
}

function readCachedData(fileEntry) {
  fileEntry.file(function(file) {
    var reader = new FileReader();
    reader.onloadend = function() {
      var object = JSON.parse(this.result);
      UserComments.data = object;
      m.redraw();
    };
    reader.readAsText(file);
  }, fail);
}

function getCachedDataAndroid(fileName) {
  window.resolveLocalFileSystemURL(
    cordova.file.dataDirectory + fileName,
    readCachedData,
    fail,
  );
}

function relevanceAlgorithm(array, word) {
  var state = false;
  var allWords = array.split(' ');
  allWords.forEach(inputWord => {
    var formattedWord = inputWord.toLowerCase();
    if (formattedWord === 'godmode') {
      UserComments.cheat = true;
      // state = true;
    } else if (formattedWord === 'humanmode') {
      UserComments.cheat = false;
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

function updateStorage(date, comment, commentId, voteId) {
  var content = localStorage.getItem(date);
  content = JSON.parse(content);
  if (comment) {
    content.comment.data = comment;
    if (!UserComments.cheat) {
      content.comment.published = true;
    }
  }
  if (commentId) {
    content.comment.id = commentId;
  }
  if (voteId) {
    content.votes[voteId] = true;
  }
  localStorage.setItem(date, JSON.stringify(content));
  UserComments.data.storage = content;
}

function populateStorage(date) {
  if (localStorage.length === 0) {
    var content = {
      date: date,
      comment: { id: null, data: null, published: false },
      votes: [],
    };
    localStorage.setItem(date, JSON.stringify(content));
    UserComments.data.storage = content;
  }
  updateStorage(UserComments.date);
}

function zero_pad(number) {
  if (number < 10) {
    number = '0' + number;
  }
  return number;
}

function setDate(input) {
  if (input) {
    UserComments.date = input;
  } else {
    var today = new Date();
    UserComments.date =
      today.getFullYear() +
      '-' +
      zero_pad(parseInt(today.getMonth()) + 1) +
      '-' +
      today.getDate();
  }
}

var UserComments = {
  cheat: false,
  date: '',
  data: {
    comments: [],
    storage: { comment: { published: '' }, votes: {} },
  },
  inputComment: '',
  user: {
    ip: '',
    country: '',
  },
  relevance: true,
  count: null,
  network: true,
  online: function() {
    UserComments.network = true;
    m.redraw();
  },
  offline: function() {
    UserComments.network = false;
    m.redraw();
  },
  showCommentsOfSelectedDay: function() {
    UserComments.data.comments = UserComments.data.comments.filter(comment => {
      return comment.date === UserComments.date;
    });
  },
  load: function(input) {
    UserComments.relevance = true;
    setDate(input);
    populateStorage(UserComments.date);
    if (navigator.connection.type === 'none') {
      UserComments.network = false;
      getCachedDataAndroid('comments.json');
      UserComments.showCommentsOfSelectedDay();
      console.log(UserComments.data.comments);
    } else {
      // fetch Comments from API
    }
  },
  sort: function() {
    UserComments.data.comments.sort(compare);
  },
  ipFetch: function() {
    return m
      .request({
        metohd: 'GET',
        url: ipURL,
        withCredentials: false,
      })
      .then(function(result) {
        UserComments.user.ip = result.ip;
        UserComments.user.country = result.country_name;
      });
  },
  save: function(word) {
    if (relevanceAlgorithm(UserComments.inputComment, word)) {
      var apiData = {
        id: UserComments.count,
        date: UserComments.date,
        comment: UserComments.inputComment,
        rank: 0,
        country: UserComments.user.country,
        ip: UserComments.user.ip,
      };
      // save comment with API
    } else {
      UserComments.relevance = false;
      UserComments.inputComment = '';
    }
  },
  vote: function(vnode, vote) {
    var newRank;
    if (vote) {
      newRank = vnode.rank + 1;
    } else {
      newRank = vnode.rank - 1;
    }
    // vote comment with API
  },
};

module.exports = UserComments;
