import express from 'express';
import bodyParser from 'body-parser';
import requireDir from 'require-dir';
import elasticsearch from 'elasticsearch';
import { ES_HOST } from './config';

const routes = requireDir('./routes');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = new elasticsearch.Client({
  host: ES_HOST,
});

Object.keys(routes).forEach((k) => {
  const v = routes[k];
  console.log(`(${k}) path: ${v.path}`);
  app.use(v.path, async (req, res, next) => {
    try {
      const start = new Date();
      console.log(`[${start}] starting ${v.path}`);
      const docs = await v.action(req);

      console.log(`[${new Date}] POST `, docs);
      const body = (docs || []).reduce((m, d) => {
        m.push({
          index: {
            _index: d.index,
            _type: d.type,
          },
        });
        m.push(d.doc);
        return m;
      }, []);
      if (body && body.length) {
        const r = await client.bulk({ body });
        console.log(`[${new Date}] bulk insert`, r, r.items);
      } else {
        console.warn('No Data');
      }

      res.sendStatus(200);
      const end = new Date();
      console.log(`[${end}] finished ${v.path} after ${end.getTime() - start.getTime()} ms`);
    } catch (e) {
      console.error(e);
      e.status = 500;
      next(e);
    }
  });
});
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(err.status || 500);
});

export default app;
