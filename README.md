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
  - [Role](#role)
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
Upload your actions to Amazon Lambda and update your endpoints on Amazon API Gateway.

```
$ fluct deploy
Running `npm install` in ./actions/list_users
Running `npm install` in ./actions/show_root
Created zip file: ./actions/list_users/lambda.zip
Created zip file: ./actions/show_root/lambda.zip
Uploaded function: list_users
Uploaded function: show_root
Updated endpoint: GET /
Updated endpoint: GET /users
Deployed: https://123ge4oabj.execute-api.us-east-1.amazonaws.com/production
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
metadata in `fluct` property, such as `restapiId` and `roleArn`.
The `restapiId` will be automatically set when you executed `fluct deploy` at the 1st time.
The `roleArn` is not automatically set, so you need to manually configure it (see the Role section).

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

### Role
Because fluct has no support to generate a new IAM role, you need to manually create an IAM role
that has `AWSLambdaBasicExecutionRole` and configure its ARN into `fluct.roleArn` property like above example.
If you have installed aws-cli and you are authorized to create a new IAM role,
you can create it by the following command (where `fluct-myapp` is the new role name):

```
$ aws iam create-role --role-name fluct-myapp --assume-role-policy-document arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
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
