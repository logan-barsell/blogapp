	// Requires the main express library
const express = require('express'),
	// Creates app from the library
	app = express (),
	// Creates a session middleware for making cookie settings
	session = require('express-session'),
	// enables use of pug for view engine
	pug = require('pug'),
	// enables fs module for file operations
	fs = require('fs'),
	// extracts data from request stream and exposes it on req.body
	bodyParser = require('body-parser'),
	// Accesses Postgres server
	pg = require('pg')
	// Sets up a connection to communicate with the database 
	sequelize = require('sequelize')


	// Creates data base blogpg
	db = new sequelize('blogapp', 'loganbarsell1', '', {
		host: 'localhost',
		dialect: 'postgres'
	})
	// Creates a user table with username and password
	user = db.define('user', {
		username: sequelize.STRING,
		password: sequelize.STRING
	})
	// Creates a message table with title and body
	message = db.define('message', {
		title: sequelize.STRING,
		body: sequelize.TEXT
	})


// Tells express where to find views
app.set('views', __dirname+'/views')
// Sets view engine to pug
.set('view engine', 'pug')

// Middleware that only parses urlencoded bodies
.use(bodyParser.urlencoded({extended:true}))
// Serves static files
.use('/static', express.static(__dirname+"/static"))


// Renders the log-in page
app.get('/', (req, res) => {
	res.render('login')
})
// Makes a get request to /home
.get('/home', (req, res) => {
	// Finds everything in the message table then passes  it as a parameter
	message.findAll().then((messages) => {
		// Renders home page with messages object as parameter
		res.render('home', {messages: messages})
	})
})
// Renders the profile page
.get('/profile', (req, res) => {
	res.render('profile')
})
// Renders the single post page
.get('/singlepost', (req, res) => {
	res.render('singlepost')
})

// Syncs app to database
db.sync().then(() =>{
	console.log('connected to database')
})

// Make the server listen on port 3000
app.listen(3000, f=> {
console.log('Server Running!')
})