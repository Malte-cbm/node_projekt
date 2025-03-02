const sqlite = require("sqlite3")

class UserDB {
    constructor() {
        this.db = null;
    
    }
    
    openDB() {
        this.db = new sqlite.Database("/home/malte/Documents/nodeJS/projekt_node/rechnungenDB.db");
    } //windows : C:/node_js/node_projekt/rechnungenDB.db

    closeDB() {
        if(this.db) {
            this.db.close()
            this.db = null;
        }
    }
}

UserDB.prototype.loginUser = function(name, passwort){
    return new Promise((resolve) => {

        const query = `SELECT name, passwort FROM Usertabelle WHERE name = ? AND passwort = ?`

        this.db.all(query, [name, passwort], (err, rows )  => {

        resolve(rows)
    })
})}

UserDB.prototype.makeUser = function( name, berechtigung, email, passwort) {

    return new Promise( (resolve) => {

        const query = `INSERT INTO Usertabelle (name, berechtigung, email, passwort) VALUES (?,?,?,?)`
        
        this.db.run( query, [name, berechtigung, email, passwort] )

        resolve()
    })
}

UserDB.prototype.deleteUser = function( UserID ) {
    return new Promise( ( resolve ) => {
        
        this.db.serialize( () => {
            
            this.db.run( `DELETE FROM Usertabelle WHERE id = ? LIMIT 1`, [UserID])
            
            resolve()
        })	
    });
}


module.exports = {
	UserDB
}