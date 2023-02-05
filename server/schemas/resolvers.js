const { signToken } = require("../utils/auth");
const { User } = require("../models");
//const bookSchema = require("../models/Book");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  // This querry should pull back the user with bookID
  Query: {
    // users: async (username) => {
    //   return User.find(username).populate("BookID");
    // },
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    users: async () => {
      return User.find();
    },
  },
  // one for each listed in the tyedefs
  Mutation: {
    // create a user
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    //login functionality
    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);

      return { token, user };
    },
    // updated this section.

    // look to see if we can change bookData to another name.

    // this section looks for the signed in user and pushes the books that this user has.
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $push: { savedBooks: bookData },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      //Requires the user to be logged in to exectute this mutation.
      throw new AuthenticationError("You need to be logged in!");
    },
    //This will check that user is logged in and find the book by ID and delete that book from users profile.
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
      }
      // error message if the user is not signed in.
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
