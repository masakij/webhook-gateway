const ENV = process.env;

const { PORT = 3000 } = ENV;
export { PORT };
const { ES_HOST = 'localhost:9200' } = ENV
export { ES_HOST };
