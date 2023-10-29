const express = require('express')
//Componentes
const bodyParser = require('body-parser')
const auth = require('./components/auth/network')
const collaborator = require('./components/collaborator/network')
const mascota = require('./components/mascota/network')
const inventario = require('./components/inventario/network')
const usoProducto = require('./components/usoproducto/network')
const citaMedica = require('./components/citamedica/network')
const registroCita = require('./components/registrocita/network')
const fotoMascota = require('./components/fotomascota/network')
const usuario = require('./components/usuario/network')
const tratamiento = require('./components/tratamiento/network')
const vacuna = require('./components/vacuna/network')

const errors = require('../network/errors')
const config = require('../config')
const path = require('path')

const app = express()

app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, '../images')));

//cors
app.all('/*', function (req, res, next) {
	// CORS headers
	res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	// Set custom headers for CORS
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,X-Client-Time,Authorization');
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});

//Router
app.use('/api/auth', auth)
app.use('/api/colaborador', collaborator)
app.use('/api/mascota', mascota)
app.use('/api/inventario', inventario)
app.use('/api/usoproducto', usoProducto)
app.use('/api/citamedica', citaMedica)
app.use('/api/registrocita', registroCita)
app.use('/api/fotomascota', fotoMascota)
app.use('/api/usuario', usuario)
app.use('/api/tratamiento', tratamiento)
app.use('/api/vacuna', vacuna)

//tiene que ir de ultimo
app.use(errors)

app.listen(config.api.port, () => {
	console.log(`Servidor alojado en http://localhost:${config.api.port}`)
})