# Fluct
Fluct is a framework to build server-less web applications using
[Lambda](https://aws.amazon.com/lambda/) and [API Gateway](https://aws.amazon.com/api-gateway/).
This stack brings about great advantages in the web development,
such as fully isolated components, infinitely scalability, easy and rapid development,
cheap server cost, and more and more.

- [Getting Started](#getting-started)
  - [1. Install](#install)
  - [2. Create an application](#create-an-application)
  - [3. Create an action](#create-an-action)
  - [4. Set up the action](#set-up-the-action)
  - [5. Set your IAM role](#set-your-iam-role)
  - [6. Deploy it](#deploy-it)
  - [7. Done!](#done)
- [Command Line Interface](/docs/command-line-interface.md)
  - [fluct new](/docs/command-line-interface.md#fluct-new)
  - [fluct generate](/docs/command-line-interface.md#fluct-generate)
  - [fluct server](/docs/command-line-interface.md#fluct-server)
  - [fluct deploy](/docs/command-line-interface.md#fluct-deploy)
  - [fluct routes](/docs/command-line-interface.md#fluct-routes)
  - [fluct deployments](/docs/command-line-interface.md#fluct-deployments)
- [Customize](/docs/customize.md)
  - [Application](/docs/customize.md#application)
  - [Role](/docs/customize.md#role)
  - [Credentials](/docs/customize.md#credentials)
  - [Action](/docs/customize.md#action)
  - [Handler](/docs/customize.md#handler)

## Getting Started
### 1. Install
Install `fluct` executable via npm.

```
$ npm install fluct -g
```

### 2. Create an application
Create a new application with an application name.

```
$ fluct new myapp
Created ./myapp
Created ./myapp/.gitignore
Created ./myapp/actions
Created ./myapp/actions/.keep
Created ./myapp/package.json
```

### 3. Create an action
Enter the application folder and generate a new action.

```
$ cd myapp
$ fluct generate list_users
Created ./actions/list_users
Created ./actions/list_users/index.js
Created ./actions/list_users/package.json
```

### 4. Set up the action
Update the action's package.json with proper httpMethod and path.

```
$ vi actions/list_users/package.json
$ cat actions/list_users/package.json
{
  "name": "list_users",
  "private": true,
  "fluct": {
    "arn": null,
    "contentType": "text/html",
    "httpMethod": "GET",
    "path": "/users"
  }
}
```

### 5. Set your IAM role
Head over to [AWS Console](https://console.aws.amazon.com) and create a new IAM role
that has `AWSLambdaBasicExecutionRole`, then set it to application's package.json.
This role is used to allow API Gateway to invoke Lambda functions.

```
$ vi package.json
$ cat package.json
{
  "name": "myapp",
  "private": true,
  "fluct": {
    "restapiId": null,
    "roleArn": "arn:aws:iam::012345678912:role/myExampleRole"
  }
}
```

### 6. Deploy it
Deploy your application to Lambda and API Gateway.

```
$ fluct deploy
Created zip file: ./actions/list_users/lambda.zip
Uploaded function: list_users
Updated endpoint: GET /users
Deployed: https://123ge4oabj.execute-api.us-east-1.amazonaws.com/production
```

### 7. Done!
Fire up the browser and try to send HTTP requests to your endpoints.
Now that you’re up and running, here are a few things you should know.
See [Customize](/customize) to know how to change action behavior and implement logics,
and see [Command Line Interface](/command-line-interface) to use useful commands to develop and debug your application.
