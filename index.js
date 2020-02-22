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

function doPrompt() {
  inquirer.prompt({
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
  ]}).then(answers => {
    console.log(answers.direction);

    switch(answers.direction){
      case "View All Employees":
        viewAll();
        break;
      case "View All Employees By Department":
        queryDBbyDept();
        break;
      case "View All Employees By Role":
        queryDBbyRole();
        break;
      case "Add Employee":
        addEmployee();
        break
      case "Add Department":
        addDepartment()
        break
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

function queryDBbyRole(){
  var sqlSelectRole = `SELECT
  title
  FROM roles`
  let titles = [];
  pool.getConnection(function (err, connection) {
    if (err) throw err;

    connection.query(sqlSelectRole, function (err, rows) {
      if (err) throw err;
      for (i = 0; i<=rows.length-1; i++){
        titles.push(rows[i].title);
      }
      connection.release();
      
      inquirer
        .prompt([{
          /* Pass your questions in here */
          type: 'list',
          name: 'title',
          message: 'Choose a Title',
          choices: titles
        }])
        .then(answers => {
          // Use user feedback for... whatever!!
          console.log(answers.title)
          var sqlByRole = `SELECT
          employees.id, 
          employees.first_name, 
          employees.last_name, 
          roles.title,
          departments.name as department,
          roles.salary
          FROM employees 
          INNER JOIN roles ON employees.role_id = roles.id
          INNER JOIN departments ON roles.department_id = departments.id
          WHERE roles.title = "${answers.title}"`
          pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(sqlByRole, function (err, rows) {
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

function addEmployee(){
  //---Query Role Options in DB---

  // SQL Query
  var sqlSelectRole = `SELECT
  title, id
  FROM roles`

  //Create Empty List
  let justTitles = [];
  let justTitleId = [];

  //Connection to DB
  pool.getConnection(function (err, connection) {
    if (err) throw err;

    //Query DB after connection
    connection.query(sqlSelectRole, function (err, rows) {
      if (err) throw err;
      for (i = 0; i<=rows.length-1; i++){
        justTitles.push(rows[i].title);
        justTitleId.push(rows[i].id);
      }

      //Release Connection
      connection.release();
    });

    //---Prompt User---
    inquirer.prompt([
      {
        name: 'firstName',
        message: 'Enter First Name'
      },
      {
        name: 'lastName',
        message: 'Enter Last Name'
      },
      {
        type: 'list',
        name: 'role',
        message: 'Select Role',
        choices: justTitles
      }
    ]).then(answers => {
      //Find the role id so we can update the employee table with the role id
      var index = justTitles.indexOf(answers.role);
      var roleID = justTitleId[index];

      //Do the SQL to update the table
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answers.firstName,
          last_name: answers.lastName,
          role_id: roleID,
        },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " sql inserted!\n");
          connection.release();
        }
      );
    });
  })
}

function addDepartment(){
  inquirer.prompt([
    {
      name: 'newDepartment',
      message: 'Enter the Name of the New Department'
    }]).then(answers =>{
      console.log(answers);

      pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(
          "INSERT INTO departments SET ?",
          {
            name: answers.newDepartment,
          },
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " sql inserted!\n");
            connection.release();
          }
        )
      })
    })
}

doPrompt();