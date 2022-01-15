import { relationship, text, virtual } from "@keystone-next/keystone/fields";
import { list } from "@keystone-next/keystone";
import { isSignedIn, rules } from "../access";

export const Team = list({
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
    name: text({ validation: { isRequired: true } }),
    photo: relationship({
      ref: "TeamImage.team",
      ui: {
        displayMode: "cards",
        cardFields: ["image", "altText"],
        inlineCreate: { fields: ["image", "altText"] },
        inlineEdit: { fields: ["image", "altText"] },
      },
    }),
    prediction: relationship({ ref: "Prediction.predictedTeam", many: true }),
  },
});
