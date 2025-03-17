import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, password, gender, name } = input;

        if (!username || !password || !gender || !name) {
          throw new Error("All fields are required");
        }

        const existingUser = User.findOne({ username });

        if (existingUser) {
          throw new Error("user already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });
        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (error) {}
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        const user = await context.authenticate("graphql-local", {
          username,
          password,
        });
        await context.login(user);
        return user;
      } catch (error) {
        console.error(error);
      }
    },
    logout: async (_, context) => {
      try {
        await context.logout();
        req.session.destroy((err) => {
          if (err) throw err;
        });
        res.clearCookies("connect.sid");
        return { message: "Logout successfully" };
      } catch (error) {
        console.error(error);
      }
    },
  },
  Query: {
    authUser: async (_, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (error) {
        console.error(error);
      }
    },
    user: (_, { userId }) => {
      try {
        const user = User.findById(userId);
        return user;
      } catch (error) {
        console.error(error);
      }
    },
  },
};

export default userResolver;
