import { integer, relationship, text } from "@keystone-next/keystone/fields";
import { list } from "@keystone-next/keystone";
import { isSignedIn, rules } from "../access";

export const Tournament = list({
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
    name: text(),
    match: relationship({ ref: "Match.tournament", many: true }),
    matchSet: relationship({ ref: "MatchSet.tournament", many: true }),
    entry: relationship({ ref: "Entry.tournament", many: true }),
    prediction: relationship({ ref: "Prediction.tournament", many: true }),
    slug: text({
      validation: { isRequired: true },
      isIndexed: "unique",
    }),
    maxTeamUses: integer(),
    maxEntries: integer(),
  },
});
