# Fluct
Fluct is a web-application framework that includes everything needed to manage
Amazon API Gateway and Amazon Lambda backend web applications.
The goals of this project are:

- Server-less web application
- Isolated components
- Infinite scalability
- Cost-effectiveness

## Install
```
npm install fluct -g
```

## Usage
### fluct new
Create a new application (where "myapp" is the application name):

```
$ fluct new myapp
  Created ./myapp
  Created ./myapp/functions
  Created ./myapp/package.json
```

### fluct generate action
Generate a new action (where "list_users" is the action name):

```
$ fluct generate action list_users
  Created ./actions/list_users
  Created ./actions/list_users/index.js
  Created ./actions/list_users/package.json
```

### fluct server
Launches a web server on http://127.0.0.1:3000
that behaves like Amazon API Gateway and Amazon Lambda for development use.
You'll use this any time you want to access your web application in local machine.

```
fluct server
```

### fluct deploy
Upload your functions to Amazon Lambda and update your endpoints on Amazon API Gateway.

```
fluct deploy
```
