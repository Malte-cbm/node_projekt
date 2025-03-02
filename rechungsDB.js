const sqlite = require("sqlite3")

class RechnungenDB {
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

RechnungenDB.prototype.deleteRechnung = function( RechnungsID ) {
	return new Promise( ( resolve ) => {
		
		this.db.serialize( () => {
			
			this.db.run( `DELETE FROM Rechnungstabelle WHERE id = ? LIMIT 1`, [RechnungsID])
			
			resolve()
		})	
	});
}

RechnungenDB.prototype.getRechnung = function( RechnungsID ) {
	return new Promise( ( resolve, reject ) => {
		console.log( "trying to get rechnung: " + RechnungsID)
		const query = `SELECT postab.*, rtab.*, ktab.*, prodtab.name AS prod_name, prodtab.preis AS preis FROM Postentabelle AS postab 
						JOIN Produkttabelle AS prodtab ON postab.produkt_id = prodtab.id
						JOIN Rechnungstabelle AS rtab ON postab.rechnungs_id = rtab.id
						JOIN Kundentabelle AS ktab ON rtab.kunde = ktab.id 
						WHERE postab.rechnungs_id = ?`
		
		this.db.all( query, [RechnungsID], (err, rows )  => {
			if (err){reject (err)}
			else {resolve( rows )}
		})
	});
}

RechnungenDB.prototype.getAllUnsent = function(){
	return new Promise ( ( resolve, reject ) => {
		
		const query = `SELECT rtab.id FROM Rechnungstabelle AS rtab
						WHERE verschickt = 'false'`
		
		this.db.all(query, (err, rows) => {
			if (err){reject(err)}
			else{resolve (rows)}
		})
	})
}


module.exports = {
	RechnungenDB
}