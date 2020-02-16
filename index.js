/**
 * List prompt example
 */

'use strict';
var inquirer = require('inquirer');

var directionsPrompt = {
  type: 'list',
  name: 'direction',
  message: 'What would you like to do?',
  choices: [
    'View All Employees', 
    'View All Employees By Department', 
    'View All Employees By Manager', 
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

        DoPrompt();

      } else if (answers.direction === 'View All Employees By Department') {

        console.log('Select all based on department choices');

        DoPrompt();

      } else if (answers.direction === 'View All Employees By Manager') {
          
        console.log('Select all based on manager choices');

        DoPrompt();

      } else if (answers.direction === 'Add Employee') {

        console.log('Update or insert employee');

        DoPrompt();

      } else if (answers.direction === 'Add Department') {

        console.log('Update or insert department');

        DoPrompt();

      } else if (answers.direction === 'Add Role') {

        console.log('Update or insert role');

        DoPrompt();

      } else if (answers.direction === 'Update Employee Role') {

        console.log('Update employees role');

        DoPrompt();

      }
        
    });
  }

main();