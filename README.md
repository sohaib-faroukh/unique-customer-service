# chat-app




## Documentation
### functional requirements: 
1. client can open new topic (aka. conversation) with support agent by providing a topic name
2. client can remove a topic
3. client/agent can send and receive messages from agent
4. topics shows in realtime when created on the related client/agent on the chats list screen

## Run the app options:

### Run app locally on production 
### Run Docker image locally 
1. make sure Docker desktop is install 
2. build image `docker build --tag chat-app-img:latest . `
3. run container for port 80 `docker run -p 80:8080 --name chat-app-container  chat-app-img:latest`
4. open you browser on `localhost`
## Development environment  

### install the dependencies
Run `npm install` and please use a reliable VPN if you are in Syria

### run the app locally 

#### run Backend
Run `npm run start:dev` 

#### run Frontend 
Run `ng serve` 


### run tests
Run `npm run test:client` 

## build & run in one short command
Run `npm run build-run`

## For help

Please contact [Sohaib Faroukh](https://github.com/sohaib-faroukh) 

