const baseResource = require('../resources/base');

const _public = {};

_public.get = async (req, res) => {
  const { url } = req.query;
  const { status, body } = url ? await crawlByGet(url) : { status: 200, body: [] };
  res.status(status).send(body);
};

_public.crawl = async (req, res) => {
  const { url, body } = req.body;
  if(url) {
    const { status, data } = await crawlByPost(url, body);
    res.status(status).send({ data });
  } else {
    res.status(422).send({ error: 'No URL found in the request body' });
  }
};

async function crawlByPost(url, body){
  return baseResource.post(url, body).then(({ data }) => ({
    status: 200,
    data,
  })).catch(handleCrawlError);
}

async function crawlByGet(url){
  return baseResource.get(url).then(({ data }) => ({
    status: 200,
    body: [{ data }]
  })).catch(handleCrawlError);
}

function handleCrawlError(err){
  return {
    status: 500,
    body: { error: err }
  };
}

module.exports = _public;
