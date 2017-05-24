export const path = '/sample';
export function action(req) {
  console.log('request body', req.body);
  return [{
    index: 'test',
    type: 'sample',
    doc: {
      field1: 'test',
      time: new Date(),
    },
  }, {
    index: 'test2',
    type: 'sample',
    doc: {
      field2: 'test',
      time: new Date(),
    },
  }];
}
