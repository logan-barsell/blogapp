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
	// Initializes hover.css


	// Creates data base blogpg
	db = new sequelize('blogapp', process.env.POSTGRES_USER, process.env.POSTGRESS_PASSWORD, {
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
		body: sequelize.TEXT,
		likes: sequelize.INTEGER
	})
	// Creates a comment table
	comment = db.define('comment', {
		comment: sequelize.TEXT
	})

message.belongsTo(user)
user.hasMany(message)

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
	if (req.query.sessionend){
		req.session.destroy()
		res.render('login')
	}
	else {
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
		// include: [comment, user]
		include: [
			{ model: comment, include: [ user ] },
			{ model: user }
		]
	}).then( (messages) => {
		// Renders home page with messages object as parameter
		res.render('home', {
			messages: messages,
			user: req.session.user,
			comments: message.comments
		})
	})
})

.post('/home', (req, res) => {
	user.findOne({
		where:{
			username: req.body.username
		}
	}).then( theuser => {
		req.session.user = theuser
		res.redirect('/home')
	})	
})


// Posts a new message
.post('/new-message', (req, res) => {
   //takes everything in req.body and posts a new message post
    if (req.session.user){
	 	message.create({
	 	 	title: req.body.title,
	 	 	body: req.body.body,
	 	 	userId: req.session.user.id,
	 	 	likes: 0
	 	 //refreshes home page	
	 	}).then( newpost => {
	    	res.redirect('/home')
	 	})
	 }else {
	 	message.create({
	 		title: req.body.title,
	 		body:req.body.body,
	 		likes: 0
	 	}).then( newpost => {
	 		console.log("DONE!")
	 	})
	 }
})

.post('/like', (req, res) => {
	message.update({likes: req.body.msgLikes}, {
		where: {
			id: req.body.messageId
		}
	})
	res.send('done')
})

.post('/edit-message', (req, res) => {
  	message.update(req.body, {
  		where: {
  			id : req.body.messageId
  		}
  	}).then( updatemessage => {
    	res.redirect('/home')
    })
})

.post('/delete/:id', (req, res) => {
	message.destroy({
		where: {
			id : req.params.id
		}
	}).then( deletemessage => {
		res.redirect('/home')
	})
})

// Posts a new comment
.post('/new-comment', (req, res) => {
	if (req.session.user) {
		comment.create({
			comment: req.body.comment,
			messageId: req.body.messageId,
			userId: req.session.user.id
		}).then(newcomment => {
			res.redirect('/home')
		})
	} else {
		comment.create({
			comment: req.body.comment,
			messageId: req.body.messageId
		}).then(newcomment => {
			res.redirect('/home')
		})
	}	
})

// Renders the profile page
.get('/profile', (req, res) => {
	if (req.session.user){
		message.findAll({
			where: {
				userId: req.session.user.id
			},
			include: [
				{ model: comment, include: [ user ] },
				{ model: user }
			]
		}).then( (messages) => {
			// Renders home page with messages object as parameter
			res.render('profile', {
				messages: messages,
				user: req.session.user
			})
		})
	}
	else {
		res.render('profile', {
			user: req.session.user
		})
	}
})

// Renders the single post page
.get('/singlepost/:title', (req, res) => {
	message.findOne({
		where: {
			title: req.params.title
		},
		include: [
			{ model: comment, include: [ user ] },
			{ model: user }
		]
	}).then( (onemessage) => {
		res.render('singlepost', {
			message: onemessage,
			user: req.session.user
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
		body: 'Right now, over me',
		likes: 0
	})
}).then( themessage => {
	console.log('Creating message', themessage)
	return themessage.createComment({
		comment: "I love this song!",
		userId: 1
	})
}).then( thecomment => {	
	return user.findOne({
		where: {
			username: "Logan",
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