import { config } from "@keystone-next/keystone";
import { statelessSessions } from "@keystone-next/keystone/session";
import { createAuth } from "@keystone-next/auth";

import { User } from "./schemas/User";
import { Role } from "./schemas/Role";
import { Entry } from "./schemas/Entry";
import { Prediction } from "./schemas/Prediction";
import { Tournament } from "./schemas/Tournament";
import { Match } from "./schemas/Match";
import { MatchSet } from "./schemas/MatchSet";
import { Team } from "./schemas/Team";
import { TeamImage } from "./schemas/TeamImage";
import { sendPasswordResetEmail } from "./lib/mail";
import { permissionsList } from "./schemas/fields";

import { extendGraphqlSchema } from "./graphql";

const session = statelessSessions({
  maxAge: 60 * 60 * 24 * 360,
  secret: process.env.COOKIE_SECRET,
});

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  sessionData: `id name email role { ${permissionsList.join(" ")} }`,
  initFirstItem: {
    fields: ["name", "email", "password"],
    // TODO: add in initial roles.
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email.
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});

export default withAuth(
  config({
    server: {
      // cors: {
      //   origin: [process.env.FRONTEND_URL],
      //   credentials: true,
      // },
    },
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL,
    },
    extendGraphqlSchema,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists: {
      // Schema items go in here
      User,
      Role,
      Entry,
      Prediction,
      Tournament,
      Match,
      MatchSet,
      Team,
      TeamImage,
    },
    session,
  })
);
