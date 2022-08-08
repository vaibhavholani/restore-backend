import {API_HOST} from '../api.js'

const processTeams = (teams) => {
    const processedTeam = teams.map(member => {
        const {img, img_mimetype, ...r_obj} = member
        return r_obj
    })

    return processedTeam
}

export const get_all_team = (setTeams, setMode) => {
    const url = `${API_HOST}/api/team`
    fetch(url).then(response => response.json()).then(json => 
        {
            setMode("team")
            setTeams(processTeams(json.teams))}
        
        )
    
}