/** user.js **/
const bcrypt = require('bcrypt');
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class User{
	constructor(id, username, email, password, password_conf, createdAt=null, updatedAt=null){
		this.id = id;
		this.username = username;
		this.email = email;
		this.password = password;
		this.password_conf = password_conf;
		createdAt ? this.createdAt = createdAt : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = updatedAt : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
    }

    static async getUser(id){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('user_id', sql.Int, id)
	            .query('SELECT * FROM [User] '+
	            	'WHERE id = @user_id');
	        pool.close();
	        // console.log(result.recordset[0]);
	        if(result.recordset.length != 0)
	        	return new User(result.recordset[0]['id'], 
	        			result.recordset[0]['username'],
	        			result.recordset[0]['email'],
	        			result.recordset[0]['password'],
	        			result.recordset[0]['password_conf']);
	        else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
    }
    
    static async authenticate(username, password, callback){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('username', sql.NVarChar, username)
	            .query('SELECT * FROM [User] '+
	            	'WHERE username = @username');
	        pool.close();
	        // console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let user = new User(result.recordset[0]['id'], 
	        			result.recordset[0]['username'],
	        			result.recordset[0]['email'],
	        			result.recordset[0]['password'],
                        result.recordset[0]['password_conf']);

                let match = await bcrypt.compare(password, user.password.trim());
                console.log(match);
                if(match) {
                    return callback(null, user);
                }else{
                    return callback();
                }
            }
	        else{
                return callback(true);
            }            
	    } catch (err) {
            console.log(err);
            return callback(err);
	    }
    }
    
    async save(callback){
		let that = this;
		try{
            that.password = await bcrypt.hash(that.password, 10);
			let pool = new sql.ConnectionPool(sqlConfig);
			let dbConn = await pool.connect();
			let transaction = new sql.Transaction(dbConn);
			await transaction.begin();
			const request = new sql.Request(transaction);
			request.input('username', sql.NVarChar, that.username);
			request.input('email', sql.NVarChar, that.email);
			request.input('password', sql.NVarChar, that.password);
			request.input('password_conf', sql.NVarChar, that.password);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('INSERT INTO [User] (username, email, password, password_conf, createdAt, updatedAt) '
				+'OUTPUT Inserted.id VALUES (@username, @email, @password, @password_conf, @createdAt, @updatedAt);');
			that.id = result.recordset[0]['id'];
			await transaction.commit();
			pool.close();
			return callback(null, that);
		}catch (err){
            console.log(err);
            return callback(err);
		}
	}
}

module.exports = User;