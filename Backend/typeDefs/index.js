import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDef.js";
import transactionTypeDefs from "./transaction.typeDef.js";
const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDefs]);

export default mergedTypeDefs;
