# Fluct
Fluct is a framework to build server-less web applications using
[Lambda](https://aws.amazon.com/lambda/) and [API Gateway](https://aws.amazon.com/api-gateway/).
This stack brings about great advantages in the web development,
such as fully isolated components, infinitely scalability, easy and rapid development,
cheap server cost, and more and more.

- [Getting Started](#getting-started)
- [Command Line Interface](/docs/command-line-interface)
- [Customize](/customize)

## Getting Started
### Install
Install `fluct` executable via npm.

```
$ npm install fluct -g
```

### Create an application
Create a new application with an application name:

```
$ fluct new myapp
Created ./myapp
Created ./myapp/.gitignore
Created ./myapp/actions
Created ./myapp/actions/.keep
Created ./myapp/package.json
```

### Create an action
Enter the application folder and generate a new action:

```
$ cd myapp
$ fluct generate list_users
Created ./actions/list_users
Created ./actions/list_users/index.js
Created ./actions/list_users/package.json
```

### Set up the action
Update the action's package.json with proper httpMethod and path:

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

### Set your IAM role
Head over to [AWS Console](https://console.aws.amazon.com) and create a new IAM role
that has `AWSLambdaBasicExecutionRole` role, then set it to application's package.json.
This ARN is used to allow API Gateway to invoke Lambda functions.

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

### Deploy it
Deploy your application to Lambda and API Gateway:

```
$ fluct deploy
Created zip file: ./actions/list_users/lambda.zip
Uploaded function: list_users
Updated endpoint: GET /users
Deployed: https://123ge4oabj.execute-api.us-east-1.amazonaws.com/production
```

### Done!
Fire up the browser and go to https://123ge4oabj.execute-api.us-east-1.amazonaws.com/production/users.

### Next steps
Now that you’re up and running, here are a few things you should know.
See [Customize](/customize) to know how to change action behavior and implement logics,
and see [Command Line Interface](/command-line-interface) to use useful commands to develop and debug your application.
