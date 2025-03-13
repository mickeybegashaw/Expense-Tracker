import Transaction from "../models/transaction.model";
const transactionResolver = {
  Query: {
    transactions: async (_, _, context) => {
      try {
        if (!context.getUser()) throw new Error("Un authorized ");
        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId });
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
    createTransaction: async (_,{input},context)=>{
      try {
        
        const newTransaction = new Transaction({
          ...input,
          userId:context.getUser()._id
        })
        await newTransaction.save()
        return newTransaction
      } catch (error) {
        console.error(error)
        throw new Error("Error Creating transaction")
      }
    },
    updateTransaction: async (_,{input})=>{
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId,input,{new:true})
        return updatedTransaction
      } catch (error) {
        console.error(error)
        throw new Error("Error updating transaction")
      }
    },
    deleteTransaction: async (_,{transactionId})=>{
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(transactionId)
        return deletedTransaction
      } catch (error) {
        console.error(error)
        throw new Error("Error Deleting transaction")
      }
    },
  },
};

export default transactionResolver;
