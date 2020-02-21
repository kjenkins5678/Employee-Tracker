var inquirer = require('inquirer');
var mysql = require("mysql");
const cTable = require('console.table');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "testtest",
  database: "employees_db"
});

var sqlViewAll = `SELECT
  employees.id, 
  employees.first_name, 
  employees.last_name, 
  roles.title,
  departments.name as department,
  roles.salary
  FROM employees 
  INNER JOIN roles ON employees.role_id = roles.id
  INNER JOIN departments ON roles.department_id = departments.id`


var directionsPrompt = {
  type: 'list',
  name: 'direction',
  message: 'What would you like to do?',
  choices: [
    'View All Employees', 
    'View All Employees By Department', 
    'View All Employees By Role', 
    'Add Employee',
    'Add Department',
    'Add Role',
    'Update Employee Role'
]
};

function DoPrompt() {
  inquirer.prompt(directionsPrompt).then(answers => {
    console.log(answers.direction);

    switch(answers.direction){
      case "View All Employees":
        queryDB(sqlViewAll);
        break;
      case "Quit":
        break;
    }
  
  });
}

function queryDB(sql){
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(sql, function (err, rows) {
      connection.release();
      if (err) throw err;
      console.table(rows);
      DoPrompt();
    });
  });
}

DoPrompt();