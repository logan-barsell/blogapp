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
	// Creates a comment table
	comment = db.define('comment', {
		comment: sequelize.TEXT
	})


user.hasMany(message)
message.belongsTo(user)

comment.belongsTo(user)
user.hasMany(comment)

comment.belongsTo(message)
message.hasMany(comment)

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
	if (req.query.logout){
		req.session.destroy()
		res.render('login')
	}
})

//insert a new entry into the users table
.post('/new-user', (req, res) => {
   //takes everything in request.body, from name attribute in pug file
 	user.create(req.body).then((user) => {
    	//redirects to home
    	req.session.user = user
 		res.redirect('home')
 	})
})

// Makes a get request to home
.get('/home', (req, res) => {
	// Finds all messages in the database
	message.findAll({
		include: [comment, user]
	}).then( (messages) => {
		console.log('These are all messages', messages)
		// Renders home page with messages object as parameter
		res.render('home', {
			messages: messages,
			user: req.session.user,
		})
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
		res.redirect('/home')
	})	
})

// Posts a new message
.post('/new-message', (req, res) => {
	console.log('Body of the message post', req.body)
   //takes everything in req.body and posts a new message post
 	message.create({
 	 	title: req.body.title,
 	 	body: req.body.body,
 	 	userId: req.session.user.id
 	 //refreshes home page	
 	}).then( newpost => {
    	res.redirect('/home')
 	})
})

// Posts a new comment
.post('/new-comment', (req, res) => {
	console.log('Comment made:', req.body)
	comment.create({
		comment: req.body.comment,
		messageId: req.body.messageId,
		userId: req.session.user.id
	}).then(newcomment => {
		res.redirect('/home')
	})
})

// Renders the profile page
.get('/profile', (req, res) => {
	message.findAll({
		where: {
			userId: req.session.user.id
		},
		include: [comment, user]
	}).then( (messages) => {
		console.log('These are all messages', messages)
		// Renders home page with messages object as parameter
		res.render('profile', {
			messages: messages,
			user: req.session.user
		})
	})
})
// Renders the single post page
.get('/singlepost', (req, res) => {
	message.findOne({
		include: [comment, user]
	}).then( (messages) => {
		res.render('singlepost', {
			messages: messages,
			user: req.session.user,
		})
	})
})


db.sync({force: true}).then( f => {
	return user.create({
		username: "Logan",
		password: "123"
	})
}).then(user => {
	return user.createMessage({
		title: "Come together",
		body: 'Right now, over me'
	})
}).then( themessage => {
	console.log('Creating message', themessage)
	return themessage.createComment({
		comment: "I love this song!"
	})
}).then( thecomment => {	
	return user.findOne({
		where: {
			username: "Logan"
		},
		include: [ {
			model: message,
			include: [comment]
		} ]
	})
} ).then( founduser => {
	console.log( founduser.get( {plain: true} ) )
} ).catch( console.log.bind( console ) )

// Make the server listen on port 3000
app.listen(3000, f=> {
console.log('Server Running!')
})