const mysql = require('mysql2/promise');

const query = async (sql,params)=>{
    const connection = await mysql.createConnection({
        host: "bi5etijo3a871bfs0lfr-mysql.services.clever-cloud.com",
        user: "uixoxlbfgt2b09nh",
        password: "23dEgxG1AcQCEqXpvqYb",
        database: "bi5etijo3a871bfs0lfr",
        port:3306,
    });
    // const connection = await mysql.createConnection({
    //     host: process.env.MYSQLHOST,
    //     user: process.env.MYSQLUSER,
    //     password: process.env.MYSQLPASSWORD,
    //     database: process.env.MYSQLDATABASE,
    //     // port:3306,
    // });
    connection.connect(error=>{
        if(!error){
            console.log("Connected!");
        }else{
            console.log(error);
            return;
        }
    });
    const [result,] = await connection.execute(sql,params);
    return result;
}

module.exports = {query};