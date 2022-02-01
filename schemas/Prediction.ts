import { relationship, integer } from "@keystone-next/keystone/fields";
import { list } from "@keystone-next/keystone";
import { rules, isSignedIn } from "../access";
import updatePredictionsInMatchSet from "../graphql/updatePredictionsInMatchSet";

const graphql = String.raw;
export const Prediction = list({
  access: {
    operation: {
      create: isSignedIn,
      query: () => true,
    },
    filter: {
      update: (args) => rules.canManagePredictionsFilter(args),
      delete: (args) => rules.canManagePredictionsFilter(args),
    },
  },
  fields: {
    user: relationship({ ref: "User.prediction" }),
    matchSet: relationship({ ref: "MatchSet.predictions" }),
    predictedMatch: relationship({ ref: "Match.prediction" }),
    predictedTeam: relationship({ ref: "Team.prediction" }),
    tournament: relationship({ ref: "Tournament.prediction" }),
    entry: relationship({ ref: "Entry.prediction" }),
  },
  hooks: {
    afterOperation: async ({ context, item }) => {
      const matchSetId = item.matchSetId;
      await updatePredictionsInMatchSet(context, matchSetId);
    },
  },
});
