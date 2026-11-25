import { defineStorage } from "@aws-amplify/backend";

// Event photos: anyone can view them, only signed-in admins can add or remove them.
export const storage = defineStorage({
  name: "eventPhotos",
  access: (allow) => ({
    "event-photos/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
    ],
  }),
});
