import express from 'express';
import bodyParser from 'body-parser';
import requireDir from 'require-dir';

const routes = requireDir('./routes');
const connectors = (() => {
  const c = requireDir('./connectors');
  return Object.keys(c).reduce((m, k) => {
    const v = c[k];
    console.log(`(${k}) connector: ${v.name}`);
    return Object.assign({}, m, {
      [v.name]: v.action,
    });
  }, {});
})();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

Object.keys(routes).forEach((k) => {
  const v = routes[k];
  console.log(`(${k}) path: ${v.path}`);
  app.use(v.path, async (req, res, next) => {
    try {
      const start = new Date();
      console.log(`[${start}] starting ${v.path}`);
      const data = await v.action(req);

      console.log(`[${new Date}] data`, data);
      const groups = (data || []).reduce((m, d) => {
        const g = m[d.conector] || []
        g.push(d);
        m[d.conector] = g;
        return m;
      }, {});

      await Promise.all(Object.keys(groups).map(async (k) => {
        const c = connectors[k];
        if (c) {
          await c(groups[k]);
        } else {
          console.warn(`CONNECTOR NOT FOUND: ${k}`);
        }
        return true;
      }));

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
