/* jshint browser: true */
'use strict';
var m = require('mithril');
var Words = {};

function fail(err) {
  console.log('Error ', err);
}

var serverURL = 'http://localhost:3000';
var fileNameCachedDataAndroid = 'Words.data.json';

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
      Words.data = object;
      Words.loading = false;
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

function getDataFromServer() {
  return m
    .request({
      method: 'GET',
      url: serverURL + '/words/',
    })
    .then(result => {
      return Promise.resolve(result.data);
    });
}

function loadWordData() {
  var isAndroid = device.platform === 'Android' ? true : false;
  if (isAndroid) {
    if (Words.network) {
      return getDataFromServer();
    } else {
      getCachedDataAndroid(fileNameCachedDataAndroid);
    }
  } else {
    return getDataFromServer();
  }
}

var Words = {
  data: [],
  word: '',
  network: true,
  loading: true,
  load: function() {
    if (Words.data.length === 0) {
      switch (navigator.connection.type) {
        case 'none':
          getCachedDataAndroid(fileNameCachedDataAndroid);
          break;
        default:
          loadWordData().then(result => {
            // promise from data here
            Words.data = result.data;
            console.log(result.data);
          });
          break;
      }
    } else {
      // use cached info
    }
  },
  online: function() {
    Words.network = true;
    console.log('Device now online');
  },
  offline: function() {
    Words.network = false;
    console.log('Device now offline');
  },
};

module.exports = Words;
