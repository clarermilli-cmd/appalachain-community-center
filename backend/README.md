# Legacy Express backend (not used by the current site)

The current React frontend uses the AWS Amplify Gen 2 backend in `frontend/amplify/` for authentication, event data, and event photo storage. The root `amplify.yml` deploys that Amplify backend and the Vite frontend; it does not deploy this Express server.

This directory is retained as source reference only while the project is migrated. Do not start or deploy it as part of the Amplify site unless you intentionally decide to bring the Express service back into use. Local `.env` files, SQLite databases, database journals, and uploaded files are deliberately excluded from the shared project archive.
