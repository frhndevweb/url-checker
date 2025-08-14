// src/utils.js
import config from './config.js';

export function generateRandomUrls(count = config.defaultCount) {
  const urls = [];
  for (let i = 0; i < count; i++) {
    const domain = config.randomDomains[Math.floor(Math.random() * config.randomDomains.length)];
    const protocol = Math.random() > 0.5 ? 'http' : 'https';
    const path = Math.random() > 0.5 ? `/path${Math.floor(Math.random() * 100)}` : '';
    urls.push(`${protocol}://${domain}${path}`);
  }
  return urls;
}
