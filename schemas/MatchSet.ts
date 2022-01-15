import { relationship, timestamp } from "@keystone-next/keystone/fields";
import { list } from "@keystone-next/keystone";
import { rules, isSignedIn } from "../access";

export const MatchSet = list({
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
    lockInTime: timestamp(),
    match: relationship({ ref: "Match.matchSet", many: true }),
    tournament: relationship({ ref: "Tournament.matchSet" }),
    predictions: relationship({ ref: "Prediction.matchSet", many: true }),
  },
});
