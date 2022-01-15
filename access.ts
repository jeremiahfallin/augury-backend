import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatedPermissions,
};

export const rules = {
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Check if they have permission to manage users.
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // 2. Can only update themselves.
    return { id: session.itemId };
  },
  // Rule for managing tournaments.
  canManageTournamentsFilter({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Check if they have permission to manage tournaments.
    if (permissions.canManageTournaments({ session })) {
      return true;
    }
    // 2. Can only update if they own.
    return { user: { id: { equals: session.itemId } } };
  },
  // Rules for managing entries.
  canManageEntriesFilter({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Check if they have permission to manage entries.
    if (permissions.canManageEntries({ session })) {
      return true;
    }
    // 2. Can only update if they own.
    return { user: { id: { equals: session.itemId } } };
  },
  // Rules for managing predictions.
  canManagePredictionsFilter({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Check if they have permission to manage predictions.
    if (permissions.canManagePredictions({ session })) {
      return true;
    }
    // 2. Can only update if they own and matchSet hasn't started.
    return {
      AND: [
        { user: { id: { equals: session.itemId } } },
        { matchSet: { lockInTime: { gte: new Date().toISOString() } } },
      ],
    };
  },
};
