const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//read all employees 


//add an employee 

//updating an employee role 

//read all employee roles

//adding a role 

//read all departments 
//adding a department 
