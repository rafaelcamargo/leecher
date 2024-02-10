const documents = require('./documents');
const root = require('./root');

const _public = {};

_public.init = app => {
  root.init(app);
  documents.init(app);
};

module.exports = _public;
