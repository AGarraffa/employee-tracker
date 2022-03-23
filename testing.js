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

async function test(){
let test = await db.promise().query('SELECT * FROM employee WHERE first_name="John"')

console.log(test);

if (test[0].length > 0) {
    console.log('something is returned')
}

else {
    console.log('Empty set')
}

}


test();