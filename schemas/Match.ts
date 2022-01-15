import { integer, relationship } from "@keystone-next/keystone/fields";
import { list } from "@keystone-next/keystone";
import { isSignedIn, rules } from "../access";

export const Match = list({
  access: {
    operation: {
      create: isSignedIn,
      query: () => true,
    },
    filter: {
      update: (args) => rules.canManageTournamentsFilter(args),
      delete: (args) => rules.canManageTournamentsFilter(args),
    },
  },
  fields: {
    tournament: relationship({ ref: "Tournament.match" }),
    blue: relationship({ ref: "Team" }),
    red: relationship({ ref: "Team" }),
    bluePredictionsInMatch: integer({ defaultValue: 0 }),
    redPredictionsInMatch: integer({ defaultValue: 0 }),
    matchSet: relationship({ ref: "MatchSet.match" }),
    winner: relationship({ ref: "Team" }),
    prediction: relationship({ ref: "Prediction.predictedMatch", many: true }),
  },
  ui: {
    listView: {
      initialColumns: ["blue", "red", "tournament"],
    },
  },
});
