# Fluct
Fluct is a web-application framework that includes everything needed to manage
Amazon API Gateway and Amazon Lambda backend web applications.

- [Goals](#goals)
- [Usage](#usage)
  - [Install](#install)
  - [fluct new](#fluct-new)
  - [fluct generate](#fluct-generate)
  - [fluct server](#fluct-server)
  - [fluct deploy](#fluct-deploy)
  - [fluct routes](#fluct-routes)
- [Application](#application)
  - [package.json](#packagejson)
- [Action](#action)
  - [index.js](#indexjs)
  - [package.json](#packagejson-1)
- [Credentials](#credentials)

## Goals
The goals of this project are:

- Server-less web application
- Easy and rapid development
- Multiple staging environments
- Endpoint-isolated deployments
- Infinite scalability
- Cost savings

## Usage
Install fluct globally to use `fluct` executable.

```
$ npm install fluct -g
```

```
$ fluct --help

  Usage: fluct [options] [command]


  Commands:

    d|deploy                       Deploy actions to AWS
    g|generate <generator> <name>  Generate a new resource from <generator> (e.g. "action")
    n|new <name>                   Generate a new application
    r|routes                       List all routes
    s|server [options]             Launch a web server

  Options:

    -h, --help  output usage information
```

### fluct new
Create a new application (where "myapp" is the application name):

```
$ fluct new myapp
Created ./myapp
Created ./myapp/.gitignore
Created ./myapp/actions
Created ./myapp/actions/.keep
Created ./myapp/package.json
```

### fluct generate
Generate a new action (where "list_users" is the action name):

```
$ fluct generate action list_users
Created ./actions/list_users
Created ./actions/list_users/dist
Created ./actions/list_users/dist/index.js
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
Created ./actions/list_users/dist.zip
Uploaded list_users function
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

### fluct routes
List all routes.

```
$ fluct routes
GET    /recipes (list_recipes)
POST   /recipes (create_recipe)
GET    /users (list_users)
```

## Application
A typical fluct application's file structure will be like this:

```
.
|-- actions
|   |-- create_recipe
|   |-- list_users
|   `-- list_recipes
`-- package.json
```

### package.json
In addition to information about npm, a fluct application's package.json has some fluct-specific
metadata, such as `fluct.restapiId` and `fluct.roleArn`.
Because fluct has no support to generate IAM roles yet, you need to manually create an IAM role
that has `AWSLambdaBasicExecutionRole` and configure its ARN into `fluct.roleArn` property.

```json
{
  "name": "myapp",
  "version": "0.0.1",
  "fluct": {
    "restapiId": "b15rph8lh3",
    "roleArn": "arn:aws:iam::012345678912:role/myExampleRole"
  }
}
```

## Action
The behaviors of your application is defined as a collection of actions.
An action is defined in a set of index.js and package.json files,
located in a directory named with its action name (e.g. `list_users`).

### index.js
index.js defines a handler for your Amazon Lambda function.

```js
export.handler = function (event, context) {
  context.succeed('Hello, world!');
};
```

### package.json
package.json defines package dependencies and metadata for Lambda & API Gateway.

```json
{
  "name": "list_users",
  "version": "0.0.1",
  "fluct": {
    "contentType": "text/html",
    "httpMethod": "GET",
    "path": "/users"
  }
}
```

## Credentials
fluct will automatically detect your AWS credentials from the shared credentials file in
`~/.aws/credentials` or environment variables such as `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
and `AWS_PROFILE`. fluct internally uses AWS SDK for JavaScript, so please see
[Configuring the SDK in Node.js — AWS SDK for JavaScript](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
for more details about AWS credentials settings.
