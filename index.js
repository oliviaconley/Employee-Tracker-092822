const inquirer = require("inquirer");
const db = require("./connection");
require("console.table");


const init = () => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "questions",
          message: "What would you like to do?",
          choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
        },
    ])
    .then(function (choices) {
        if (choices.questions == "Add Employee") { 
            addEmployee(); 
        } else if (choices.questions == "View All Employees") { 
            viewAllEmployees()
        } else if (choices.questions == "Update Employee Role") { 
            updateEmployee(); 
        } else if (choices.questions == "View All Roles") {
            viewAllRoles(); 
        } else if (choices.questions == "Add Role") {
            addRole(); 
        } else if (choices.questions == "View All Departments") {
            viewAllDepts();
        } else if (choices.questions == "Add Department") {
            addDepartment(); 
          } else {
              if (choices.team == "Quit") {
                console.log("\nGoodbye!");
                process.exit(0);
              }
            }
        });
};

//view all employees
const viewAllEmployees = () => {
    db.promise().query(
        `SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id`
    ).then(([data]) => {
        console.table(data)
        init();
    })
}; 

//view all roles
const viewAllRoles = () => {
    db.promise().query(
        `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id`
    ).then(([data]) => {
        console.table(data)
        init();
    })
}; 

//view all departments
const viewAllDepts = () => {
    db.promise().query(
        `SELECT department.id, department.name AS department FROM department LEFT JOIN role on role.department_id = department.id`
    ).then(([data]) => {
        console.table(data)
        init();
    })
}; //only issue is that its printing the dept ids as they correlate to employees in that department....

//add employee
const addEmployee = () => {
    db.promise().query(
        `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id` //the query to get all roles
    ) .then(([data]) => { //restructured into an array, []
        const roleChoices = data.map(({ id, title }) => ({ //.map loops through grabbing specific info
            name: title, //defining values
            value: id
        })) //so to get all of the role choices we need to grab these the role column values
        inquirer
        .prompt([
            {
                type: "input",
                name: "first",
                message: "What's the employee's first name?",
            },
            {
                type: "input",
                name: "last",
                message: "What's the employee's last name?",
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roleChoices 
            }, 
        ]) .then((data) => { 
            let first_name = data.first; //setting the columns equal to the new input values
            let last_name = data.last; 
            let role = data.role; 
            db.promise().query(
                `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id` 
                //view all employees
            ).then(([data]) => {
                const managerChoices = data.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                }))
                inquirer.prompt([
                    {
                        type: "list",
                        name: "manager",
                        message: "Who is the employee's manager",
                        choices: managerChoices 
                    },
                ]).then((data) => {
                    let manager = data.manager; 
                    db.promise().query(
                        `INSERT INTO employee (first_name, last_name,role_id, manager_id) VALUES ("${first_name}", "${last_name}", ${role}, ${manager})`
                    ).then(() => {
                        console.log(`added "${first_name}" "${last_name}" to the database`)
                        init();
                    })
                })
            })
        })
    })
};

//adding a role
const addRole = () => {
    db.promise().query(
        `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id`
    ).then (([data])=> {
        const deptChoices = data.map(({ id, name }) => ({
            name: name,
            value: id
        }))
    inquirer
    .prompt([
        {
            type: "input",
            name: "newRole",
            message: "What is the name of the role?",
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?",
        },
        {
            type: "list",
            name: "department",
            message: "Which department does the role belong to?",
            choices: deptChoices
        }, 
    ]). then((data) => {
        let new_role = data.newRole;
        let salary = data.salary;
        let department = data.department;
        db.promise().query(
            `INSERT INTO role (title, salary, department_id) VALUES ("${new_role}", "${salary}", "${department}")`
        )
    })
    .then (() => {
        console.log(`added to the database`)
        init();
    })
})
};

//update employee 
const updateEmployee = () => {
    db.promise().query(
        `SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id` //get all employees
    ).then(([data]) => {
        const employeeChoices = data.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }))
        
    inquirer
    .prompt([
        {
            type: "list",
            name: "update",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices 
        },
    ])
    .then ((data) => {
        let employeeId = data.update
    db.promise().query(
        `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id`
    ).then(([data]) => {
        const roleChoices = data.map(({ id, title }) => ({
            name: title, 
            value: id
        }))
    inquirer
    .prompt([
        {
            type: "list",
            name: "role",
            message: "Which role do you want to assign to the selected employee?",
            choices: roleChoices 
        }, 
    ])
    .then((data) => {
        let roleId = data.role
        db.promise().query(
        `UPDATE employee SET role_id = ("${roleId}") WHERE role_id = ("${roleId}")`
    )
    })
    .then(() => {
        console.log(`added to the database`)
        init();
    })
    })
    })
})
};

//adding a department 
const addDepartment = () => {
     db.promise().query(
        `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id`
    ).then 
    inquirer
    .prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the name of the department?",
        },
    ]). then((data) => {
        let departmentName = data.departmentName;
        db.promise().query(
            `INSERT INTO department (name) VALUES ("${departmentName}")`
        )
    })
    .then (() => {
        console.log(`added to the database`)
        init();
    })
};

init(); 
