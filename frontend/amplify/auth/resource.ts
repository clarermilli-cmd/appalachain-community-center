import { defineAuth } from "@aws-amplify/backend";

// Admins sign in with their email address and a password.
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
