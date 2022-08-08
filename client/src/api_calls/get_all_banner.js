import {API_HOST} from '../api.js'

const processBanners = (banners) => {
    
    const processedBanners = banners.map(banner => {
        const {img, img_mimetype, ...r_obj} = banner
        return openBannerBody(r_obj)
    })
    console.log("I am banner")
    console.log(processedBanners)
    return processedBanners
}

const openBannerBody = (body) => {

	var allData = {name: body.name, _id: body._id}

	// parsing the boolean values

	// finding all avaiable params
	const general = Object.keys(body.general).map(key => allData[`general-${key}`] = body.general[key])
    const heading = Object.keys(body.heading).map(key => allData[`heading-${key}`] = body.heading[key])
	const subHeading = Object.keys(body.subHeading).map(key => allData[`subHeading-${key}`] = body.subHeading[key])
	const button = Object.keys(body.button).map(key => allData[`button-${key}`] = body.button[key])

	// Creaing master banner object
	return allData }


export const get_all_banner = (setBanners, setMode) => {
    const url = `${API_HOST}/api/banner`
    fetch(url).then(response => response.json()).then(json => {
        setMode("banner")
        setBanners(processBanners(json.banners))
    }
        
        )
}