Create a new project with command
`npm init`

Dependencies
npm install --save express

Auto reload
npm install --save-dev nodemon

Logging
npm install --save morgan

Body parser
npm install body-parser

Mongo
npm install mongoose

Multer: handle multipart/form-data for uploading file e.g. images
npm install multer

Encrypt password for the signup process
npm install bcryptjs

Generate JWT
npm install jsonwebtoken

Setup server.js
Add app.js

To run
node server.js

MongoDB
https://cloud.mongodb.com/v2/5e61a478f4eca649662a65f6#security/database/users
Atlas cloud mongo db

username/password: node-rest-shop
database-name: node-reest-shop
mongodb+srv://<username>:<password>@node-rest-shop-wmqrd.mongodb.net/<database-name>?retryWrites=true&w=majority

mongoose validation doc
https://mongoosejs.com/docs/validation.html#validation

Setup debug mode on VS code
1. Add script
  "debug": "nodemon --inspect server.js"
2. create .vscode/launch.json
  {
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
      {
        "type": "node",
        "request": "attach",
        "name": "Node: Nodemon",
        "processId": "${command:PickProcess}",
        "restart": true,
        "protocol": "inspector",
      },
    ]
  }

To run the app in debuging mode
1. start the server with "npm run debug"
2. In VS code, go to debug tab and run the Debug Profile (Node: Nodemon)
3. Select the node process that's started with the --inspect flag