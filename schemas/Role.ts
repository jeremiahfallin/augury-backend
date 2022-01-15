import { relationship, text } from "@keystone-next/keystone/fields";
import { list } from "@keystone-next/keystone";
import { permissions } from "../access";
import { permissionFields } from "./fields";

export const Role = list({
  access: {
    operation: {
      create: (args) => permissions.canManageRoles(args),
      query: (args) => permissions.canManageRoles(args),
      update: (args) => permissions.canManageRoles(args),
      delete: (args) => permissions.canManageRoles(args),
    },
  },
  ui: {
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    isHidden: (args) => !permissions.canManageRoles(args),
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    ...permissionFields,
    assignedTo: relationship({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
  },
});
