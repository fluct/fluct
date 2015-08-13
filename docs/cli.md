# Command Line Interface
- [fluct new](#fluct-new)
- [fluct generate](#fluct-generate)
- [fluct server](#fluct-server)
- [fluct deploy](#fluct-deploy)
- [fluct routes](#fluct-routes)
- [fluct deployments](#fluct-deployments)

## fluct new
Create a new application (where "myapp" is the application name):

```
$ fluct new myapp
Created ./myapp
Created ./myapp/.gitignore
Created ./myapp/actions
Created ./myapp/actions/.keep
Created ./myapp/package.json
```

## fluct generate
Generate a new action (where "list_users" is the action name):

```
$ fluct generate list_users
Created ./actions/list_users
Created ./actions/list_users/index.js
Created ./actions/list_users/package.json
```

## fluct server
Launches a local web server that behaves like Amazon API Gateway for development use.
You'll use this any time you want to access your web application in your local machine.

```
$ fluct server
Server starting on http://127.0.0.1:3000
```

## fluct deploy
Upload your actions to Amazon Lambda and update your endpoints on Amazon API Gateway.

```
$ fluct deploy
Created zip file: ./actions/list_users/lambda.zip
Created zip file: ./actions/show_root/lambda.zip
Uploaded function: list_users
Uploaded function: show_root
Updated endpoint: GET /
Updated endpoint: GET /users
Deployed: https://123ge4oabj.execute-api.us-east-1.amazonaws.com/production
```

## fluct routes
List all routes.

```
$ fluct routes
GET    /recipes #list_recipes
POST   /recipes #create_recipe
GET    /users   #list_users
```

## fluct deployments
List recent deployments.

```
$ fluct deployments
=== myapp deployments
8bacdi  2015-08-11 19:27 +09:00
lxr8fu  2015-08-11 19:26 +09:00
vukio1  2015-08-11 18:38 +09:00
```
