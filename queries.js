// write db.query here
const inquirer = require('inquirer');
const mysql = require('mysql2');

// connection to mysql and the company_db database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'company_db'
    },
    console.log('Connected to the company_db database.')
);

// just using this to pause after the prints
const pause = {
    type: 'input',
    name: 'pause',
    message: 'Press enter to continue.'
};


// displays all entries in the selected table (formatted so the role_id, and department_id are printed out rather than numbers)
async function showTable(entry) {

    let queryRes; 
    
    console.log('running showTable')

    switch (entry) {
        case 'department':
            queryRes = await db.promise().query('SELECT id AS ID, name AS Department FROM department')

            break;

        case 'role':
            queryRes = await db.promise().query('SELECT role.id AS ID, role.title AS Title, department.name AS Department, role.salary AS Salary FROM role INNER JOIN department ON role.dept_id=department.id')

            break;
        
        case 'employee':

            queryRes = await db.promise().query('SELECT CONCAT(e.first_name, " ", e.last_name) AS Name, role.title AS Title, role.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager, department.name AS Department FROM employee e INNER JOIN role ON role_id=role.id INNER JOIN employee m ON e.manager_id=m.id INNER JOIN department ON role.dept_id=department.id')
    
    
            break;
    }
    
    console.table(queryRes[0])
    await inquirer.prompt(pause);

    return;
};

// adds a new entry in the selected table (department, role, employee)
async function addData(entry) {

    console.log(`running addEntry ${entry}`)
    
    let depts = await getChoices('department');
    let roles = await getChoices('role');
    let employees = await getChoices('employee');
    let managers = await getChoices('manager');
    
const deptAdd ={
    type: 'input',
    name: 'newDept',
    message: 'Please enter the new department.'
}


const roleAdd = [
    {
        type: 'input',
        name: 'title',
        message: 'Please enter the new role you would like to add.'
    },
    {
        type: 'number',
        name: 'salary',
        message: 'What is the salary for this position?'
    },
    {
        type: 'list',
        name: 'dept',
        message: 'What department is this role in?',
        choices: depts
    }
]

const employeeAdd = [
    {
        type: 'input',
        name: 'name',
        messsage: 'Please enter the first and last name of the new employee.'
    },
    {
        type: 'list',
        name: 'role',
        message: 'What is their job title?',
        choices: roles
    },
    {
        type: 'list',
        name: 'mgr',
        message: 'Who is their manager?',
        choices: ['No one', ...managers]
    },
    {
        type: 'confirm',
        name: 'isMgr',
        message: 'Is this person a manager?'
    }
]


    let answers;

    // runs a tailored inquiry and db.query based on the option selected
    switch (entry) {

        case 'department':
            answers = await inquirer.prompt(deptAdd);
            console.log(`Attempting to add ${answers.newDept}`)
            await db.promise().query(`INSERT INTO department (name) VALUES ('${answers.newDept}')`)

                console.log(`${answers.newDept} was successfully added to the departments.`)

            break;
        
        case 'role':

            answers = await inquirer.prompt(roleAdd);
            console.log(depts)
            let dept_id = await getID('department', answers.dept);

            await db.promise().query(`INSERT INTO role (title, salary, dept_id) VALUES ('${answers.title}', '${answers.salary}', '${dept_id}')`)

            console.log(`${answers.title} was successfully added to the roles.`)
    

            break;

        case 'employee':

            answers = await inquirer.prompt(employeeAdd);

            let role_id = await getID('role', answers.role);

            let mgr_id;

            let fullName = answers.name;
            let nameArr = fullName.split(' ');
            let firstName = nameArr[0];
            let lastName = nameArr[1];

            let isMgr;
            if (answers.isMgr) {
                isMgr = 1;
            }
            else {
                isMgr = 0;
            }

            // I had to break these two things out due to the formatting of inserting a null value in to sql
            if (answers.mgr == 'No one'){
                mgr_id = null;

                await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager) VALUES ('${firstName}', '${lastName}', '${role_id}', ${mgr_id}, '${isMgr}')`)
            }

            else {
                mgr_id = await getID('employee', answers.mgr);

                await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager) VALUES ('${firstName}', '${lastName}', '${role_id}', '${mgr_id}', '${isMgr}')`)
            }

                console.log(`${firstName} ${lastName} was successfully added to the employees.`)

            break;
        
    }
    
    return;

};




// returns the id of a specific entry
async function getID(table, search) {


    let column;
    let query;
    let id;

    switch (table) {
        case 'department':
            column = 'name';
            query = search;
            break;
        
        case 'role':
            column = 'title';
            query = search;
            break;

        case 'employee':
            let mgrName = search.split(' ')
            query = mgrName[1];
            column = 'last_name';
            break;
    }

    id = await db.promise().query(`SELECT id FROM ${table} WHERE ${column}='${query}'`)

    return id[0][0].id;

}


// returns an array to be used for the inquierer prompts.
async function getChoices(table) {


    let queryRes;
    let choiceArr=[]

    switch (table) {
        

        // runs a query based on the option selected
        case 'department':

            queryRes = await db.promise().query(`SELECT name FROM department`) 
    
                for (let i = 0; i < queryRes[0].length; i++) {
                   choiceArr.push(queryRes[0][i].name) 
                }
            break;


        case 'role': 

            queryRes = await db.promise().query(`SELECT title FROM role`)

                for (let i = 0; i < queryRes[0].length; i++) {

                    choiceArr.push(queryRes[0][i].title) 

                }

            break;


        case 'employee': 
            queryRes = await db.promise().query(`SELECT first_name AS First_Name, last_name AS Last_Name FROM employee`)
    
                for (let i = 0; i < queryRes[0].length; i++) {
                    let fullName = `${queryRes[0][i].First_Name} ${queryRes[0][i].Last_Name}`
                    choiceArr.push(fullName);
                    }

            break;


        case 'manager': 
            queryRes = await db.promise().query(`SELECT first_name, last_name FROM employee WHERE is_manager=1`)

                for (let i = 0; i < queryRes[0].length; i++) {
                    let fullName = `${queryRes[0][i].first_name} ${queryRes[0][i].last_name}`
                    choiceArr.push(fullName);
                    }

            break;
    }

    return choiceArr;
}


// used to update the role of a chosen employee
async function updateRole() {

    let name;

    let searchType = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Would you like to enter an employee name or choose from a list?',
        choices: ['Enter name', 'Choose from list']
    })

    if (searchType.choice === 'Enter name') {

        let searchName = await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: "Please enter the employee's name that you would like to edit:"
        });

        name = searchName.name;

    } else if (searchType.choice === 'Choose from list') {

        let searchList = await inquirer.prompt({
            type: 'list',
            name: 'choice',
            message: 'Please select an employee from the following list',
            choices: await getChoices('employee')
        });

        name = searchList.choice;
    };

    let nameArr = name.split(' ')
    let fName = nameArr[0];
    let lName = nameArr[1];


    let newRole = await inquirer.prompt({
        type: 'list',
        name: 'role',
        message: 'Please choose a new role',
        choices: [...await getChoices('role')]
    })


    let roleID = await getID('role', newRole.role)

    await db.promise().query(`UPDATE employee SET role_id=${roleID} WHERE first_name='${fName}' AND last_name='${lName}'`);


    console.log(`${fName} ${lName}'s role was successfully updated`)
    return;

}


module.exports =  { showTable, addData, updateRole };

// TODO: figure out how to join managers to the table. Currently if an employee doesn't have a manager they don't get logged to the table if I attempt a relationship to manager_id. Currently any employee who doesn't have a manager the id is set to themselves