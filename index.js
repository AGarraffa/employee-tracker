const inquirer = require('inquirer');
// const mysql = require('mysql2');
const { showTable, addData, updateEmpData } = require('./queries');


// connection to mysql and the company_db database
// const db = mysql.createConnection(
//     {
//         host: 'localhost',
//         user: 'root',
//         password: 'root',
//         database: 'company_db'
//     },
//     console.log('Connected to the company_db database.')
// );


const mainMenu = {
        type: 'list',
        name: 'menuChoice',
        message: 'Please select an option:',
        choices: [
            'View all departments', 
            'View all roles', 
            'View all employees', 
            'Add a department', 
            'Add a role', 
            'Add an employee', 
            'Update employee data',
            'Quit'
        ]
};

// const pause = {
//     type: 'input',
//     name: 'Press Enter to Continue',
//     message: ''
// };


async function init() {

    let answer = await inquirer.prompt(mainMenu);

    switch (answer.menuChoice) {

        case 'View all departments':
            await showTable('department');
   
            break;
        
        case 'View all roles':
            await showTable('role');
            break;
        
        case 'View all employees':
            await showTable('employee');
            break;

        case 'Add a department':
            await addData('department');
            break;
        
        case 'Add a role':
            await addData('role');
            break;
        
        case 'Add an employee':
            await addData('employee');
            break;

        case 'Update employee data':
            await updateEmpData();
            break;

        case 'Quit':
            console.log('Good Bye')
            process.exit();
    }

    await init();

};

init();