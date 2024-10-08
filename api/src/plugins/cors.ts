import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

import { HOME_LOCATION } from '../utils/env';

const allowedOrigins = [
  'https://www.freecodecamp.dev',
  'https://fcc.navgurukul.org',
  'https://beta.freecodecamp.dev',
  'https://beta.freecodecamp.org',
  'https://chinese.freecodecamp.dev',
  'https://chinese.freecodecamp.org'
];

const cors: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.options('*', (_req, reply) => {
    void reply.send();
  });

  fastify.addHook('onRequest', async (req, reply) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      void reply.header('Access-Control-Allow-Origin', origin);
    } else {
      // TODO: Discuss if this is the correct approach. Standard practice is to
      // reflect one of a list of allowed origins and handle development
      // separately. If we switch to that approach we can replace use
      // @fastify/cors instead.
      void reply.header('Access-Control-Allow-Origin', HOME_LOCATION);
    }

    void reply
      .header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Csrf-Token'
      )
      .header('Access-Control-Allow-Credentials', true)
      // These 4 are the only methods we use
      .header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
      // Vary: Origin to prevent cache poisoning
      // TODO: do we need Vary: Accept-Encoding?
      .header('Vary', 'Origin, Accept-Encoding');
  });

  done();
};

export default fp(cors);
