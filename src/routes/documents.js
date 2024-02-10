const documentsController = require('../controllers/documents');

const _public = {};

_public.init = app => {
  app.get('/documents', documentsController.get);
  app.post('/documents', documentsController.crawl);
};

module.exports = _public;

