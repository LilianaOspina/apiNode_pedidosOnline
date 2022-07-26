const mysql = require('mysql2');
const migrations = require('./migrations');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
});

migrations.forEach( (query, index) => {
    connection.query(
        query,
        function(err, results, fields) {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
            }

            if (index + 1 === migrations.length) {
                console.log("Migracion finalizada...");
                connection.end();
            }
        }
    );
});

