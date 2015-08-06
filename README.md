# Fluct
Fluct is a web-application framework that includes everything needed to manage
Amazon API Gateway and Amazon Lambda backend web applications.
The goals of this project are:

- Server-less web application
- Isolated components
- Infinite scalability
- Cost-effective

## Install
```
npm install fluct -g
```

## Usage
Fluct provides `fluct` executable.

### fluct new
Create a new application (where "myapp" is the application name):

```
fluct new myapp
```

### fluct generate
Generate a new action to list users (where "list_users" is the action name):

```
$ fluct generate list_users
  Created ./functions/list_users
  Created ./functions/list_users/index.js
  Created ./functions/list_users/package.json
```

### fluct server
The `fluct server` command launches a web server on http://localhost:3000
that behaves like Amazon API Gateway and Amazon Lambda for development use.
You'll use this any time you want to access your web application in local machine.

```
fluct server
```
