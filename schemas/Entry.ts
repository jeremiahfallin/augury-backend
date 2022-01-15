import { relationship, text, virtual } from "@keystone-next/keystone/fields";
import { list } from "@keystone-next/keystone";
import { graphql } from "@graphql-ts/schema";
import { rules, isSignedIn } from "../access";

const gql = String.raw;
export const Entry = list({
  access: {
    operation: {
      query: () => true,
    },
    filter: {
      update: (args) => rules.canManageEntriesFilter(args),
      delete: (args) => rules.canManageEntriesFilter(args),
    },
    item: {
      create: async (args) => {
        // Requirements are that user is signed in and also
        //   does not have maxed entries for given tournament.
        const { context, inputData } = args;
        const { maxEntries } = await context.query.Tournament.findOne({
          where: { id: inputData.tournament.connect.id },
          query: gql`
            maxEntries
          `,
        });
        const currentEntriesCount = await context.query.Entry.count({
          where: {
            AND: [
              {
                tournament: { id: { equals: inputData.tournament.connect.id } },
              },
              { user: { id: { equals: inputData.user.connect.id } } },
            ],
          },
        });
        if (currentEntriesCount >= maxEntries) {
          return false;
        }
        return isSignedIn(args);
      },
    },
  },
  fields: {
    user: relationship({
      ref: "User.entry",
    }),
    name: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    prediction: relationship({ ref: "Prediction.entry", many: true }),
    tournament: relationship({ ref: "Tournament.entry" }),
    active: virtual({
      field: graphql.field({
        type: graphql.Boolean,
        async resolve(item, args, context) {
          const predictions = await context.query.Prediction.findMany({
            where: { entry: { id: { equals: item.id } } },
            query: gql`
              id
              predictedTeam {
                id
              }
              predictedMatch {
                id
                winner {
                  id
                }
              }`,
          });

          return predictions.every(
            (prediction) =>
              prediction.predictedMatch.winner === null ||
              prediction.predictedTeam?.id ===
                prediction.predictedMatch.winner.id
          );
        },
      }),
    }),
  },
});
