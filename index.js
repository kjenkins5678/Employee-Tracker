/**
 * List prompt example
 */

var inquirer = require('inquirer');
var query = require('./queries')

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

function main() {
  console.log('In the Main Function');
  DoPrompt();
}

function DoPrompt() {
    inquirer.prompt(directionsPrompt).then(answers => {

      if (answers.direction === 'View All Employees') {

        console.log('Select All');
        query.viewAll()
        
      } else if (answers.direction === 'View All Employees By Department') {

        console.log('Select all based on department choices');

      } else if (answers.direction === 'View All Employees By Manager') {

        console.log('Select all based on manager choices');

      } else if (answers.direction === 'Add Employee') {

        console.log('Update or insert employee');

      } else if (answers.direction === 'Add Department') {

        console.log('Update or insert department');

      } else if (answers.direction === 'Add Role') {

        console.log('Update or insert role');

      } else if (answers.direction === 'Update Employee Role') {

        console.log('Update employees role');

      }
        
    });
  }

main();