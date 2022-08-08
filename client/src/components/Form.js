import React, {useState} from 'react';
import {teamDataStructure, projectDataStructure, bannerDataStructure} from './FormData.js'
import Home from './Home.js'
import {API_HOST} from '../api.js'
import "./Form.css"

export default function Form() {

  const [currentMode, setCurrentMode] = useState("team")
  const updateCurrentMode = () => {

      if (currentMode === "team") {
          setCurrentMode("project")
      }
      else {
          setCurrentMode("team")
      }
  }

  return (
      <>
      <Home/>
    <div class="headingContainer">
        <h1> Add {currentMode === "team"? "Team Member": (currentMode=== "project" ? "Project" : "Banner")}</h1>
        <select value={currentMode} onChange={(e)=>{setCurrentMode(e.target.value)}}>
            <option value="team"> Add Team Member</option>
            <option value="project"> Add Project</option>
            <option value="banner">Add Banner</option>
        </select>
        {/* <button class="swapButton" onClick={()=>{updateCurrentMode()}}>Add {currentMode !== "team"? "Team Member": "Project"}</button> */}
    </div>
  <div class="formContainer">
      <form id="form" action={`${API_HOST}/api/${currentMode}`} method="POST" enctype="multipart/form-data">
      <div class="inputContainer">
          {(currentMode === 'team'? teamDataStructure : (currentMode=== "project" ? projectDataStructure : bannerDataStructure)).map(data => {
              
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
                      <input name={data.formName} type={data.type} required/> :
                      <select name={data.formName} form="form" required>
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
