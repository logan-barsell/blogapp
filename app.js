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


.use(session({
  secret: 'secure as f*ck',
  saveUninitialized: false,
  resave: false,
  cookie: { secure: false },
  maxAge: 1000 * 60 * 60
}))

// Renders log-in page
.get('/', (req, res) => {
	res.render('login')
})

//insert a new entry into the users table
.post('/new-user', (req, res) => {
   //takes everything in request.body, from name attribute in pug file
 	user.create(req.body).then(() => {
    	//redirects to home
 		response.redirect('/home')
 	})
})


.post('/home', (req, res) => {
	console.log('The post req.body contains: ', req.body)
	user.findOne({
		where:{
			username: req.body.username
		}
	}).then( theuser => {
		console.log('User from database:', theuser)
		req.session.user = theuser
		res.render('home', {
			user: theuser
		})
	})	
})

.post('/new-message', (req, res) => {
	console.log(req.body)
   //takes everything in request.body, from name attribute in pug file
 	message.create(req.body).then(() => {
    	//redirects to home
 		console.log('Thanks for posting!')
 	})
})
// // Makes a get request to /home
// .get('/home', (req, res) => {
// 	// Finds everything in the message table then passes  it as a parameter
// 	message.findAll().then((messages) => {
// 		// Renders home page with messages object as parameter
// 		res.render('home', {
// 			messages: messages
// 		})
// 	})
// })

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