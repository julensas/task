require('es6-promise').polyfill();
require('isomorphic-fetch');

const baseUrl = 'http://private-38e18c-uzduotis.apiary-mock.com/';

function checkStatus(response) {
  if (response.ok) {
    return response.json()
      .then(json => Promise.resolve(json))
      .catch(() => Promise.resolve(response));
  }
  return response.json()
    .then(json => Promise.reject(json))
    .catch(() => Promise.reject(response));
}

function enhancedFetch(url, options = {}) {
  const extendedOptions = options;
  if (typeof options.body === 'object') {
    extendedOptions.body = JSON.stringify(options.body);
  }
  return fetch(`${baseUrl}${url}`, extendedOptions)
    .then(checkStatus);
}

const get = url =>
  enhancedFetch(url, {
    method: 'get',
  });

module.exports = {
  get,
};
