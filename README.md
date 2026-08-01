# Task-List-API

Task List API: Built with TypeScript, GraphQL Yoga, Prisma, GraphQL and Pothos for creating, updating and deleting tasks and tasklist.

# Tech Stack

Languages: Typescript, GraphQL
Server & Runtime: GraphQL yoga, Node.js
Schema: Prisma(DB schema) & Pothos(GraphQL schema)
Database: PostgreSQL, Docker(container/environment)
Other: Zod(Validation)

Requirements: Docker Desktop

# Getting started:

Please start with npm install to install dependencies.

# Check .gitignore

Ensure the following is in .gitignore:

```
.env*
!.env.example
node_modules
dist
db-data
/generated/prisma
```

# .env

Create .env file at root directory and paste the contents of .env.example inside.

# Setting up Database Container with Docker

Mac instructions only:
To install Docker, use the following commands:

```
brew install --cask docker
brew install docker-compose

// To turn on the container:
docker-compose up -d

// To turn off the container:
docker-compose stop

// To check container health:
docker ps
```

Delete pgadmin-data and init.sql directories for housekeeping if desired.

Once the Docker container is running, add the schema to the database by running the following command:

```
npx prisma migrate dev --name init
```

To check GUI of schema use the following command:

```
npx prisma studio
```

# Run the server

Use the following command to run the server listener:

```
npm run dev
```

If migrations go out of sync or have trouble, try clearing cache and remigrating:

```
docker-compose down
rm -rf db-data
docker-compose up -d
npx prisma migrate dev --name init
```

## Dependency commands / Info

```
brew install --cask docker // install Docker desktop
brew install docker-compose // docker commands
npm install typescript  // JS superset with static "type" objects.
npm install @types/node // allows TS to read Node API.
npm install -D tsx // modern TS runner + watch mode, replaced ts-node-dev for Prisma 7 compatibility
npm install prisma // cli tool used during development for generate/migrate commands
npm install @prisma/client // runtime library which reads prisma.schema
npm install graphql //type based query language
npm install graphql-yoga // HTTP server, port listener, takes requests and passes to graphQL to execute and sends back response.
npm install @pothos/core //schema builder able to define graphQL with type inferrence
npm install @pothos/plugin-prisma // add-on for pothos/core specifically to speak to prisma
npm install @prisma/adapter-pg // prisma 7 package - driver adapter
npm install dotenv    // package bridging .env to process.env

```
