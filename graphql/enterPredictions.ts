import { KeystoneContext } from "@keystone-next/keystone/types";
import { Session } from "../types";
import updatePredictionsInMatchSet from "./updatePredictionsInMatchSet";

type EnterPredictionsInput = {
  entryId: string;
  predictions: Predictions[];
};

type Predictions = {
  tournamentId: string;
  teamId: string;
  matchId: string;
};

const graphql = String.raw;
export default async function enterPredictions(
  root: any,
  variables: EnterPredictionsInput,
  context: KeystoneContext
) {
  // Query current user to see if they're signed in.
  const sesh = context.session as Session;

  const userId = sesh.itemId;
  if (!userId) {
    throw new Error("You must be logged in to do this!");
  }

  // Query the entry to see if it exists.
  let entry = await context.query.Entry.findOne({
    where: { id: variables.entryId },
    resolveFields: graphql`
      id
      user {
        id
      }
      prediction {
        id
        matchSet {
          id
          lockInTime
        }
        predictedTeam {
          id
        }
        predictedMatch {
          id
        }
      }`,
  });
  // If entry not found.
  if (!entry) {
    throw new Error("Entry not found.");
  }

  // Confirm that the user is the owner of the entry.
  if (entry.user.id !== userId) {
    throw new Error("You can only enter predictions for your own entry.");
  }

  // Check if user has prediction in matchSet of predicted match.
  for (let i = 0; i < variables.predictions.length; i++) {
    const prediction = variables.predictions[i];
    const match = await context.query.Match.findOne({
      where: { id: prediction.matchId },
      resolveFields: graphql`
        id
        matchSet {
          id
          lockInTime
        },
        tournament {
          id
        }
        blue {
          id
        }
        red {
          id
        }
      `,
    });
    if (!match) {
      throw new Error("Match for prediction not found.");
    } else {
      const updatePrediction = entry.prediction.find(
        (p) => p.matchSet.id === match.matchSet.id
      );
      if (updatePrediction) {
        if (
          new Date(match.matchSet.lockInTime).valueOf() - new Date().valueOf() >
          0
        ) {
          await context.query.Prediction.updateOne({
            where: { id: updatePrediction.id },
            data: {
              predictedTeam: { connect: { id: prediction.teamId } },
              predictedMatch: { connect: { id: prediction.matchId } },
            },
          });
        }
      } else {
        await context.query.Prediction.createOne({
          data: {
            user: { connect: { id: userId } },
            matchSet: { connect: { id: match.matchSet.id } },
            predictedTeam: { connect: { id: prediction.teamId } },
            predictedMatch: { connect: { id: prediction.matchId } },
            tournament: { connect: { id: match.tournament.id } },
            entry: { connect: { id: entry.id } },
          },
        });
      }
      // await updatePredictionsInMatchSet(context, match.matchSet.id);
    }
  }

  // Return the updated entry.
  return entry;
}
