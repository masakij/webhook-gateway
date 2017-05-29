export const name = 'console';
export function action(docs) {
  console.log('-- OUTPUT --');
  console.log(JSON.stringify(docs, null, 2));
  console.log('------------');
}
