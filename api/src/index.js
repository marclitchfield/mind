import { createServer } from './server';

const server = createServer();

server.listen(process.env.PORT || 5000, '0.0.0.0').then(({ url }) => {
  console.log(`GraphQL API ready at ${url}`);
});