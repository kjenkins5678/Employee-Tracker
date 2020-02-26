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
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add Role":
        addRole();
        break;
      case "Update Employee Role":
        updateEmplRole();
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
      return;
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
              return;
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
              return;
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
          doPrompt();
          return;
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
            doPrompt();
            return;
          }
        )
      })
    })
}

function addRole(){
  var sqlSelectDepartment = `SELECT
  name, id
  FROM departments`

  //Create Empty List
  let justNames = [];
  let justNamesId = [];

  //Connection to DB
  pool.getConnection(function (err, connection) {
    if (err) throw err;

    //Query DB after connection
    connection.query(sqlSelectDepartment, function (err, rows) {
      if (err) throw err;
      for (i = 0; i<=rows.length-1; i++){
        justNames.push(rows[i].name);
        justNamesId.push(rows[i].id);
      }

      //Release Connection
      connection.release();
    });


    inquirer.prompt([
      {
        name: 'newRole',
        message: 'Enter the Name of the New Role'
      },
      {
        name: 'salary',
        message: 'Enter the Salary of the New Role'
      },
      {
        type: 'list',
        name: 'department',
        message: 'Select the Department',
        choices: justNames
      }]
      ).then(answers =>{
        console.log(answers);
        var index = justNames.indexOf(answers.department);
        var departmentID = justNamesId[index];

        pool.getConnection(function (err, connection) {
          if (err) throw err;

          connection.query(
            "INSERT INTO roles SET ?",
            {
              title: answers.newRole,
              salary: answers.salary,
              department_id: departmentID
            },
            function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " sql inserted!\n");
              connection.release();
              doPrompt();
              return;
            }
          )
        })
    })
  })
}

function updateEmplRole(){
  //Choose Employee to Update

  var sqlSelectEmployee = `SELECT
  first_name, last_name, id
  FROM employees`

  //Create Empty List
  let emplNames = [];
  let emplIds = [];

  //Connection to DB
  pool.getConnection(function (err, connection) {
    if (err) throw err;

    //Query DB after connection
    connection.query(sqlSelectEmployee, function (err, rows) {
      if (err) throw err;
      for (i = 0; i<=rows.length-1; i++){
        let name = rows[i].first_name + " " + rows[i].last_name;
        emplNames.push(name);
        emplIds.push(rows[i].id);
      }

      //Release Connection
      connection.release();

      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Select Employee',
          choices: emplNames
        }]
        ).then(answers =>{
          // console.log(answers);
          var index = emplNames.indexOf(answers.employee);
          var emplID = emplIds[index];
          // console.log("Employee Id: ", emplID)
    
          pool.getConnection(function (err, connection) {
            if (err) throw err;
    
            connection.query(
              "SELECT role_id FROM employees WHERE id = ?",
              [
                emplID
              ],
              function(err, res) {
                if (err) throw err;
                // console.log(res[0].role_id);
                connection.release();

                let roleTitles = [];
                let roleIds = [];

                pool.getConnection(function (err, connection) {
                  if (err) throw err;
          
                  connection.query(
                    "SELECT title, id FROM roles WHERE id !=?",
                    [
                      res[0].role_id
                    ],
                    function(err, res) {
                      if (err) throw err;
                      connection.release();

                      for (i = 0; i <= res.length-1; i++){
                        roleTitles.push(res[i].title);
                        roleIds.push(res[i].id);
                      }

                      inquirer.prompt([
                        {
                          type: 'list',
                          name: 'newRole',
                          message: 'Select New Role',
                          choices: roleTitles
                        }]
                        ).then(answers =>{
                          // console.log(answers);
                          var index = roleTitles.indexOf(answers.newRole);
                          var newRoleID = roleIds[index];
                          console.log("New Role Id: ", newRoleID);

                          pool.getConnection(function (err, connection) {
                            if (err) throw err;
                    
                            connection.query(
                              "UPDATE employees SET ? WHERE ?",
                              [
                                {
                                  role_id: newRoleID
                                },
                                {
                                  id: emplID
                                }  
                              ],
                              function(err, res) {
                                if (err) throw err;
                                connection.release();

                                console.log("Role Updated");
                                doPrompt();
                                return;
                              }
                              )
                            })
                        })
                    }
                  )
                })
              }
            )
          })
        })
      });
    });

  //List Role Options

  //Update the RoleID in the Employee Table
}

doPrompt();