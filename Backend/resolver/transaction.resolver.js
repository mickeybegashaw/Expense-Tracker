import Transaction from "../models/transaction.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => { 
      try {
        const user = await context.getUser(); // Await context.getUser()

        if (!user) throw new Error("Unauthorized");

        const transactions = await Transaction.find({ userId: user._id });
        return transactions;
      } catch (error) {
        console.error(error);
        throw new Error("Error getting transactions");
      }
    },

    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.error(error);
        throw new Error("Error getting transaction");
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const user = await context.getUser(); // Await context.getUser()

        if (!user) throw new Error("Unauthorized");

        const newTransaction = new Transaction({
          ...input,
          userId: user._id, // Use user._id instead of context.getUser()._id
        });

        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.error(error);
        throw new Error("Error creating transaction");
      }
    },

    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (error) {
        console.error(error);
        throw new Error("Error updating transaction");
      }
    },

    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
        return deletedTransaction;
      } catch (error) {
        console.error(error);
        throw new Error("Error deleting transaction");
      }
    },
  },
};

export default transactionResolver;
