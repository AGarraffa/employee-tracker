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

// just a function to pause the app
async function pauseFunction() {
    
    await inquirer.prompt(pause);

    console.log('--------------------------------------------------')

    return;
}


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
    
            // console.log(queryRes[0])

            queryRes[0].forEach(element => {
                
                if (element.Name === element.Manager) {
                    element.Manager = 'N/A';
                }

            });
    
            break;
    }
    
    console.table(queryRes[0])
    await pauseFunction();

    return;
};

// adds a new entry in the selected table (department, role, employee)
async function addData(entry) {

    console.log(`running addEntry ${entry}`)
    
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
        choices: await getChoices('department')
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
        choices: await getChoices('role')
    },
    {
        type: 'list',
        name: 'mgr',
        message: 'Who is their manager?',
        choices: ['No one', ...await getChoices('manager')]
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

            // This sets the manager ID to the ID of the new entry (if manager ID is null then the record isn't returned during the showTable funciton)
            if (answers.mgr == 'No one'){

                mgr_id = null;
                
                console.log('no manager')
                await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager) VALUES ('${firstName}', '${lastName}', '${role_id}', ${mgr_id}, '${isMgr}')`)

                let newID = await getID('employee', fullName);

                await db.promise().query(`UPDATE employee SET manager_id=${newID} WHERE id=${newID}`)
            }

            else {

                mgr_id = await getID('manager', answers.mgr);

                await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager) VALUES ('${firstName}', '${lastName}', '${role_id}', '${mgr_id}', '${isMgr}')`)
                console.log(`${firstName} ${lastName} was successfully added to the employees.`)

            }

            break;
        
    }
    
    await pauseFunction();
    return;

};




// returns the id of a specific entry
async function getID(entry, search) {


    let table;
    let query;
    let id;

    switch (entry) {
        case 'department':
            // column = 'name';
            table = 'department'
            query = `name='${search}'`;
            break;
        
        case 'role':
            // column = 'title';
            table = 'role'
            query = `title='${search}'`;
            break;

        case 'employee':
            table = 'employee'
            let empName = search.split(' ')
            query = `first_name='${empName[0]}' AND last_name='${empName[1]}'`

        case 'manager':
            table = 'employee'
            let mgrName = search.split(' ')
            query = `last_name='${mgrName[1]}'`;
            // column = 'last_name';
            break;

    }

    id = await db.promise().query(`SELECT id FROM ${table} WHERE ${query}`)

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
            queryRes = await db.promise().query(`SELECT CONCAT(first_name, ' ', last_name) AS Name FROM employee`)

            console.log(queryRes[0].Name)
    
                for (let i = 0; i < queryRes[0].length; i++) {



                    // let fullName = `${queryRes[0][i].Name}`
                    choiceArr.push(`${queryRes[0][i].Name}`);

                    }

            break;


        case 'manager': 
            queryRes = await db.promise().query(`SELECT CONCAT(first_name, ' ', last_name) AS Manager FROM employee WHERE is_manager=1`)




                for (let i = 0; i < queryRes[0].length; i++) {

                    // let fullName = `${queryRes[0][i].first_name} ${queryRes[0][i].last_name}`
                    choiceArr.push(`${queryRes[0][i].Manager}`)

                    }

            break;
    }

    return choiceArr;
}


// used to update the role of a chosen employee
async function updateEmpData() {

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


    // gets the ID of the selected employee
    let id = await getID('employee', name);

    let nameArr = name.split(' ')
    let fName = nameArr[0];
    let lName = nameArr[1];


    let mgrOrRole = await inquirer.prompt({
        type: 'list',
        name: 'entry',
        message: 'What would you like to update?',
        choices: ['Name', 'Role', 'Manager']
    })


    switch (mgrOrRole.entry) {

        case 'Name':

            let newName = await inquirer.prompt({
                type: 'input',
                name: 'name',
                message: 'Please enter a new name: '
            })


            newName = newName.name;
            let nameArr = newName.split(' ')
            let newFirst = nameArr[0];
            let newLast = nameArr[1];

            await db.promise().query(`UPDATE employee SET first_name='${newFirst}', last_name='${newLast}' WHERE id='${id}'`)

            console.log(`${newName} has been successfully updated`)

            break;

        case 'Role':

            let newRole = await inquirer.prompt({
                type: 'list',
                name: 'role',
                message: 'Please choose a new role',
                choices: [...await getChoices('role')]
            })
        
            let roleID = await getID('role', newRole.role)
        
            await db.promise().query(`UPDATE employee SET role_id=${roleID} WHERE id='${id}'`);
        
            console.log(`${name}'s role was successfully updated`)

            break;

        case 'Manager':

            let newMgr = await inquirer.prompt({
                type: 'list',
                name: 'manager',
                message: 'Please choose a new manager: ',
                choices: [...await getChoices('manager')]
            })

            newMgr = newMgr.manager;

            // gets the ID of the selected manager
            let mgrID = await getID('employee', newMgr);

            await db.promise().query(`UPDATE employee set manager_id='${mgrID}' WHERE id='${id}'`)

            console.log(`${name}'s manager was successfully updated.`)

            break;

    }

    await pauseFunction();
    return;

}


module.exports =  { showTable, addData, updateEmpData };

// TODO:
// add error handling and validation (specifically with queries that find 0 results) 
// set up
// delete functionality
// view dept budget
// refactor to have the 'choose a department/role/employee' prompt to be it's own function