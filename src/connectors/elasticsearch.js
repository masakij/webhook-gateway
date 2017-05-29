import elasticsearch from 'elasticsearch';
import { ES_HOST } from '../config';

const client = new elasticsearch.Client({
  host: ES_HOST,
});

export const name = 'elasticsearch';
export async function action(docs) {
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
}
