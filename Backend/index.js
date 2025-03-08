import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import mergedResolver from "./resolver/index.js";
import mergedTypeDefs from "./typeDefs/index.js";

const app = express()
const httpServer = http.createServer(app);
dotenv.config();

const server = new ApolloServer({
  typeDefs:mergedTypeDefs,
  resolvers:mergedResolver,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await server.start()

app.use(
  '/',
  cors(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  }),
);


await new Promise((resolve) =>
  httpServer.listen({ port: process.env.PORT }, resolve),
);
console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/`);
