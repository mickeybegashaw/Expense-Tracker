import passport from "passport";
import bcrypt from "bcryptjs";

import User from "../models/user.model";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log("Serializing user");
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("Deserializing User");

    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = User.findOne(username);
        if (!user) {
          throw new Error("Invalid username or password");
        }
        const validPassword = bcrypt.compare(passport, user.password);

        if (!validPassword) {
          throw new Error("Invalid username or password");
        }
      } catch (error) {
        return done(error);
      }
    })
  );
};
