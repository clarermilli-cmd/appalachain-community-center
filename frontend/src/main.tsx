import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fontsource-variable/nunito";
import "./index.css";
import "./theme/css/community-center.css";
import "./App.css";

// Created by Amplify. It's generated during each deploy, and you download a
// copy for local development (it isn't stored in git).
import outputs from "../amplify_outputs.json";
import App from "./App";

Amplify.configure(outputs);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
