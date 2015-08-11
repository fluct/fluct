## Customize
- [Application](#application)
  - [package.json](#packagejson)
  - [Role](#role)
  - [Credentials](#credentials)
- [Action](#action)
  - [index.js](#indexjs)
  - [package.json](#packagejson-1)

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
  "private": true,
  "fluct": {
    "restapiId": "b15rph8lh3",
    "roleArn": "arn:aws:iam::012345678912:role/myExampleRole"
  }
}
```

### Role
Because fluct has no support to generate a new IAM role, you need to manually create an IAM role
that has `AWSLambdaBasicExecutionRole` and configure its ARN into `roleArn` property like above example.
If you have installed aws-cli and you are authorized to create a new IAM role,
you can create it by the following command (where `fluct-myapp` is the new role name):

```
$ aws iam create-role --role-name fluct-myapp --assume-role-policy-document arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

### Credentials
fluct will automatically detect your AWS credentials from the shared credentials file in
`~/.aws/credentials` or environment variables such as `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`,
and `AWS_PROFILE`. fluct internally uses AWS SDK for JavaScript, so please see
[Configuring the SDK in Node.js — AWS SDK for JavaScript](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
for more details about AWS credentials settings.

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
An action's package.json has special metadata in its `fluct` property for Lambda & API Gateway.
For example, when you want to provide an endpoint for list_users fuction via `GET /users`,
update httpMethod and path properties with `"GET"` and `"/users"`.

```json
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
