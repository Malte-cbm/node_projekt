const sqlite = require("sqlite3")



class RechnungenDB {
	constructor() {
		this.db = null;
	
	}
	
	openDB( ) {
		this.db = new sqlite.Database("./node.js/node_projekt/rechnungenDB.db");
	}

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
	return new Promise( ( resolve ) => {
		const query = `SELECT rtab.*, postab.* FROM Rechnungstabelle AS rtab JOIN Postentabelle AS postab ON rtab.id = postab.rechnungs_id WHERE rtab.id = ?`
		
		this.db.each( query, [RechnungsID], (err, rows )  => {
			resolve( rows )		
		})
	});
}

RechnungenDB.prototype.deleteUser = function( UserID ) {
	return new Promise( ( resolve ) => {
		
		this.db.serialize( () => {
			
			this.db.run( `DELETE FROM Usertabelle WHERE id = ? LIMIT 1`, [UserID])
			
			resolve()
		})	
	});
}

RechnungenDB.prototype.getAllCinemas = function(  ) {
	return new Promise( ( resolve ) => {
		const query = `SELECT * FROM Kino`
		
		this.db.all( query,  (err, rows )  => {
			resolve( rows )		
		})
	});
}


RechnungenDB.prototype.getNextMovies = function( cinemaID ) {
	
	const query = `SELECT Film.*, FSS.*, Saal.ID as SaalID, Saal.name as saalName
				FROM  FilmSpielzeitSaal as FSS, Film, Saal, KinoSaal
				WHERE FSS.spielzeitID IN (SELECT id FROM Spielzeiten ORDER BY Datum, Uhrzeit)
				AND Film.ID = FSS.filmID 
				AND Saal.ID = FSS.saalID
				AND KinoSaal.saalID = FSS.saalID
				AND KinoSaal.kinoID = ?
				LIMIT 5`		
				
	return new Promise( ( resolve ) => {		
		
		this.db.all( query, [cinemaID], (err, rows )  => {
			resolve( rows )		
		})
	});			
	
}

RechnungenDB.prototype.getCinema = function( cinemaID ) {
	return new Promise( ( resolve ) => {
		const query = `SELECT * FROM Kino WHERE ID = ? LIMIT 1`
		
		this.db.each( query, [cinemaID], (err, rows )  => {
			resolve( rows )		
		})
	});
}



RechnungenDB.prototype.getCinemaHalls = function( cinemaID ) {
	return new Promise( ( resolve ) => {
		const query = `SELECT Kino.ID, Kino.name as Kinoname, Saal.name FROM Kino,Saal,KinoSaal 
			WHERE KinoSaal.kinoID = Kino.ID
			AND KinoSaal.saalID = Saal.ID
			AND Kino.ID = ?`
			
				
		//const query = `SELECT Kino.ID, Kino.name as Kinoname, Saal.name FROM Kino,Saal,KinoSaal 
		//	WHERE KinoSaal.kinoID = Kino.ID
		//	AND KinoSaal.saalID = Saal.ID
		//	AND Kino.ID = ${cinemaID}`
		
		this.db.all( query,  (err, rows )  => {
			resolve( rows )		
		})
	});
}



RechnungenDB.prototype.getMovie = function( movieID ) {
	return new Promise( ( resolve ) => {
		const query = `SELECT * FROM Film WHERE ID = ? LIMIT 1`
		
		this.db.each( query, [movieID], (err, rows )  => {
			resolve( rows )		
		})
	});
}




RechnungenDB.prototype.getMovieGenre = function( movieID ) {
	
	return new Promise( ( resolve ) => {
			
		const query = `SELECT group_concat(Genre.name) as Genre FROM Film, Genre, FilmGenreZuordnung 
		WHERE Film.ID = FilmGenreZuordnung.filmID
		AND FilmGenreZuordnung.genreID = Genre.ID
		AND Film.ID = ?`
		
		this.db.all( query, [movieID], (err, rows )  => {
			resolve( rows )		
		})
	});

}



module.exports = {
	RechnungenDB
}