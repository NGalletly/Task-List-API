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

## Check .gitignore

Ensure the following is in .gitignore:

```
.env*
!.env.example
node_modules
dist
db-data
/generated/prisma
src/generated
```

## .env

Create .env file at root directory and paste the contents of .env.example inside.

## Setting up Database Container with Docker

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

## Seed the database

To seed the database with sample task and tasklist data use the following command:

```
npm run seed
```

## Run the server

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

# Command index

Task and TaskList ids are generated automatically, so you'll need a real
one first. Run the `taskLists` query below, copy an `id` from the
response, then paste it into the query:

## -- Task List --

### To get all task lists with their tasks use the following query:

```
query {
  taskLists {
    id
    name
    tasks {
      id
      title
      completed
    }
  }
}
```

Example of the response:

```
{
  "data": {
    "taskLists": [
      {
        "id": "cmsaqoks60000jky8y6hnducc",
        "name": "Groceries",
        "tasks": [
          { "id": "...", "title": "Buy oat milk", "completed": false }
        ]}]}}
```

### To create task list by id use the following query:

```
mutation {
  addTaskList(name: "shopping") {
    id
    name
  }
}
```

Example response:

```
{
  "data": {
    "addTaskList": {
      "id": "cmsax523w0000qiy8fpiq48c7",
      "name": "shopping"
    }
  }
}
```

### To delete a task list use the following mutation:

```
mutation {
  deleteTaskList(id: "exampleIDplaceholder")
}
```

Example Response:

```
{
  "data": {
    "deleteTaskList": true
  }
}
```

## -- Task --

To obtain a task id string/value you will need to list all tasks using the following query:

```
query {
  tasks {
    items {
      id
      title
    }
  }
}
```

### Get task by id

To get task by id use the following query:

```
query {
  task(id: "placeholderTaskId") {
    id
    title
    completed
  }
}
```

Example response:

```
{
  "data": {
    "task": {
      "id": "cmsavxejn0003c6y8ln0dl4lr",
      "title": "Buy coffee",
      "completed": true
    }
  }
}
```

### Create task

To create task you'll need a tasklist ID by using the following query:

```
query {
  taskLists {
    id
    name
  }
}
```

After you have saved a taskList id string/value you can <b>create a new task</b> by using the following mutation:

```
mutation {
  addTask(title: "Buy Paper", taskListId: "placeholderTaskListId") {
    id
    title
    completed
    taskList { name }
  }
}
```

### Delete task

To delete task use the following mutation:

```
mutation{
  deleteTask(id: "placeholderTaskId") }
```

Example response:

```
{
  "data": {
    "deleteTask": true
  }
}
```

### Update task

For updating task you can update either the title of the task using the following mutation:

```
mutation {
  updateTask(id: "placeholderTaskId", title: "Buy tea (again)") {
    id
    title
  }
}
```

Or you can update the completion status of the task by flipping false to true like so:

```
mutation {
  updateTask(id: "placeholderTaskId", completed: true) {
    id
    title
    completed
  }
}
```

## -- TASKS --

### Get all tasks

To get all tasks use the following command:

```
query {
  tasks{
    items { title }
    totalCount
    hasMore
  }
}
```

### Filter/Get tasks by task list id

To get all tasks by using a task list id use the following query:

```
query {
  tasks(taskListId: "placeholderTaskListId", completed: false) {
    items { title }
    totalCount
    hasMore
  }
}
```

### Filter/Get all tasks by Completion

To get all tasks by completion status use the following query and toggle the (completed: true) to (completed: false) or vice versa:

```
query {
  tasks(completed: true) {
    items { id title }
    totalCount
    hasMore
  }
}
```

### Paginate results (skip / take)

With pagination use the skip/take keys and place in arguments that suit your needs.
To simulate showing 3 of 6 results leading to pagination use the following query:

```
query {
  tasks(skip: 0, take: 3) {
    items { title }
    totalCount
    hasMore
  }
}
```

Note: the example response property "hasMore": true:

```
{
  "data": {
    "tasks": {
      "items": [
        {
          "title": "Buy bread"
        },
        {
          "title": "Buy tea (again)"
        },
        {
          "title": "Finish take-home assessment"
        }
      ],
      "totalCount": 6,
      "hasMore": true
    }
  }
}
```

To simulate viewing 6 of 6 results(display all on 1 page) use the following query:

```
query {
  tasks(skip: 3, take: 3) {
    items { title }
    totalCount
    hasMore
  }
}
```

Note: the example response property "hasMore": false

```
{
  "data": {
    "tasks": {
      "items": [
        {
          "title": "Reply to emails"
        },
        {
          "title": "Prep for Monday interview"
        },
        {
          "title": "Buy paper"
        }
      ],
      "totalCount": 6,
      "hasMore": false
    }
  }
}
```

### Notes of pagination

I decided that `tasks` query would support offset-based pagination via `skip` and `take` arguments, mirroring Prisma's native pagination options directly.

Rather than returning a plain list, `tasks` returns a `TaskListResult` object. I decided this because I interpreted a Task List Api to be utilised by a front end application so that having meaningful data in the response can be used to display on a GUI for an improved user experience.
The TaskListResult object has three fields:

- `items` : the actual page of tasks
- `totalCount` : the total number of matching tasks, used in conjunction with items can show something like "Displaying 3 of 6 items"
- `hasMore` : displays a boolean signifiying if more results exist beyond the query, so a frontend can show or hide a "Load more" button without guessing

The default display is 20 items if `take` is not provided , this is a design choice to limit queries that may have large datasets and to secure performance. Results are ordered by `createdAt` to keep page boundaries steady if there are repeated requests and to show consistent row ordering.

The tasks query also has two independent and/or combinable filters which were demonstrated above:

- `taskListId` : scope results to a single task list
- `completed` :filter tasks by completion status

# Error Handling

### Error Handling & Validation Examples

All query and mutation inputs are validated with Zod and error handled with functions found in errorhandling directory. Try using the following commands:

Empty / whitespace-only name (TaskList) : Expected error: "name can't be empty"

```
mutation {
  addTaskList(name: "   ") {
    id
    name
  }
}
```

Empty / whitespace-only id (TaskList) : Expected error: "id can't be empty"

```
mutation {
  deleteTaskList(id: "   ")
}
```

Empty / whitespace-only task title : Expected error: "Task title can't be empty"

```
mutation {
  addTask(title: "   ", taskListId: "some-real-id") {
    id
    title
  }
}

```

Empty / whitespace-only task id, Expected error (all three): "Id can't be empty"

```

query {
  task(id: "   ") {
    id
    title
  }
}

mutation {
  deleteTask(id: "   ")
}

mutation {
  updateTask(id: "   ", title: "New title") {
    id
    title
  }
}

```

Negative skip on pagination , expected error: "skip can't be negative integer"

```
query {
  tasks(skip: -1) {
    items { title }
  }
}

```

Take check to be 1 or greater, expected error: "take has to be at least 1"

```
query {
  tasks(take: 0) {
    items { title }
  }
}
```

Empty taskListId filter, expected error: "taskListId can't be empty"

```
query {
  tasks(taskListId: "   ") {
    items { title }
  }
}
```

### Example error response shape

{
"errors": [
{
"message": "skip can't be negative integer",
"extensions": {
"code": "INVALID_INPUT"
}
}
],
"data": null
}

# Testing

To test ensure that vitest is installed and run the following command:

```
npm run test
```

# Decisions and design choices

### Why offset-based pagination:

I chose offset-based pagination because I decided that a taskList application would be utilised as a personal application, with smaller data sets set so customised task lists and jumping to decisive pages user would have or use. This approach could scale to small teams.

However, if the app would be designed to handle large volume, frequently changing,updated and rendered datasets in a infinite scroll feed, I would go with another form of pagination, like cursor based.

### Error handling:

I decided to deal with error handling by having a `validationCheck` helper function that runs a zod schema which returns a clean graphQL error code upon failure. This is to prevent a raw zod error leaking through to the user. I also chose a `entityLookUp` helper function that handles entity(id,name,title,etc) not found errors. This function checks if the record exists first and throws a not found error before Prisma gets a chance to throw its own unhandled error. Both are small, reusable helper functions that contain try/catch blocks. This means so resolvers can call the helper functions as a single line, rather than repeating try/catch blocks throughout the codebase to keep the codebase DRY.

### Test suite decisions:

I wanted to ensure testing worked in a linear fashion, sanitising the data, addding to the database and returning the clean data for the user to view. I think this was integral for this project to prove that the data pipeline is functional. I also wanted to test an unhappy path with deleting a task, to ensure that a correct error handling message is provided as the brief requires.

### Handling the N+1 issue

While making this project I found that when mapping Pothos types onto the Prisma models, I needed a way to handle mapping the relations(Tasks for TaskList). I researched and found a solution in the form of the `pothos/plugin-prisma`, which automatically handles nested queries into a single Prisma "include", instead of sending a query for each taskList. This seemed like killing two birds with one stone as
I believe this solved the n+1 issue as a byproduct.

# Dependency commands / Info

```

brew install --cask docker // install Docker desktop
brew install docker-compose // docker commands
npm install typescript // JS superset with static "type" objects.
npm install @types/node // allows TS to read Node API.
npm install -D tsx // modern TS runner + watch mode, replaced ts-node-dev for Prisma 7 compatibility
npm install prisma // cli tool used during development for generate/migrate commands
npm install @prisma/client // runtime library which reads prisma.schema
npm install graphql //type based query language
npm install graphql-yoga // HTTP server, port listener, takes requests and passes to graphQL to execute and sends back response.
npm install @pothos/core //schema builder able to define graphQL with type inferrence
npm install @pothos/plugin-prisma // add-on for pothos/core specifically to speak to prisma
npm install @prisma/adapter-pg // prisma 7 package - driver adapter
npm install dotenv // package bridging .env to process.env
npm install @pothos/plugin-simple-objects // allows defining extra plain GraphQL types
npm install zod // typescript schema validation, checks that data matches expected shape at runtime
npm install -D vitest // testing framework for running unit or integration tests

```

# Extension additions

If I had more time I would ensure thorough testing through more complex sanitisation tests, unhappy path and edge cases.
I would like to create an option to choose which pagination approach through a flag system in the create taskList mutation.
I would also want to research and attempt using the dataLoader approach to handling the n+1 issue.
I would also like to research more into error handling as I am used to the MVC error handling process, passing status codes and messages around with helper functions.
