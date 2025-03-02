const http = require("http")
const url = require("url");
const qs = require("querystring")
const {RechnungenDB} = require("/home/malte/Documents/nodeJS/projekt_node/rechungsDB.js")
//windows : "C:/node_js/node_projekt/rechungsDB.js"

const {UserDB} = require("/home/malte/Documents/nodeJS/projekt_node/userDB.js")
//windows : C:/node_js/node_projekt/userDB.js

const PORT = 8000
const IP = "0.0.0.0"


async function getUnsents() {

		const DB = new RechnungenDB();
		DB.openDB()

		let id_array = await DB.getAllUnsent()
		let promises = []

		id_array.forEach( id_instanz => {

			promises.push(DB.getRechnung(id_instanz.id))
		})

		return Promise.all(promises)
			
		}
	 
 

const server = http.createServer( (req, res) => {
    
	const request_url  = req.url
	const request_data = url.parse( req.url ) // http://127.0.0.1:8000?name=X&passwort=Y
	const request_query = qs.parse( request_data.query ) // name=X&passwort=Y
		
    if(req){
		console.log(req.method)
		//Loginform teilweise geklaut von https://www.geeksforgeeks.org/html-login-form/
		let html_template = `
					<html>
					<head>
					<meta charset='utf-8'/>
					<title>Rechnung 123</title></head>
					<body>
					<h1 style='color: #3D80CC'>ProbeLogin</h1>
				    <div style='clear:both'>
					<form action="" style='display: flex; flex-flow: row wrap; align-items: center;'>
						<label for="name">Username:</label>
						<input type="text" id="name" name="name" placeholder="Enter your Username" style="color: blue; font-size: 46px;" required>
					
						<label for="password">Password:</label>
						<input type="password" id="password" name="passwort" placeholder="Enter your Password" required>
						<button type="submit"> Submit </button>
					</form>`

		const userLogin = new UserDB()

		userLogin.openDB()
		userLogin.loginUser(request_query["name"], request_query["passwort"])
		.then(ergebnis => {
			

			if(ergebnis.length > 0){

				html_template += `Login erfolgreich Bruddi!`
				console.log("Login erfolgreich!")



				const testDB = new RechnungenDB()
				
				testDB.openDB()
				
				getUnsents().then(gesettled => {

					gesettled.forEach(banane => console.log(banane))
					console.log(gesettled.length+ "Länge")})
				




				testDB.getRechnung(4)
				.then( ergebnisse => {
					let html_tomplate = `
							<html>
							<head>
							<meta charset='utf-8'/>
							<title>Rechnung 123</title></head>
							<body>
							<h1 style='color: #3D80CC'>Probestuff</h1>
							<div style='clear:both'>
							<div style='float:left;width:100%;'>
								<h2>Kundennummer: ${ergebnisse[0].kunde} Frau/Herr ${ergebnisse[0].name} email: ${ergebnisse[0].email}</h2>
								<h2>Rechnung No: ${ergebnisse[0].rechnungs_id} vom ${ergebnisse[0].datum}</h2>
							`
		
					ergebnisse.forEach(posten => {
									let pos_summe = posten.menge*posten.preis
									console.log(pos_summe)
									html_tomplate += 
									`<p>${posten.prod_name} -> ${posten.menge} * ${posten.preis}€ = ${pos_summe}€</p>
									`
		
									})
								
							html_tomplate += `
							</br>
							<p> Status:</br>
							Verschickt: ${ergebnisse[0].verschickt} Beglichen: ${ergebnisse[0].beglichen}<p>
							</div>
							</div></body></html>`
							
							
							
							res.writeHead( 200 )
							res.end( html_tomplate )
							
				})
				.catch(err => {console.log(err)})
				testDB.closeDB()
			}
			else{
				html_template += `Dich gibts gar nicht!`
				console.log("Dich gibts gar nciht!")
				html_template += `</body></html>`
				res.writeHead( 200 )
				res.end( html_template )
				html_template = ``
			}

			
		})
		userLogin.closeDB()


    }

})





server.listen( PORT, IP , (err) => {
	if(err) throw err;	
	console.log("waiting for connections")
});