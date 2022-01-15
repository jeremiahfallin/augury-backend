import { checkbox } from "@keystone-next/keystone/fields";

export const permissionFields = {
  // See all users.
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: "User can query other users",
  }),
  // Can manage users.
  canManageUsers: checkbox({
    defaultValue: false,
    label: "User can Edit other users",
  }),
  // Can manage roles.
  canManageRoles: checkbox({
    defaultValue: false,
    label: "User can CRUD roles",
  }),
  // Can manage tournaments.
  canManageTournaments: checkbox({
    defaultValue: false,
    label: "User can see and manage tournaments",
  }),
  // Can manage predictions.
  canManagePredictions: checkbox({
    defaultValue: false,
    label: "User can see and manage predictions",
  }),
  canManageEntries: checkbox({
    defaultValue: false,
    label: "User can see and manage entries",
  }),
};

export type Permission = keyof typeof permissionFields;

export const permissionsList: Permission[] = Object.keys(
  permissionFields
) as Permission[];
