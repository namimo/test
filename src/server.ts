import 'reflect-metadata';
import { useContainer, getConnectionOptions, createConnection } from 'typeorm';
import Container from 'typedi';
import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyForm from 'fastify-formbody';

import { createSchema } from './utils/createSchema';
import AuthRoute from './modules/auth/auth.controller';

(async () => {
  const app = fastify({ logger: true });
  try {
    // For data mapper (dependency injection using typedi)
    useContainer(Container);
    // Database connection
    const dbConfig = await getConnectionOptions(
      process.env.NODE_ENV || 'production',
    );
    await createConnection({
      ...dbConfig,
      name: 'default',
    });

    // Apollo graph server
    const apolloServer = new ApolloServer({
      schema: await createSchema(),
      context: async ({ req, res }) => ({ req, res }),
      engine: {
        apiKey: 'service:rewise-super:JLo54ibdsoJFZRraRc7IzA',
      },
    });

    // App Middlewares
    app.register(fastifyCors);
    app.register(fastifyForm);

    // App routes
    app.register(AuthRoute, { prefix: '/api/auth' });

    // Applying apollo server to app
    app.register(apolloServer.createHandler());

    // Starting server
    const port = 3009;
    await app.listen(port);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
