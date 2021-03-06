const logger = require('./logger');

async function get(req, res, next) {
  let status = 200;
  let html;
  let type = 'text/plain';
  switch (req.url) {
    case '/security.txt':
    case '/.well-known/security.txt':
      html = global.config['security.txt'];
      break;
    case '/robots.txt':
    case '/.well-known/robots.txt':
      html = global.config['robots.txt'];
      break;
    case '/humans.txt':
    case '/.well-known/humans.txt':
      html = global.config['humans.txt'];
      status = 418;
      break;
    case '/sitemap.xml':
    case '/.well-known/sitemap.xml':
      const host = req.headers[':authority'] || req.headers.host;
      html = (global.config['sitemap.xml'] || '').replace('URL', host);
      type = 'text/xml';
      status = 451;
      break;
    case '/.git/HEAD':
      html = global.config['git.head'];
      status = 403;
      break;
    default:
      next();
      return;
  }
  if (!html) {
    next();
    return;
  }
  res.writeHead(status, { 'Content-Type': `'${type}'`, 'Cache-Control': 'no-cache', 'X-Powered-By': `NodeJS/${process.version}` });
  logger(req, res);
  res.end(html, 'utf-8');
}

exports.get = get;

// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
