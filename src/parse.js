const Parse = require('parse');

Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
// Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
Parse.initialize(
  'iZKufKDf7k6cqYwbYNjUrtpIi9e2EIvEbov3Gzpr', // This is your Application ID
  'JyYsb3kBgEz8oo1ptmgJKxu7xrK4rGk3gLuLvNAS', // This is your Javascript key
  'uWhwQ1zVtSbcQ5ksSQfVrrZGPCKobiA7r4W70X73' // This is your Master key (never use it in the frontend)
);

export default Parse;
