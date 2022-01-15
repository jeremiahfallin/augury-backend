import { graphQLSchemaExtension } from "@keystone-next/keystone";
import enterPredictions from "./enterPredictions";

// make fake gql tagged template literal
const graphql = String.raw;
export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: graphql`
    input PredictionInput {
      teamId: ID!
      matchId: ID!
    }
    type Mutation {
      enterPredictions(entryId: ID!, predictions: [PredictionInput]): Entry
    }
  `,
  resolvers: {
    Mutation: {
      enterPredictions,
    },
  },
});
