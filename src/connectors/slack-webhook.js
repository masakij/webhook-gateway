import { IncomingWebhook } from '@slack/client';

export const name = 'slack-webhook';
async function send(url, message) {
  const webhook = new IncomingWebhook(url);
  return new Promise((resolve, reject) => {
    webhook.send(message, (err, header, status, body) => {
      if (err) reject(err);
      else resolve(header, status, body);
    });
  });
}
export async function action(docs) {
  await Promise.all((docs || []).map(d =>
    send(d.url, d.message)));
}
