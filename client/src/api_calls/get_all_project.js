import {API_HOST} from '../api.js'

const processProjects = (projects) => {
    const processedProject = projects.map(member => {
        const {img, img_mimetype, buttonDownload, download_mimetype, ...r_obj} = member
        return r_obj
    })

    return processedProject
}


export const get_all_project = (setProjects) => {
    const url = `${API_HOST}/api/project`
    fetch(url).then(response => response.json()).then(json => setProjects(processProjects(json.projects)))
}

const processNavProjects = (projects) => {
    const processedProjects = projects.map(project => {
        console.log(project)
        return (
            {
                title: project.title,
                path: `/projects#${project.id}`,
                cName: 'dropdown-link'
            }
        )
    })
    console.log(processedProjects)
    return processedProjects
}

export const getNavProjectItems = (setProjects, setMode) => {
    
    const url = `${API_HOST}/api/project/navbar`
    fetch(url).then(response => response.json()).then(json => {
        setMode("project")
        setProjects(processNavProjects(json.projects));
    })
}