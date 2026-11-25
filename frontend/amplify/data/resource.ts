import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  CenterEvent: a
    .model({
      title: a.string().required(),
      date: a.date().required(), // YYYY-MM-DD
      time: a.string(),
      location: a.string(),
      description: a.string(),
      photoPath: a.string(), // where the photo lives in storage
    })
    .authorization((allow) => [
      // Anyone visiting the site can read events...
      allow.guest().to(["read"]),
      // ...but only signed-in admins can add, change or delete them.
      allow.authenticated(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
