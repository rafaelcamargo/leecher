const { serve } = require('../services/testing');
const baseResource = require('../resources/base');

describe('Documents Routes', () => {
  function mockDocument(expectedUrl, html){
    const handleReponse = url => respond(expectedUrl, url, html);
    baseResource.get = jest.fn(handleReponse);
    baseResource.post = jest.fn(handleReponse);
  }

  function respond(expectedUrl, url, html){
    return url === expectedUrl && Promise.resolve({ data: html });
  }

  function buildHtmlMock(){
    return [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '<meta charset="UTF-8">',
      '<title>Greet</title>',
      '</head>',
      '<body>',
      '<h1>Hello!</h1>',
      '</body>',
      '</html>'
    ].join('');
  }

  it('should return an empty list by default', async () => {
    const response = await serve().get('/documents');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });

  it('should return the document found on the url passed as query param', async () => {
    const url = 'https://some.url.com/';
    const html = buildHtmlMock();
    mockDocument(url, html);
    const response = await serve().get(`/documents?url=${url}`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([{ data: html }]);
  });

  it('should return the document found on the url passed as payload', async () => {
    const url = 'https://some.url.com/';
    const body = { some: 'data' };
    const html = buildHtmlMock();
    mockDocument(url, html);
    const response = await serve().post('/documents').send({ url, body });
    expect(baseResource.post).toHaveBeenCalledWith(url, body);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ data: html });
  });

  it('should respond with error if document passed as query param could not be returned', async () => {
    const expectedUrl = 'https://other.url.com/';
    const err = 'some error';
    baseResource.get = jest.fn(url => url === expectedUrl && Promise.reject(err));
    const response = await serve().get(`/documents?url=${expectedUrl}`);
    expect(response.status).toEqual(500);
    expect(response.body).toEqual({ error: err });
  });

  it('should respond with error if no url has been passed as payload', async () => {
    baseResource.post = jest.fn();
    const response = await serve().post('/documents').send();
    expect(baseResource.post).not.toHaveBeenCalled();
    expect(response.status).toEqual(422);
    expect(response.body).toEqual({ error: 'No URL found in the request body' });
  });
});
