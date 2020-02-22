var inquirer = require('inquirer');
var mysql = require("mysql");
const cTable = require('console.table');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  port: 3306,
  user: "root",
  password: "testtest",
  database: "employees_db"
});

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

function doPrompt() {
  inquirer.prompt(directionsPrompt).then(answers => {
    console.log(answers.direction);

    switch(answers.direction){
      case "View All Employees":
        viewAll();
        break;
      case "View All Employees By Department":
        queryDBbyDept();
        break;
    }
  });
}

function viewAll(){
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
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(sqlViewAll, function (err, rows) {
      connection.release();
      if (err) throw err;
      console.table(rows)
      doPrompt();
    });
  });
}

function queryDBbyDept(){
  var sqlSelectDept = `SELECT
  name
  FROM departments`
  let depts = [];
  pool.getConnection(function (err, connection) {
    if (err) throw err;

    connection.query(sqlSelectDept, function (err, rows) {
      if (err) throw err;
      for (i = 0; i<=rows.length-1; i++){
        depts.push(rows[i]);
      }
      connection.release();
      
      inquirer
        .prompt([{
          /* Pass your questions in here */
          type: 'list',
          name: 'department',
          message: 'Choose a Department',
          choices: depts
        }])
        .then(answers => {
          // Use user feedback for... whatever!!
          console.log(answers.department)
          var sqlByDept = `SELECT
          employees.id, 
          employees.first_name, 
          employees.last_name, 
          roles.title,
          departments.name as department,
          roles.salary
          FROM employees 
          INNER JOIN roles ON employees.role_id = roles.id
          INNER JOIN departments ON roles.department_id = departments.id
          WHERE departments.name = "${answers.department}"`
          pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sqlByDept, function (err, rows) {
              connection.release();
              if (err) throw err;
              console.table(rows)
              doPrompt();
            });
          });



        });
    });
  });
}



doPrompt();