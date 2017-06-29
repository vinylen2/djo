const m = require('mithril');

let Words = {};

function fail(err) {
  console.log('Error ', err);
}

const serverURL = 'http://localhost:3000';

function getDataFromServer() {
  return m
    .request({
      method: 'GET',
      url: `${serverURL}/words/week`,
    })
    .then(result => Promise.resolve(result.data));
}

function cacheWordsRequest(data, objectName) {
  localStorage.setItem(objectName, JSON.stringify(data));
}

function loadFromLocalstorage(objectName) {
  const retrievedObject = localStorage.getItem(objectName);
  return JSON.parse(retrievedObject);
}
function loadWordData() {
  if (Words.network) {
    return getDataFromServer();
  } else {
    return Promise.resolve(loadFromLocalstorage('wordsObject'));
  }
}

Words = {
  data: [],
  network: true,
  loading: false,
  load() {
    return new Promise((resolve, reject) => {
      loadWordData()
        .then((result) => {
          Words.loading = false;
          Words.data = result;
          cacheWordsRequest(result.data, 'wordsObject');
          resolve(result);
        })
        .catch((error) => {
          console.log(error);
          const errorMessage = new Error('Data not fecthed');
          reject(errorMessage);
        });
    });
  },
  getWords() {
    return loadFromLocalstorage('wordsObject');
  },
  online() {
    Words.network = true;
    console.log('Device now online');
  },
  offline() {
    Words.network = false;
    console.log('Device now offline');
  },
};

module.exports = Words;
