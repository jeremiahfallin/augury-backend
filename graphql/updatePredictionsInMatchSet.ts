import { KeystoneContext } from "@keystone-next/keystone/types";

const graphql = String.raw;
export default async function updatePredictionsInMatchSet(
  context: KeystoneContext,
  matchSet: string
) {
  // Query the matchSet for list of matches.
  const matches = await context.query.Match.findMany({
    where: { matchSet: { id: { equals: matchSet } } },
    resolveFields: graphql`
      id
      matchSet {
        id
        lockInTime
      },
      blue {
        id
      }
      red {
        id
      }
    `,
  });

  for (let match of matches) {
    // Count the number of blue and red predictions for the match.
    const bluePredictions = await context.db.Prediction.count({
      where: {
        AND: [
          { predictedMatch: { id: { equals: match.id } } },
          { predictedTeam: { id: { equals: match.blue.id } } },
        ],
      },
    });
    const redPredictions = await context.db.Prediction.count({
      where: {
        AND: [
          { predictedMatch: { id: { equals: match.id } } },
          { predictedTeam: { id: { equals: match.red.id } } },
        ],
      },
    });

    // Update the match with the number of predictions for red and blue teams.
    await context.query.Match.updateOne({
      where: { id: match.id },
      data: {
        bluePredictionsInMatch: bluePredictions,
        redPredictionsInMatch: redPredictions,
      },
    });
  }
}
