import {API_HOST} from '../api.js'

const processTeams = (teams) => {
    const processedTeam = teams.map(member => {
        const {img, img_mimetype, ...r_obj} = member
        return r_obj
    })

    return processedTeam
}

export const get_current_traffic = (setTraffic) => {
    
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    
    const url = `${API_HOST}/api/traffic/${today}`

    fetch(url).then(response => response.json()).then(json => setTraffic(json.length))
}