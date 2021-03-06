const superagent = require('superagent');
const log = require('@vladmandic/pilogger');
const node = require('../package.json');

let config = { hosts: [] };

async function update(initial) {
  if (initial && initial.host) config = initial;
  for (const hostname of config.host) {
    superagent
      .get('dynupdate.no-ip.com/nic/update')
      .set('User-Agent', `${node.name}/${node.version}`)
      .auth(config.user, config.password)
      .query({ hostname })
      .then((res) => {
        const text = (res && res.text) ? res.text.replace('\r\n', '') : 'unknown';
        const status = (res && res.status) ? res.status : 'unknown';
        const rec = { hostname, status, text };
        log.state('NoIP:', rec);
      })
      .catch((err) => {
        log.warn(`NoIP error: ${err}`);
      });
  }
  setTimeout(update, 3600 * 1000 * 2);
}

exports.update = update;
