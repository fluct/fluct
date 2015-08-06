# fluct
Fluct is a web-application framework that includes everything needed to manage
Amazon API Gateway and Amazon Lambda backend web applications.

## Install
```
npm install fluct
```

## Usage
The `fluct` executable provides some sub-commands.

### fluct new
Create a new application (where "myapp" is the application name):

```
fluct new myapp
```

### fluct generate
Generate a new action to list users (where "list_users" is the action name):

```
fluct generate action list_users
```

### fluct server
Start the web server on http://localhost:3000 for development:

```
fluct server
```
