'use strict';
const log = console.log;
const path = require('path')

const envHeader = "/api"
// const host = "https://restorelabbackend.herokuapp.com/"
const host = "https://localhost:3000"

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
const { Banner } = require("./models/banner")
const { Traffic } = require("./models/traffic")
const { Alumni } = require("./models/alumni")

// Force creating the index //
// Traffic.ensureIndexes()

// to validate Object IDs
const { Binary, ObjectId} = require('mongodb')


function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
	return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}

// middleware for inspecting traffic
const trafficInspector = async(req, res, next) => {
    // check mongoose connection established.

	try {
		const cookie = req.params.cookie
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		today = mm + '/' + dd + '/' + yyyy;
		
		var ip = cookie

		const traffic = new Traffic({ip_address: ip, date: today})
		const result = await traffic.save()
	}
	catch(err) {
		;
	}
	
    next();
}

// Helper function to parse banner object
const parseBannerBody = (req) => {
	
	var body = req.body

	const allKeys = Object.keys(body);

	// parsing the boolean values

	// finding all avaiable params
	const general = Object.assign({}, ...(allKeys.filter(key => key.startsWith("general"))).map((prop) => {return ({[prop.split("-")[1]]: body[prop]})}))
	const heading = Object.assign({}, ...(allKeys.filter(key => key.startsWith("heading"))).map((prop) => {return ({[prop.split("-")[1]]: body[prop]})}))
	const subHeading = Object.assign({}, ...(allKeys.filter(key => key.startsWith("subHeading"))).map((prop) => {return ({[prop.split("-")[1]]: body[prop]})}))
	const button = Object.assign({}, ...(allKeys.filter(key => key.startsWith("button"))).map((prop) => {return ({[prop.split("-")[1]]: body[prop]})}))

	// Creaing master banner object
	const banner = {name: req.body.name, general, heading, subHeading, button}
	return banner;
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

// Route for getting all team members without images
app.get(`${envHeader}/team_no_image`, async(req, res) => {
    
    try {
        const teams = await Team.find().select(["-img"])
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

// Route for getting image of a specific team member using it's object id
app.get(`${envHeader}/team_id_image/:id`, async(req, res) => {
    
	const objID = req.params.id;
    try {
        const teams = await Team.findById(objID)
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
	
    const imgbuf = Buffer.from(req.files.img.data)
    const img_mimetype = req.files.img.mimetype;
	const filebuf = req.files.buttonDownload ? Buffer.from(req.files.buttonDownload.data) : null
	const file_mimetype = req.files.buttonDownload ? req.files.buttonDownload.mimetype : null
	const finalReq = {...req.body, img: imgbuf, img_mimetype: img_mimetype, html_id: `${req.body.short_navbar_title.split(" ")[0]}_id`}
	if (filebuf) {
		finalReq["buttonDownload"] = filebuf; 
		finalReq["download_mimetype"]=file_mimetype;
		console.log("pdf file added")
		console.log(file_mimetype)
	}

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
app.get(`${envHeader}/project/navbar/:cookie`, trafficInspector, async(req, res) => {
    
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

// Route for getting pdf file given a specific objectID
app.get(`${envHeader}/project_pdf/:id`, async(req, res) => {
    
	const objID = req.params.id;
    try {
        const projects = await Project.findById(objID).select(["-img"])
        res.send({ projects })
    }
    catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
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

// Route for adding a banner
app.post(`${envHeader}/banner`, async (req, res) => {

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	const bannerData = parseBannerBody(req)

    const buf = Buffer.from(req.files.img.data)
    const mimetype = req.files.img.mimetype;
	const finalReq = {...bannerData, img: buf, img_mimetype: mimetype}

	try {
		const banner = new Banner(finalReq)
		const result = await banner.save()
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

// Route for getting all Banners
app.get(`${envHeader}/banner`, async(req, res) => {
    
    try {
        const banners = await Banner.find()
        res.send({ banners })
    }
    catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// Route for updating banner
app.post(`${envHeader}/banner/update`, async (req, res) => {
	// Add code here

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}
	const bannerData = parseBannerBody(req)

	try {
		await Banner.updateOne({"_id": ObjectId(req.body._id)}, {"_id": req.body._id, ...bannerData})
        res.sendStatus(200)

	} catch(error) {
		console.log(error)
		if (isMongoError(error)) {
			res.status(500).send("Internal Server Error")
		}
		else {
			res.status(400).send("Bad Request")
		}
	}
})

// Route for deleting a banner
app.delete(`${envHeader}/banner/`, async (req, res)=> {
	
	const banner_id = req.query.id
	if (!ObjectId.isValid(banner_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;
	}

	await Banner.deleteOne({"_id": ObjectId(banner_id)})
	res.sendStatus(200)
})

// Route for getting traffic by date
app.get(`${envHeader}/traffic/:date`, async(req, res) => {
    
	const date = (req.params.date).replaceAll("-", "/");
    try {
        const teams = await Traffic.find({"date": date})
        res.send({ length: teams.length })
    }
    catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})
/*** All Alumni Routes below **********************************/

// Route for getting all alumni members
app.get(`${envHeader}/alumni`, async(req, res) => {
    
    try {
        const alumnis = await Alumni.find()
		alumnis.sort((a,b) => {
			const option_list = ["lead", "colab_sci", "volunteers", "student"]
			return option_list.indexOf(a.type) < option_list.indexOf(b.type) ? -1:1
		})
        res.send({ alumnis })
    }
    catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// Route for getting all alumni members without images
app.get(`${envHeader}/alumni_no_image`, async(req, res) => {
    
    try {
        const alumnis = await Alumni.find().select(["-img"])
		alumnis.sort((a,b) => {
			const option_list = ["lead", "colab_sci", "volunteers", "student"]
			return option_list.indexOf(a.type) < option_list.indexOf(b.type) ? -1:1
		})
        res.send({ alumnis })
    }
    catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// Route for getting image of a specific alumni member using it's object id
app.get(`${envHeader}/alumni_id_image/:id`, async(req, res) => {
    
	const objID = req.params.id;
    try {
        const alumnis = await Alumni.findById(objID)
        res.send({ alumnis })
    }
    catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// Route for adding one alumni member
app.post(`${envHeader}/alumni`, async (req, res) => {
	// Add code here

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

    // Removing linked, website and email incase they are all empty
    Object.keys(req.body).forEach(key => {
        if (req.body[key] === '') {
          delete req.body[key];
        }
      });


    const buf = Buffer.from(req.files.img.data)
    const mimetype = req.files.img.mimetype;
	const finalReq = {...req.body, type: req.body.category, img: buf, img_mimetype: mimetype, html_id: `${req.body.name.split(' ')[0]}_id`}

	try {
		const alumni = new Alumni(finalReq)
		const result = await alumni.save()
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

// Route for updating one alumni member
app.post(`${envHeader}/alumni/update`, async (req, res) => {
	// Add code here

	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	}

	try {

        // Removing linked, website and email incase they are all empty
        Object.keys(req.body).forEach(key => {
            if (req.body[key] === '') {
            delete req.body[key];
            }
        });
		
		await Alumni.updateOne({"_id": ObjectId(req.body._id)}, req.body)
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


// Route for deleting a alumni member
app.delete(`${envHeader}/alumni/`, async (req, res)=> {
	
	const alumni_id = req.query.id
	if (!ObjectId.isValid(alumni_id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;
	}
	await Alumni.deleteOne({"_id": ObjectId(alumni_id)})
	res.redirect(`${host}`)
	
})



/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(path.join(__dirname, "/client/build")));

app.use('/pdmdata', express.static(path.join(__dirname, 'datasets')))

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
const port = process.env.PORT || 3000;
app.listen(port, () => {
    log(`Listening on port ${port}...`);
});
