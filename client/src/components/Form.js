import React, {useState} from 'react';
import {teamDataStructure, projectDataStructure} from './FormData.js'
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
    <div class="headingContainer">
        <h1> Add {currentMode === "team"? "Team Member": "Project"}</h1>
        <button class="swapButton" onClick={()=>{updateCurrentMode()}}>Add {currentMode !== "team"? "Team Member": "Project"}</button>
    </div>
  <div class="formContainer">
      <form id="form" action={`${API_HOST}/api/${currentMode}`} method="POST" enctype="multipart/form-data">
      <div class="inputContainer">
          {(currentMode === 'team'? teamDataStructure : projectDataStructure).map(data => {
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
