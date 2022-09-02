import {API_HOST} from '../api.js'

const processalumnis = (alumnis) => {
    const processedalumni = alumnis.map(member => {
        const {img, img_mimetype, ...r_obj} = member
        return r_obj
    })

    return processedalumni
}

export const get_all_alumni = (setalumnis, setMode) => {
    const url = `${API_HOST}/api/alumni`
    fetch(url).then(response => response.json()).then(json => 
        {
            setMode("alumni")
            setalumnis(processalumnis(json.alumnis))}
        
        )
    
}