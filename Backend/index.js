import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { buildContext } from 'graphql-passport'
import passport from 'passport';
import session from 'express-session';
import ConnectMongoDBSession from 'connect-mongodb-session';

import mergedResolver from "./resolver/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import { connectDb } from './db/connectDB.js';

const app = express()
const httpServer = http.createServer(app);
dotenv.config();

const MongodbStore = ConnectMongoDBSession(session)

const store = new MongodbStore ({
  uri: process.env.MONGO_URI,
  collection: "sessions"
})

app.use(
  session({
    secret:process.env.SESSION_SECRETE,
    resave:false,
    saveUninitialized:false,
    cookie:{
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly:true},
    store:store  
  })
)

app.use(passport.initialize())
app.use(passport.session())

const server = new ApolloServer({
  typeDefs:mergedTypeDefs,
  resolvers:mergedResolver,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await server.start()

app.use(
  '/',
  cors({
    origin:"http://localhost:5173",
    credentials:true
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => buildContext({ req }),
  }),
);


await new Promise((resolve) =>
  httpServer.listen({ port: process.env.PORT }, resolve),
);

await connectDb()
console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/`);
