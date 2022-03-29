import React, {useState, useEffect} from 'react'
import {get_all_project} from '../api_calls/get_all_project'
import {get_all_team} from '../api_calls/get_all_team'
import delete_data from '../api_calls/delete'
import update_data from '../api_calls/update'
import Home from './Home.js'
import {teamDataStructure} from './FormData.js'
import './Edit.css'

export default function Edit() {

  const [currentMode, setCurrentMode] = useState("team")
  const [data, setData] = useState([])
  const [select, setSelect] = useState(-1)
  const [switchMode, setSwitch] = useState(true)
  const [dataLoadedFlag, setDataLoadedFlag] = useState(false)

  const updateCurrentMode = () => {

      if (currentMode === "team") {
          setCurrentMode("project")
      }
      else {
          setCurrentMode("team")
      }
  }

  const trimSpaces = (s) => {
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
    }

  const handleInputChange = (option, e) => {
      setSwitch(false)

      setData(old => {
          console.log(select)
          return (
              old.map((item, index) => {
                  console.log(index)
                  if (index === select) {
                      console.log({...old[index], [option]: trimSpaces(e.target.value)})
                    return {...old[index], [option]:e.target.value}
                  }
                  else {
                      return item
                  }
              })
          )
      })
  }

  const handleDelete = () => {
    setSwitch(true)
    delete_data(currentMode, data[select]._id)
    setData(old => {return (old.filter((item, index) => {return (index !== select)}))})
  }

  const handleUpdate = () => {
      update_data(currentMode, data[select]);
      alert(`${currentMode} Updated`)
  }

  useEffect(()=> {
    setSelect(-1);
    setSwitch(true)
    setDataLoadedFlag(false);
    currentMode === "team" ? get_all_team(setData) : get_all_project(setData)
  }, [currentMode])

  useEffect(()=> {
      if (data.length !== 0 && switchMode) {
          setSelect(0)
          setDataLoadedFlag(true);
      }
  }, [data])

  return (
      <>
      <Home/>
      <div class="EditContainer">
    <div class="headingContainer">
        <h1> Edit {currentMode === "team"? "Team Member": "Project"}</h1>
        <button class="swapButton" onClick={()=>{updateCurrentMode()}}>Edit {currentMode !== "team"? "Team Member": "Project"}</button>
    </div>
    <div class="loadingContainer">
        <p> STATUS: {!dataLoadedFlag ? <span style={{color: "red"}}>Loading Data</span>: <span style={{color: "green"}}>Data Loaded</span>}</p>
    </div>
    <div class="selectContainer">
        <p class="selectPara"> Select {currentMode === "team"? "Team Member": "Project"}:</p>
        <select class="select" value={select} onChange={(e) => {setSelect(parseInt(e.target.value))}}>
            {data.map((o, index) => {
                return (
                    <option value = {index}> {currentMode === "team"? o.name : o.title} </option>
                )
            })}
        </select>
    </div>
  <div class="formContainer">
      {(select !== -1 && data.length>0) ? <div class="inputContainer">
          {Object.keys(data[select]).map(option => {
              const ignore_list = ["html_id", "_id", "__v"]
              if (!ignore_list.includes(option)) {
                  return (
                      <div>
                          <label> {option}: </label>
                          {option !== "type" ? 
                          <input class="variable-input" name={option} type= "text" value={data[select][option]} onChange={(e) => {handleInputChange(option, e)}}/> :
                          <select name="type" value={data[select]["type"]} onChange={(e)=> {handleInputChange("type", e)}}>
                          {teamDataStructure[4].option_list.map(x => {
                              return (<option value={x.formName}>{x.value}</option>)
                          })}
                         </select>}
                      </div>
                  )
              }
          })}
          <button onClick={handleUpdate}> Update </button>
          <button onClick={handleDelete}> Delete </button> 
      </div>: null}
  </div>
      </div>
      </>
    );
}
