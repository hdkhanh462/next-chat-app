import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
  userAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  adminPage: ["view"],
  video: [
    "view",
    "upload",
    "update",
    "delete",
    "view:own",
    "update:own",
    "delete:own",
  ],
} as const;

export const accessControl = createAccessControl(statement);

export const adminRole = accessControl.newRole({
  adminPage: ["view"],
  video: [
    "view",
    "upload",
    "update",
    "delete",
    "view:own",
    "update:own",
    "delete:own",
  ],
  ...adminAc.statements,
});

export const userRole = accessControl.newRole({
  video: ["upload", "view:own", "update:own", "delete:own"],
  ...userAc.statements,
});
