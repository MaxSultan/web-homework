const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat, GraphQLID } = graphql;
const { TransactionModel } = require('../data-models/Transaction');
const TransactionType = require('./transaction-type');
const Transactions = require('../query-resolvers/transaction-resolvers.js');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTransaction: {
      type: TransactionType,
      args: {
        user_id: { type: GraphQLString },
        description: { type: GraphQLString },
        merchant_id: { type: GraphQLString },
        debit: { type: GraphQLBoolean },
        credit: { type: GraphQLBoolean },
        amount: { type: GraphQLFloat }
      },
      /* eslint-disable-next-line camelcase */
      resolve(parentValue, { user_id, description, merchant_id, debit, credit, amount }) {
        return new TransactionModel({ user_id, description, merchant_id, debit, credit, amount }).save();
      }
    },
    deleteTransaction: {
      type: TransactionType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parentValue, { id }) {
        return TransactionModel.findById(id).remove();
      }
    }
  }
});

module.exports = mutation;
