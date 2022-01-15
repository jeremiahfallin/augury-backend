import "dotenv/config";
import { relationship, text } from "@keystone-next/keystone/fields";
import { list } from "@keystone-next/keystone";
import { cloudinaryImage } from "@keystone-next/cloudinary";
import { isSignedIn, rules } from "../access";

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: "sickfits",
};

export const TeamImage = list({
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
    image: cloudinaryImage({
      cloudinary: cloudinary,
      label: "Source",
    }),
    altText: text(),
    team: relationship({ ref: "Team.photo" }),
  },
  ui: {
    listView: {
      initialColumns: ["image", "altText", "team"],
    },
  },
});
