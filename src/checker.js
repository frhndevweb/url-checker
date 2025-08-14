// src/checker.js
import fetch from 'node-fetch';

export async function checkUrl(url, timeout = 5000) {
  const start = Date.now();
  let finalUrl = url;

  if (!/^https?:\/\//i.test(url)) {
    finalUrl = `http://${url}`;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const res = await fetch(finalUrl, { redirect: 'follow', signal: controller.signal });
    clearTimeout(timer);
    const end = Date.now();

    return {
      url: finalUrl,
      status: res.status,
      time: end - start,
      redirect: res.url && res.url !== finalUrl ? res.url : null
    };
  } catch {
    const end = Date.now();
    return {
      url: finalUrl,
      status: 'ERR',
      time: end - start,
      redirect: null
    };
  }
}
