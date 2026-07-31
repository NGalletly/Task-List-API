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

## Dependency commands / Info

```
brew install --cask docker // install Docker desktop
brew install docker-compose // docker commands
npm install typescript  // JS superset with static "type" objects.
npm install @types/node // allows TS to read Node API.
npm install ts-node // compiles TS and runs it in 1 step.
npm install ts-node-dev  // auto-restart on file change
npm install prisma // cli tool used during development for generate/migrate commands
npm install @prisma/client // runtime library which reads prisma.schema
npm install graphql
npm install graphql-yoga
npm install @pothos/core
npm install @pothos/plugin-prisma

```
