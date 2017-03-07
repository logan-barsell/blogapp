const express = require('express'),
	session = require('express-session'),
	app = express (),
	pug = require('pug'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	pg = require('pg')
	
app.set('views', __dirname+'/views'),
.set('view engine', 'pug'),

.use(bodyParser.urlencoded({extended:true})),
.use('/static', express.static(__dirname+"/static")),








.listen(3000, f=> {
console.log('Server Running!')
})