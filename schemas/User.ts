import { list } from "@keystone-next/keystone";
import { text, password, relationship } from "@keystone-next/keystone/fields";
import { rules, permissions } from "../access";

export const User = list({
  access: {
    operation: {
      create: () => true,
      read: rules.canManageUsers,
      update: rules.canManageUsers,
      // only people with the permission can delete themselves.
      delete: permissions.canManageUsers,
    },
  },
  ui: {
    // hide the backend UI from regular users.
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    password: password(),
    entry: relationship({
      ref: "Entry.user",
      many: true,
    }),
    prediction: relationship({
      ref: "Prediction.user",
      many: true,
    }),

    role: relationship({
      ref: "Role.assignedTo",
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
    }),
  },
});
