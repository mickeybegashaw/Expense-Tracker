import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, password, gender, name } = input;

        if (!username || !password || !gender || !name) {
          throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
          throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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

        if (context && typeof context.login === "function") {
          await context.login(newUser);
        }

        return newUser;
      } catch (error) {
        console.error("Signup Error:", error);
        throw new Error(error.message);
      }
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
        console.error("Login Error:", error);
        throw new Error("Invalid username or password");
      }
    },

    logout: async (_, __, context) => {
      try {
        await context.logout();
        if (context.req.session) {
          context.req.session.destroy((err) => {
            if (err) throw err;
          });
        }
        context.res.clearCookie("connect.sid");
        return { message: "Logout successfully" };
      } catch (error) {
        console.error("Logout Error:", error);
        throw new Error(error.message);
      }
    },
  },

  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("No authenticated user found");
        return user;
      } catch (error) {
        console.error("Auth User Error:", error);
        throw new Error("Authentication required");
      }
    },

    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        return user;
      } catch (error) {
        console.error("User Fetch Error:", error);
        throw new Error("User not found");
      }
    },
  },
};

export default userResolver;
