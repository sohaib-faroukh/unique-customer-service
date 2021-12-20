# chat-app




## Documentation:
### Functional requirements: 
1. client/agent (aka. `account`) can login
2. client can sign up
3. client can open new topic (aka. conversation) with support agent by providing a topic name, support agent will be selected randomly
4. client can remove a topic
5. client/agent can send and receive messages from agent
6. topics shows in realtime when created on the related client/agent chats list screen

## install the dependencies:
Run `npm install` and please use a reliable VPN if you are in Syria

## Run the app options:

### Run Docker image locally 
1. make sure Docker desktop is install 
2. build image `docker build --tag chat-app-img:latest . `
3. run container for port 80 `docker run -p 80:8080 --name chat-app-container  chat-app-img:latest`
4. open you browser on `http://localhost`

### Run app locally on production environment
1. make sure you install Node.js > v14.x and npm on your machine 
2. go to project root directory, run this build command `npm build`
3. after building is done, run start command `npm start`, this command will serve the application on port 8080
4. open you browser on `http://localhost:8080`

### Run app locally on development environment
1. make sure you install Node.js > v14.x, npm and Angular v13 globally on your machine 
2. run `npm run start:dev` this will Backend Node.js app locally on port 8080 
3. run `ng serve` this will serve the Frontend Angular app locally on port 4200 
4. open you browser on `http://localhost:4200` 


## Trial & Testing 

### WB testing 
#### Agent UI
1. login to the application using the following credintials:
   
   - email: `agent1@email.com`, password: `agent1@email.com`
   - email: `agent2@email.com`, password: `agent2@email.com`

2. Client Topics list will show -incase you're the agent that the system randomly 


3. Select a Topic and start to chat the client

#### Client UI  
1. sign up provided new email and password and name for your `Client` account
2. if you have an account, login
3. Topic list will show empty in case you are a new `Client`
4. add new `Topic` be entering a name a clicking `Save`
5. click to the added `Topic` and chat UI will show
6. Welcome `Message` from the selected agent will show, start to chat with this `Agent`

### Unit testing `not-ready`
Run `npm run test` 

## Code Structure

```
/client  /* normal angular app files */

/server/shared  /* shared files between Frontend & Backend codebase */
│   ├── configurations
│   │   └── socket-events.ts /* const string of socket events */
│   ├── models
│   │   ├── generics
│   │   │   ├── map.ts
│   │   │   └── id.ts  /* type of the id for all the models to unify it */
│   │   ├── account.ts
│   │   ├── conversation.ts
│   │   └── message.ts
│   ├── utils               /* utilities and functions used across the application */
│   │    ├── cors.util.ts
│   │    ├── date.util.ts
│   │    ├── error-catcher.util.ts
│   │    ├── filter-by.util.ts
│   │    ├── format-number.util.ts
│   │    ├── map.util.ts
│   │    ├── sort-by.util.ts
└── └──  └── uuid.util.ts


/server/src
│   ├── controllers
│   │   ├── account.controller.ts
│   │   ├── conversation.controller.ts
│   │   ├── message.controller.ts
│   │   └── socket.controller.ts  /* all messaging that uses the socket instance */
│   │ ├── db
│   │   ├── db.ts  /* initiate DB singleton instance */
│   │   └── seed.db.ts /* seed the DB by account and conversations */
│   ├── environments
│   │   ├── env.util.ts  /* functions to read the environment varibles for Node.js Backend */
│   │   ├── environment.prod.ts /* production environment variables */
│   │   └── environment.ts  /* development environment variables */
│   ├── middlewares
│   │	├── cors.middleware.ts 
│   │   └── request-responder.middleware.ts
│   ├── repositories
│   │   ├── generics
│   │   │   └── crud-base.repo.ts  /* abstraction of add, delete, find, and findOne methods */
│   │   ├── conversation.repo.ts
│   │   ├── message.repo.ts
│   │   └── account.repo.ts
│   ├── utils
│   │   ├── auth.util.ts
│   │   ├── bcrypt.util.ts
│   │   ├── jwt.util.ts
│   │   └── stream-file.util
└── └── index.ts  /* include all functionalities to setup and run the app */


```
## For help
Please contact [Sohaib Faroukh](https://github.com/sohaib-faroukh) 

