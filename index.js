const inquirer = require('inquirer');
// const mysql = require('mysql2');
const { showTable, addData, updateRole } = require('./queries');


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
            'Update employee role',
            'Quit'
        ]
};

// const pause = {
//     type: 'input',
//     name: 'Press Enter to Continue',
//     message: ''
// };


async function init() {
    
    console.log('running init')


    let answer = await inquirer.prompt(mainMenu);

    switch (answer.menuChoice) {

        case 'View all departments':
            await showTable('department');
            // await inquirer.prompt(pause)
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

        case 'Update employee role':
            await updateRole();
            break;

        case 'Quit':
            console.log('Good Bye')
            process.exit();
    }

    // await inquirer.prompt(pause);
    await init();

};

// async function addData(input) {};
// async function updateEntry() {};
// possibly combine show and add and update;

init();



// sets the join so that onlay certain fields are displayed from each table
// db.query('SELECT employee.first_name AS First, employee.last_name AS Last, role.title, role.salary, department.name AS department FROM employee INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON role.dept_id=department.id', function (err, results){
//     console.table(results);
// })





// find a solution to press-any-key (it's currently removed )