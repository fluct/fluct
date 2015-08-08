# Fluct
Fluct is a web-application framework that includes everything needed to manage
Amazon API Gateway and Amazon Lambda backend web applications.
The goals of this project are:

- Server-less web application
- Easy and rapid development
- Multiple staging environments
- Endpoint-isolated deployments
- Infinite scalability
- Cost savings

## Install
```
npm install fluct
```

## Usage
### fluct new
Create a new application (where "myapp" is the application name):

```
$ fluct new myapp
  Created ./myapp
  Created ./myapp/actions
  Created ./myapp/package.json
```

### fluct generate
Generate a new action (where "list_users" is the action name):

```
$ fluct generate action list_users
  Created ./actions/list_users
  Created ./actions/list_users/index.js
  Created ./actions/list_users/package.json
```

### fluct server
Launches a local web server that behaves like Amazon API Gateway for development use.
You'll use this any time you want to access your web application in your local machine.

```
$ fluct server
Server starting on http://127.0.0.1:3000
```

### fluct deploy
Upload your functions to Amazon Lambda and update your endpoints on Amazon API Gateway.

```
$ fluct deploy
POST   https://apigateway.us-east-1.amazonaws.com/restapis
DELETE https://apigateway.us-east-1.amazonaws.com/restapis/nob3eusi70/models/Empty
DELETE https://apigateway.us-east-1.amazonaws.com/restapis/nob3eusi70/models/Error
GET    https://apigateway.us-east-1.amazonaws.com/restapis/nob3eusi70/resources
GET    https://apigateway.us-east-1.amazonaws.com/restapis/nob3eusi70/resources
POST   https://apigateway.us-east-1.amazonaws.com/restapis/nob3eusi70/resources/k1xqcw5cj8
GET    https://apigateway.us-east-1.amazonaws.com/restapis/nob3eusi70/resources
PUT    https://apigateway.us-east-1.amazonaws.com/restapis/nob3eusi70/resources/i7qrat/methods/GET
PUT    https://apigateway.us-east-1.amazonaws.com/restapis/nob3eusi70/resources/i7qrat/methods/GET/integration
PUT    https://apigateway.us-east-1.amazonaws.com/restapis/nob3eusi70/resources/i7qrat/methods/GET/responses/200
PUT    https://apigateway.us-east-1.amazonaws.com/restapis/nob3eusi70/resources/i7qrat/methods/GET/integration/responses/200
```

## Action
The behaviors of your application is defined as a collection of actions.
An action is defined in a set of index.js and package.json files,
located in a directory named with its action name (e.g. `list_users`).

### index.js
index.js defines a handler for your Amazon Lambda function.

```js
export.handler = function (event, context) {
  context.done('Hello, world!');
};
```

### package.json
package.json defines package dependencies and metadata for Lambda & API Gateway.

```json
{
  "name": "list_users",
  "version": "0.0.1",
  "fluct": {
    "httpMethod": "GET",
    "path": "/users"
  }
}
```
