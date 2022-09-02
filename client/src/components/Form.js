import React, {useState} from 'react';
import {teamDataStructure, projectDataStructure, bannerDataStructure, alumniDataStructure} from './FormData.js'
import Home from './Home.js'
import {API_HOST} from '../api.js'
import "./Form.css"

export default function Form() {

  const [currentMode, setCurrentMode] = useState("team")
  const modeMapping = {
    "team": {name: "Team Member", structure: teamDataStructure}, 
    "project" : {name: "Project", structure: projectDataStructure}, 
    "banner" : {name: "Banner", structure: bannerDataStructure}, 
    "alumni" : {name: "Alumni", structure: alumniDataStructure}
  }

  return (
      <>
      <Home/>
    <div class="headingContainer">
        <h1> Add {modeMapping[currentMode].name}</h1>
        <select value={currentMode} onChange={(e)=>{setCurrentMode(e.target.value)}}>
            <option value="team"> Add Team Member</option>
            <option value="project"> Add Project</option>
            <option value="banner">Add Banner</option>
            <option value="alumni">Add Alumni</option>
        </select>
    </div>
  <div class="formContainer">
      <form id="form" action={`${API_HOST}/api/${currentMode}`} method="POST" enctype="multipart/form-data">
      <div class="inputContainer">
          {(modeMapping[currentMode].structure).map(data => {
              
              if (data.type === "Heading/Separator") {
                return (
                    <div>
                        <h4>{data.label}</h4>
                    </div>
                )
              }
              
              return (
                  <div>
                      <label> {data.label}: </label>
                      {data.type !== "select" ? 
                      <input name={data.formName} type={data.type} required={data.required}/> :
                      <select name={data.formName} form="form" required={data.required}>
                          {data.option_list.map(x => {
                              return (<option value={x.formName}>{x.value}</option>)
                          })}
                      </select>}
                  </div>
              )
          })}
          <input type="submit" onClick={()=>{alert(`${currentMode} Added`)}}/>
      </div>
      </form>

    
  </div>
      </>
    );
}
