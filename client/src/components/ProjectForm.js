import './projectform.css';
import React, { useState } from 'react';
// const fs = require("fs");
// const { parse } = require("csv-parse");
import TitleBar from './Titlebar';
function ProjectForm() {
  
  const [practiceSetting, setPracticeSetting] = useState("Acute care: General medicine");

  const [clientSetting, setClientSetting] = useState("Inpatient");
  const [practiceArea, setPracticeArea] = useState("Mental Health");
  const [lifeSpan, clientLifeSpan] = useState("Neonatal")
  // const [demandtype, setDemandType] = useState("Physical")

  
  const [dataCollected, setDataCollected] = useState(false)
  // const [valueData1, setData] = useState([])
  // const [valueData2, setData2] = useState([])
  const [valueData3, setData3] = useState([])
  const [valueData1, setData] = useState([])
  const [valueData2, setData2] = useState([])


  const [err1, setErr1] = useState(false)
  const [err2, setErr2] = useState(false)
  const [err3, setErr3] = useState(false)

  // const [physicalChecked, setPhysicalChecked] = useState(false)
  // const [psychoChecked, setPsychoChecked] = useState(false)
  // const [coginitiveChecked, setCognitiveChecked] = useState(false)


  const [physicalChecked, setPhysicalChecked] = useState(false)
  const [cognitiveChecked, setCognitiveChecked] = useState(false)
  const [psychoSocialChecked, setPsychoSocialChecked] = useState(false)




  const abbreviation = {
    "Acute care: General medicine" : 'acgm',
    "Acute Care: Day hospital or clinic": "acdh",
    "Acute Care: Intensive care unit": "acicu",
    "Acute care: Rehabilitation unit": "acru",
    "Free-standing mental health facility": "fsmh",
    "Private industry or non-OT company": "pi",
    "Private practice OT service": "ppots",
    "Rehabilitation centre: complex continuing care or low tolerance long duration": "rcccc",
    "Rehabilitation centre: Day hospital or clinic": "rcdh",
    "Rehabilitation centre: short-stay or medium stay": "rcsm"
  }
  
  const patientType = {'Inpatient':'inpatient', 'Outpatient':'outpatient'}
  const settingType = {'Mental Health': 'mentalhealth', 'Neurological': 'neuro'}
  const ageType ={'Neonatal':'neo', "Child":'child', "Senior": "senior", "Adolescent": "adole", "Adult":'adult'}
  const demandType ={'Physical':'physical', "PsychoSocial":'psycho', "Cognitive": "cog"}

  async function handleCheckBox(e) {
    // console.log(e.target.value)
    if(e.target.value == 'Physical'){
      setPhysicalChecked(!physicalChecked)
      console.log(physicalChecked)

    }

    if(e.target.value == 'PsychoSocial'){
      setPsychoSocialChecked(!psychoSocialChecked)
      console.log(psychoSocialChecked)
    }
    if(e.target.value == 'Cognitive'){
      setCognitiveChecked(!cognitiveChecked)
      console.log(cognitiveChecked)

    }
  }


  function readData(lines, type) {
    const csvData = []

    for (let i = 0; i < lines.length - 1; i++) {
      if ((i == 12 && (type === 'cog' || type == 'physical')) || (i == 2 && type == 'psycho') )
      {
        lines[i] = lines[i].replace(',', '')
      }
      
      csvData[i] = lines[i].split(",");
      for(let j = 0; j < csvData[i].length; j++){

        csvData[i][j] = csvData[i][j].replaceAll('"', '')

        

      }


  }
  // console.log(csvData)
  // let outputData = []
  // let max;
  // let max_index = 0
  // for (let i = 1; i < csvData.length - 2; i++) {
  //     max = 0;
  //     max_index = 1


  //   for (let j = 1; j < csvData[i].length; j++ ){
  //       if (csvData[i][j] !== ' '){
          
  //         if (max <= parseInt(csvData[i][j]))
  //         { 
  //           // console.log(csvData[i][j])
  //           max = parseInt(csvData[i][j])
  //           max_index = j

  //         }
  //       }
  //   }

  console.log(csvData)
  const output_sum = []
  let sum_value;
  for (let i = 1; i < csvData.length - 1; i++) {
        sum_value = 0
    for (let j = 1; j < csvData[i].length; j++ ){
        if (csvData[i][j] !== ' ')
        {
          sum_value = sum_value +  parseInt(csvData[i][j])
                
        }
        

    }
    output_sum.push(sum_value)

  }

console.log(output_sum)
  for (let i = 1; i < csvData.length - 1; i++) {

    for (let j = 1; j < csvData[i].length; j++ ){
        if (csvData[i][j] !== ' ')
        {
          csvData[i][j] = parseFloat((parseInt(csvData[i][j]) / output_sum[i - 1] * 100).toFixed(2)) + "%"
                
        }

        else{
          csvData[i][j] = 0
        }
    }


    
    // if((csvData[0][max_index] !== 'No' && csvData[0][max_index] !== 'Not Required')){
      // outputData.push([csvData[i][0],csvData[0][max_index]])
    }
    // console.log(outputData)

// console.log(csvData)
  csvData.pop()
  console.log(csvData)
  return csvData


  }

  async function sendSubmission(event)  {

    event.preventDefault()      
    // console.log(practiceSetting)
    // console.log(clientSetting)
    // console.log(lifeSpan)
    // console.log(practiceArea)
    console.log(cognitiveChecked)
    const filenameConstruct = abbreviation[practiceSetting].concat(settingType[practiceArea], patientType[clientSetting], ageType[lifeSpan])
    try {
      console.log('cognitive checked:' + cognitiveChecked)

      if(cognitiveChecked) {
      
    const res = await fetch(`https://restorelabbackend.herokuapp.com/pdmdata/${filenameConstruct}cog.csv`,{
      method: "GET",
      headers: {
        'content-type': 'text/csv;charset=UTF-8',
        //'Authorization': //in case you need authorisation
    }
  });
  
  if (res.status === 200) 
  {

    const data = await res.text();
    const outputData = readData(data.split('\n'), 'cog')
    setData(outputData)

  }
  else if(res.status === 404){
    setErr1(true)
  }
      }
      console.log('physical checked:' + physicalChecked)
      if(physicalChecked){
  const res2 = await fetch(`https://restorelabbackend.herokuapp.com/pdmdata/${filenameConstruct}physical.csv`,{
    method: "GET",
    headers: {
      'content-type': 'text/csv;charset=UTF-8',
      //'Authorization': //in case you need authorisation
  }
});

if (res2.status === 200) 
{

  const data2 = await res2.text();
  const outputData2  = readData(data2.split('\n'), 'physical')
  setData2(outputData2)

}
else if(res2.status === 404){
  setErr2(true)
}
      }
      console.log('psychoSocialChecked  checked:' + psychoSocialChecked)

  if (psychoSocialChecked){      
const res3 = await fetch(`https://restorelabbackend.herokuapp.com/pdmdata/${filenameConstruct}psycho.csv`,{
  method: "GET",
  headers: {
    'content-type': 'text/csv;charset=UTF-8',
    //'Authorization': //in case you need authorisation
}
});

if (res3.status === 200) 
{

const data3 = await res3.text();
// const outputData3 = readData(data3.split('\n'), 'psycho')
const outputData3 = readData(data3.split('\n'), 'psycho')
setData3(outputData3)

setErr1(false)

}
else if(res3.status === 404){
  setErr3(true)
}
    }
    setDataCollected(!dataCollected)

console.log(dataCollected)
  }
    catch(error){
      console.log('ama')
      setErr1(true)
    }

  }

  if(err1 || err2 || err3){
    return(
      <div className='App'>
        <h1>No Data Available</h1>
      </div>
    )
  }
  let i = 0
  if(dataCollected){
    return(
    <div className="output1">
        <h1 className='mainheading'>Practicum Demands Measure: Occupational Therapy(OT)</h1>


      {cognitiveChecked && 
      <div>
              <h2 className='headings'>Cognitive Demands</h2>

      <table className="table">
      <thead>
    <tr>
      <th>Demands</th>
      <th>Frequency</th>

    </tr>
    </thead>
      <tbody>
    
      {
        valueData1.map((element) => (
          
          <tr>{
            element.map((subElement) => {
              return(
              // <td >{subElement}</td>
              <td>{subElement}</td>
            )})
          }
            </tr>
          // <tr>
          // <td>{element[0]}</td>
        
          // <td>{element[1]}</td>
          // </tr>
        ))
        }
      </tbody>
    </table>
    </div>
  }
  {physicalChecked &&
      <div>
              <h2 className='headings'>Physical Demands</h2>

    <table className="table">
      <thead>
    <tr>
      <th>Demands</th>
      <th>Frequency</th>

    </tr>
    </thead>
      <tbody>
      {
        valueData2.map((element) => (
          
          <tr>{
            element.map((subElement) => {
              return(
              // <td >{subElement}</td>
              <td>{subElement}</td>
            )})
          }
            </tr>
          // <tr>
          // <td>{element[0]}</td>
        
          // <td>{element[1]}</td>
          // </tr>
        ))
        }
      </tbody>
  
    </table>
    </div>

  }

{psychoSocialChecked &&
<div>
<h2 className='headings'>PsychoSocial Demands</h2>
    <table className="table">
      <thead>
    <tr>
      <th>Demands</th>
      <th>Frequency</th>

    </tr>
    </thead>
      <tbody>
      {
        valueData3.map((element) => (
          
          <tr>{
            element.map((subElement) => {
              return(
              // <td >{subElement}</td>
              <td>{subElement}</td>
            )})
          }
            </tr>
          // <tr>
          // <td>{element[0]}</td>
        
          // <td>{element[1]}</td>
          // </tr>
        ))
        }
      </tbody>
    </table>
    </div>
  }

  

  
    <table className="table2">
      <thead>
    <tr>
      <th>List of all frequency options</th>
    </tr>
    </thead>
      <tbody>

          <tr>
          <td>No</td>
          </tr>

          <tr>
          <td>Not Required</td>
          </tr>

          <tr>
          <td>Required half of a day</td>
          </tr>

          
          <tr>
          <td>Required less than half of a day</td>
          </tr>

          <tr>
          <td>Required more than half of a day</td>
          </tr>


          <tr>
          <td>Yes- Frequently</td>
          </tr>

          
          <tr>
          <td>Yes- Infrequently</td>
          </tr>

          
          <tr>
          <td>NA</td>
          </tr>
      

      </tbody>
    </table>
  
      </div>
    )
  }
  
  else {
  return (
    <div className="App1">
      <h1 className="mainheading" >Practicum Demands Measure: Occupational Therapy(OT)</h1>
      <form onSubmit={(e)=>{sendSubmission(e)}} >
        <div class="inputdiv">
      <label for='practicesetting'> Practice Setting</label>
    
  <select onChange={(e) => setPracticeSetting(e.target.value)} id="practicesetting" required>
    <option value="Acute care: General medicine" > Acute care: General medicine </ option> 
    <option value="Acute Care: Day hospital or clinic">Acute Care: Day hospital or clinic</ option>
    <option value="Free-standing mental health facility"> Free-standing mental health facility </option>
    <option value="Private industry or non-OT company"> Private industry or non-OT company </option>
    <option value="Private practice OT service"> Private practice OT service </option>
    <option value="Rehabilitation centre: complex continuing care or low tolerance long duration"> Rehabilitation centre: complex continuing care or low tolerance long duration </option>
    <option value="Rehabilitation centre: short-stay or medium stay"> Rehabilitation centre: short-stay or medium stay </option>
  </select>
</div>
<div class="inputdiv">
  <label for='clientsetting'> Client Setting</label>
  <select id="clientsetting" onChange={(e) => setClientSetting(e.target.value)}  required>
    <option value="Inpatient"> Inpatient  </option>
    <option value="Outpatient">Outpatient </option>

  </select>
  </div>
<div class="inputdiv">
  <label for='practicearea'> Areas of Practice </label>
  <select id="practicearea" onChange={(e) => setPracticeArea(e.target.value)} required>
    <option value="Mental Health"> Mental Health </option>
    <option value="Neurological"> Neurological </option>
  </select>
</div>

<div class="inputdiv">
  <label for='lifespan'> Client Lifespan </label>
  <select id="lifespan" onChange={(e) => clientLifeSpan(e.target.value)} required>
    <option value="Neonatal" >Neonatal </option>
    <option value="Child"> Child </option>
    <option value="Adult"> Adult </option>
    <option value="Adolescent"> Adolescent </option>
    <option value="Senior"> Senior </option>

  </select>
</div>

<div class="inputdiv">
  <label >Select Demand Type </label>
  <div>
  <label className='check' for='physical'> Physical </label>

  <input    
              id = 'physical'
              type="checkbox"
              value="Physical"
              onChange={(e)=>handleCheckBox(e)}
              // checked={form.checked}
            />
  </div>
  <div>
  <label className='check' for='PsychoSocial'> PsychoSocial </label>

  <input
              id = 'PsychoSocial'
              type="checkbox"
              value="PsychoSocial"
              onChange={handleCheckBox}
              // checked={form.checked}
            />

  </div>
  <div>
  <label className='check' for='Cognitive'> Cognitive </label>

  <input
              id = 'Cognitive'
              type="checkbox"
              value="Cognitive"
              onChange={handleCheckBox}
              // checked={form.checked}
            />

  </div>
</div>
<input type="submit" class="submit" />
      </form>
      <div className='copyright'>
      <h5>© Barker D, Stier J, Nowrouzi-Kia B. Department of Occupational Science & Occupational Therapy,
Univesity of Toronto, 2020</h5>
</div>
    </div>
    
  );
}
}
export default ProjectForm;
