import React, {useState, useEffect} from 'react'
import {get_all_project} from '../api_calls/get_all_project'
import {get_all_team} from '../api_calls/get_all_team'
import {get_all_banner} from '../api_calls/get_all_banner'
import delete_data from '../api_calls/delete'
import update_data from '../api_calls/update'
import Home from './Home.js'
import AbortController from "abort-controller"
import {teamDataStructure, projectDataStructure, bannerDataStructure} from './FormData.js'
import './Edit.css'

export default function Edit() {

  const [currentMode, setCurrentMode] = useState("team")
  const [tempData, setTempData] = useState([])
  const [tempMode, setTempMode] = useState("")
  const [data, setData] = useState([])
  const [select, setSelect] = useState(-1)
  const [switchMode, setSwitch] = useState(true)
  const [dataLoadedFlag, setDataLoadedFlag] = useState(false)
  const [currDataStruture, setCurrDataSturcture] = useState(teamDataStructure)


  const trimSpaces = (s) => {
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
    }

  const handleInputChange = (option, e) => {
      setSwitch(false)

      setData(old => {
          return (
              old.map((item, index) => {
                  if (index === select) {
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
    setTempMode(currentMode)
    currentMode === "team" ? get_all_team(setTempData, setTempMode) : (currentMode === "project" ? get_all_project(setTempData, setTempMode) : get_all_banner(setTempData, setTempMode))
    
  }, [currentMode])

  useEffect(()=> {
    if (tempMode === currentMode) {
        setData(tempData)
    }
  }, [tempData])

  useEffect(()=> {
      if (data.length !== 0 && switchMode) {
          setSelect(0)
          setDataLoadedFlag(true);

          setCurrDataSturcture(currentMode === "team" ? teamDataStructure : (currentMode === "project" ? projectDataStructure : bannerDataStructure));
          setSwitch(false)
      }

      // Removing invalid index cases
      if (select >= data.length) {
        if (data.length === 0) {
            setSelect(-1)
        }
        else {
            setSelect(0)
        }
      }
  }, [data])

  return (
      <>
      <Home/>
      <div class="EditContainer">
    <div class="headingContainer">
        <h1> Edit {currentMode === "team"? "Team Member": (currentMode=== "project" ? "Project" : "Banner")}</h1>
        <select value={currentMode} onChange={(e)=>{setCurrentMode(e.target.value)}}>
            <option value="team"> Edit Team Member</option>
            <option value="project"> Edit Project</option>
            <option value="banner"> Edit Banner</option>
        </select>
    </div>
    <div class="loadingContainer">
        <p> STATUS: {!dataLoadedFlag ? <span style={{color: "red"}}>Loading Data</span>: <span style={{color: "green"}}>Data Loaded</span>}</p>
    </div>
    <div class="selectContainer">
        <p class="selectPara"> Select {currentMode === "team"? "Team Member": (currentMode=== "project" ? "Project" : "Banner")}:</p>
        <select class="select" value={select} onChange={(e) => {setSelect(parseInt(e.target.value))}}>
            {data.map((o, index) => {
                return (
                    <option value = {index}> {(currentMode === "team" || currentMode === "banner") ? o.name : o.title} </option>
                )
            })}
        </select>
    </div>
  <div class="formContainer">
      {(select !== -1 && data.length>0 && data[select]) ? <div class="inputContainer">
          {Object.keys(data[select]).map(option => {
              if (option === "type") {
                return (
                    <div>
                        <select name="type" value={data[select]["type"]} onChange={(e)=> {handleInputChange("type", e)}}>
                          {teamDataStructure[4].option_list.map(x => {
                              return (<option value={x.formName}>{x.value}</option>)
                          })}
                         </select>
                    </div>
                )
              }
              const ignore_list = ["html_id", "_id", "__v"]
              if (!(ignore_list.includes(option) || option.endsWith("_id"))) {
                    const option_obj = (currDataStruture.find(opt => opt.formName === option))
                    if (option_obj == null) {
                        console.log(currentMode)
                        console.log(currDataStruture)
                        console.log(data)
                        console.log(option)
                    }
                    const option_type = option_obj.type
                  return (
                      <div>
                          <label> {option}: </label>
                          {option_type !== "select" ? 
                          <input class="variable-input" name={option} type={option_type} value={data[select][option]} onChange={(e) => {handleInputChange(option, e)}}/> :
                          <select name={option} value={data[select][option]} onChange={(e)=> {handleInputChange(option, e)}}>
                          {option_obj.option_list.map(x => {
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
