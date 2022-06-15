'use strict';
const log = console.log;
const path = require('path')

const envHeader = "/api"
const host = "https://restore-backend.herokuapp.com/"

// Express
const express = require('express')

// staring express server
const app = express();

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set('useFindAndModify', false); // for some deprecation issues

// Adding body parser 
const bodyParser = require('body-parser')
app.use(bodyParser.json());

// Adding file uploads
const fileUpload = require('express-fileupload')
const fs = require('fs')
app.use(fileUpload())

// Adding cors
const cors = require('cors')
app.use(cors())


// importing mongoose models
const { Team } = require("./models/team")
const { Project } = require("./models/project")
const { Research } = require("./models/research")


// to validate Object IDs
const { Binary, ObjectId } = require('mongodb')


function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
	return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}

// Checking if mongo connection is ready
const mongoChecker = (req, res, next) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
        log('Issue with mongoose connection')
        res.status(500).send('Internal server error')
        return;
    } else {
        next()  
    }   
}

/*** API routes below **********************************/

// Route for getting all team members
app.get(`${envHeader}/team`, async(req, res) => {
    
    try {
        const teams = await Team.find()
		teams.sort((a,b) => {
			const option_list = ["lead", "colab_sci", "volunteers", "student"]
			return option_list.indexOf(a.type) < option_list.indexOf(b.type) ? -1:1
		})
        res.send({ teams })
    }
    catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// Route for adding one team member
app.post(`${envHeader}/team`, async (req, res) => {
	// Add code here

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

    const buf = Buffer.from(req.files.img.data)
    const mimetype = req.files.img.mimetype;
	const finalReq = {...req.body, type: req.body.category, img: buf, img_mimetype: mimetype, html_id: `${req.body.name.split(' ')[0]}_id`}

	try {
		const team = new Team(finalReq)
		const result = await team.save()
        res.redirect(`${host}`)

	} catch(error) {
		if (isMongoError(error)) {
			res.status(500).send("Internal Server Error")
		}
		else {
			res.status(400).send("Bad Request")
		}
	}
})

// Route for updating one team member
app.post(`${envHeader}/team/update`, async (req, res) => {
	// Add code here

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	try {
		
		await Team.updateOne({"_id": ObjectId(req.body._id)}, req.body)
        res.sendStatus(200)

	} catch(error) {
		if (isMongoError(error)) {
			res.status(500).send("Internal Server Error")
		}
		else {
			res.status(400).send("Bad Request")
		}
	}
})

// Route for getting all project members
app.get(`${envHeader}/project`, async(req, res) => {
    
    try {
        const projects = await Project.find()
        res.send({ projects })
    }
    catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// Route for adding one project member
app.post(`${envHeader}/project`, async (req, res) => {
	// Add code here

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

    const buf = Buffer.from(req.files.img.data)
    const mimetype = req.files.img.mimetype;
	const finalReq = {...req.body, img: buf, img_mimetype: mimetype, html_id: `${req.body.short_navbar_title.split(" ")[0]}_id`}
	try {
		const project = new Project(finalReq)
		const result = await project.save()
        res.redirect(`${host}`)
	} catch(error) {
		if (isMongoError(error)) {
			res.status(500).send("Internal Server Error")
		}
		else {
			console.log(error)
			res.status(400).send("Bad Request")
		}
	}
})


// Route for getting all project member slugs and short name
app.get(`${envHeader}/project/navbar`, async(req, res) => {
    
    try {
        const projects = await Project.find()
        const filterProjects = projects.map(project => {return ({title: project.short_navbar_title, id:project.html_id}) })
        res.send({ projects: filterProjects })
    }
    catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// Route for updating one project
app.post(`${envHeader}/project/update`, async (req, res) => {
	// Add code here

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	try {
		
		await Project.updateOne({"_id": ObjectId(req.body._id)}, req.body)
        res.sendStatus(200)

	} catch(error) {
		if (isMongoError(error)) {
			res.status(500).send("Internal Server Error")
		}
		else {
			res.status(400).send("Bad Request")
		}
	}
})


// Route for deleting a team member
app.delete(`${envHeader}/team/`, async (req, res)=> {
	
	const team_id = req.query.id
	if (!ObjectId.isValid(team_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;
	}
	await Team.deleteOne({"_id": ObjectId(team_id)})
	res.redirect(`${host}`)
	
})

// Route for deleting a project member
app.delete(`${envHeader}/project/`, async (req, res)=> {
	
	const project_id = req.query.id
	if (!ObjectId.isValid(project_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;
	}

	await Project.deleteOne({"_id": ObjectId(project_id)})
	res.sendStatus(200)
})

// ********************************************************************************* //
// ****************************** Routes for Research ****************************** //
// ********************************************************************************* //

// Route for getting all project members
app.get(`${envHeader}/research`, async(req, res) => {
    
    try {
        const research_list = await Research.find()
        res.send({ research_list })
    }
    catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// Route for adding one project member
app.post(`${envHeader}/research`, async (req, res) => {
	// Add code here

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

    const buf = Buffer.from(req.files.img.data)
    const mimetype = req.files.img.mimetype;
	const finalReq = {...req.body, img: buf, img_mimetype: mimetype, html_id: `${req.body.short_navbar_title.split(" ")[0]}_id`}
	try {
		const research = new Research(finalReq)
		const result = await research.save()
        res.redirect(`${host}`)
	} catch(error) {
		if (isMongoError(error)) {
			res.status(500).send("Internal Server Error")
		}
		else {
			console.log(error)
			res.status(400).send("Bad Request")
		}
	}
})


// Route for getting all research member slugs and short name
app.get(`${envHeader}/project/navbar`, async(req, res) => {
    
    try {
        const research_list = await Research.find()
        const filterProjects = research_list.map(research => {return ({title: research.short_navbar_title, id:research.html_id}) })
        res.send({ projects: filterProjects })
    }
    catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// Route for updating one research paper
app.post(`${envHeader}/research/update`, async (req, res) => {
	// Add code here

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	try {
		
		await Research.updateOne({"_id": ObjectId(req.body._id)}, req.body)
        res.sendStatus(200)

	} catch(error) {
		if (isMongoError(error)) {
			res.status(500).send("Internal Server Error")
		}
		else {
			res.status(400).send("Bad Request")
		}
	}
})

// Route for deleting a research member
app.delete(`${envHeader}/research/`, async (req, res)=> {
	
	const research_id = req.query.id
	if (!ObjectId.isValid(research_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;
	}

	await Research.deleteOne({"_id": ObjectId(research_id)})
	res.sendStatus(200)
})

// ********************************************************************************* //
// ****************************** END OF Routes for Research ****************************** //
// ********************************************************************************* //

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
    // check for page routes that we expect in the frontend to provide correct status code.
    const goodPageRoutes = ["/", "/add", "/delete"];
    if (!goodPageRoutes.includes(req.url)) {
        // if url not in expected page routes, set status to 404.
        res.status(404);
    }

    // send index.html
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
    log(`Listening on port ${port}...`);
});
