import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

const backend = defineBackend({ auth, data, storage });

// Admin-only accounts: nobody can sign themselves up. You create each admin
// in the AWS console (Cognito), so the only people who can log in are the
// ones you add.
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.adminCreateUserConfig = {
  allowAdminCreateUserOnly: true,
};
