import React, { useState } from 'react';
function ProjectForm() {
  
  const [practiceSetting, setPracticeSetting] = useState("Acute care: General medicine");
  const [clientSetting, setClientSetting] = useState("Inpatient");
  const [practiceArea, setPracticeArea] = useState("Mental Health");
  const [lifeSpan, clientLifeSpan] = useState("Neonatal")
  
  const [dataCollected, setDataCollected] = useState(false)
  const [valueData3, setData3] = useState([])
  const [valueData1, setData] = useState([])
  const [valueData2, setData2] = useState([])

  const [err1, setErr1] = useState(false)
  const [err2, setErr2] = useState(false)
  const [err3, setErr3] = useState(false)

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
  const settingType = {
    'Mental Health': 'mentalhealth', 
    'Neurological': 'neuro',    
    "Developmental": "dev", 
    "Oncological": "onc",
    "Other physical health": "physhealth", 
    "Other diagnoses, concerns or no diagnosis": "diagnosis", 
    "Organization-based Administrative": "admin",
    "Musculoskeletal or Orthopaedic": "muscortho"
  }

  const ageType = {
    'Neonatal':'neo', 
    "Child":'child', 
    "Senior": "senior", 
    "Adolescent": "adole", 
    "Adult":'adult', 
  }
  
  async function handleCheckBox(e) {
    if(e.target.value === 'Physical'){
      setPhysicalChecked(!physicalChecked)
    }
    if (e.target.value === 'PsychoSocial'){
      setPsychoSocialChecked(!psychoSocialChecked)
    }
    if (e.target.value === 'Cognitive'){
      setCognitiveChecked(!cognitiveChecked)
    }
  }

  function readData(lines, type) {
    const csvData = []
    for (let i = 0; i < lines.length - 1; i++) {
      if ((i === 12 && (type === 'cog' || type === 'physical')) || (i === 2 && type === 'psycho')) {
        lines[i] = lines[i].replace(',', '')
      }      
      csvData[i] = lines[i].split(",")
      for (let j = 0; j < csvData[i].length; j++) {
        csvData[i][j] = csvData[i][j].replaceAll('"', '')
      }
  }

  const output_sum = []
  let sum_value
  for (let i = 1; i < csvData.length - 1; i++) {
        sum_value = 0
    for (let j = 1; j < csvData[i].length; j++ ){
        if (csvData[i][j] !== ' ') {
          sum_value = sum_value +  parseInt(csvData[i][j])         
        }
      }
    output_sum.push(sum_value)
  }

  for (let i = 1; i < csvData.length - 1; i++) {
    for (let j = 1; j < csvData[i].length; j++ ){
        if (csvData[i][j] !== ' ') {
          csvData[i][j] = parseFloat((parseInt(csvData[i][j]) / output_sum[i - 1] * 100).toFixed(2)) + "%"    
        } else {
          csvData[i][j] = 0
        }
    }
  }
  csvData.pop()
  return csvData
  }

  async function sendSubmission(event)  {

    event.preventDefault()      
    const filenameConstruct = abbreviation[practiceSetting].concat(settingType[practiceArea], patientType[clientSetting], ageType[lifeSpan])

    try {
        if (cognitiveChecked) {
          const res = await fetch(`https://restorelabbackend.herokuapp.com/pdmdata/${filenameConstruct}cog.csv`,{
            method: "GET",
            headers: {
              'content-type': 'text/csv;charset=UTF-8'
            }
        });
  
    if (res.status === 200) {
        const data = await res.text();
        const outputData = readData(data.split('\n'), 'cog')
        setData(outputData)
      } else if(res.status === 404){
        setErr1(true)
      }}

    if (physicalChecked) {
        const res2 = await fetch(`https://restorelabbackend.herokuapp.com/pdmdata/${filenameConstruct}physical.csv`,{
          method: "GET",
          headers: {
            'content-type': 'text/csv;charset=UTF-8',
        }
    });

    if (res2.status === 200) {
      const data2 = await res2.text();
      const outputData2  = readData(data2.split('\n'), 'physical')
      setData2(outputData2)
    } else if (res2.status === 404) {
      setErr2(true)
    }}

    if (psychoSocialChecked){      
      const res3 = await fetch(`https://restorelabbackend.herokuapp.com/pdmdata/${filenameConstruct}psycho.csv`,{
        method: "GET",
        headers: {
          'content-type': 'text/csv;charset=UTF-8',
        }
    })

    if (res3.status === 200) {
      const data3 = await res3.text();
      // const outputData3 = readData(data3.split('\n'), 'psycho')
      const outputData3 = readData(data3.split('\n'), 'psycho')
      setData3(outputData3)
      setErr1(false)
    } else if (res3.status === 404){
      setErr3(true)
    }}
    setDataCollected(!dataCollected)
  } catch(error) {
      setErr1(true)
    }
  }

  if (err1 || err2 || err3) {
    return (
      <div class='App'>
        <h1>No Data Available</h1>
      </div>
    )}

  if (dataCollected) {
    return (
      <div>
        {/* <h1 class="text-4xl text-blue-700">Practicum Demands Measure: Occupational Therapy(OT)</h1> */}
      {cognitiveChecked &&
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 px-10">
          <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            Cognitive Demands
            <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Insert some beautiful text here!</p>
          </caption>
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">Demands</th>
                <th scope="col" class="px-6 py-3">Frequency</th>
                <th scope="col" class="px-6 py-3">Frequency</th>
                <th scope="col" class="px-6 py-3">Frequency</th>
                <th scope="col" class="px-6 py-3">Frequency</th>
                <th scope="col" class="px-6 py-3">Frequency</th>
              </tr>
          </thead>
          <tbody>
            {
              valueData1.map((element) => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"> 
                {
                  element.map((subElement) => {
                  return (
                    <td class="px-6 py-4">{subElement}</td>
                    )})
                }
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      }

{
  physicalChecked &&
  <div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 px-10">
    <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
      Physical Demands
      <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Insert some beautiful text here!</p>
    </caption>
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th scope="col" class="px-6 py-3">Demands</th>
      <th scope="col" class="px-6 py-3">Frequency</th>
    </tr>
    </thead>
    <tbody>
    {
      valueData2.map((element) => (
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          {
            element.map((subElement) => {
              return (
              <td class="px-6 py-4">{subElement}</td>
            )})
          }
          </tr>
      ))}
    </tbody>
    </table>
  </div>
}

{
  psychoSocialChecked &&
  <div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 px-10">
    <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
      Psycho-Social Demands<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Insert some beautiful text here!</p>
    </caption>
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th scope="col" class="px-6 py-3">Demands</th>
      <th scope="col" class="px-6 py-3">Frequency</th>
    </tr>
    </thead>
      <tbody>
      {
        valueData3.map((element) => (
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            {
              element.map((subElement) => {
                return (
                <td class="px-6 py-4">{subElement}</td>
              )})
            }
          </tr>
        ))
      }
      </tbody>
    </table>
  </div>
}
<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 px-10">  
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th scope="col" class="px-6 py-3">List of all frequency options</th>
    </tr>
    </thead>
    <tbody>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><td class="px-6 py-4">No</td></tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><td class="px-6 py-4">Not Required</td></tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><td class="px-6 py-4">Required half of a day</td></tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><td class="px-6 py-4">Required less than half of a day</td></tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><td class="px-6 py-4">Required more than half of a day</td></tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><td class="px-6 py-4">Yes- Frequently</td></tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><td class="px-6 py-4">Yes- Infrequently</td></tr>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"><td class="px-6 py-4">NA</td></tr>
    </tbody>
    </table>
  </div>
</div>
  )} else {
      return (
        <div class="h-full bg-white flex flex-col justify-center">
          <h1 class="text-4xl text-blue-700">Practicum Demands Measure: Occupational Therapy(OT)</h1>
          <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={(e)=>{sendSubmission(e)}} >
              <div class="mb-4">
                  <label for="practicesetting" class='block text-grey-darker text-sm font-bold mb-2'>Practice Setting</label>
                  <select class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" onChange={(e) => setPracticeSetting(e.target.value)} id="practicesetting" required>
                    <option value="Acute care: General medicine" > Acute care: General medicine </ option> 
                    <option value="Acute Care: Day hospital or clinic">Acute Care: Day hospital or clinic</ option>
                    <option value="Free-standing mental health facility"> Free-standing mental health facility </option>
                    <option value="Private industry or non-OT company"> Private industry or non-OT company </option>
                    <option value="Private practice OT service"> Private practice OT service </option>
                    <option value="Rehabilitation centre: complex continuing care or low tolerance long duration"> Rehabilitation centre: complex continuing care or low tolerance long duration </option>
                    <option value="Rehabilitation centre: short-stay or medium stay"> Rehabilitation centre: short-stay or medium stay </option>
                  </select>
              </div>
          <div class="mb-4">
            <label class="block text-grey-darker text-sm font-bold mb-2" for='clientsetting'>Client Setting</label>
            <select class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="clientsetting" onChange={(e) => setClientSetting(e.target.value)}  required>
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatient">Outpatient</option>
            </select>
            </div>
        <div class="mb-4">
          <label class="block text-grey-darker text-sm font-bold mb-2" for='practicearea'>Areas of Practice</label>
          <select class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="practicearea" onChange={(e) => setPracticeArea(e.target.value)} required>
            <option value="Mental Health">Mental Health</option>
            <option value="Neurological">Neurological</option>
            <option value="Developmental">Developmental</option>
            <option value="Oncological">Oncological</option>
            <option value="Other physical health">Other physical health</option>
            <option value="Other diagnoses, concerns or no diagnosis">Other diagnoses, concerns or no diagnosis</option>
            <option value="Organization-based Administrative">Organization-based Administrative</option>
            <option value="Musculoskeletal or Orthopaedic">Musculoskeletal or Orthopaedic</option>
          </select>
        </div>
      <div class="mb-4">
        <label class="block text-grey-darker text-sm font-bold mb-2" for='lifespan'>Client Lifespan</label>
        <select class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="lifespan" onChange={(e) => clientLifeSpan(e.target.value)} required>
          <option value="Neonatal">Neonatal</option>
          <option value="Child">Child</option>
          <option value="Adolescent">Adolescent</option>
          <option value="Adult">Adult</option>
          <option value="Senior">Older Adult</option>
        </select>
      </div>
  <div class="mb-4">
    <label class="block text-grey-darker text-sm font-bold mb-2">Select Demand Type</label>
    <div class="flex flex-row">
    <label class="block text-grey-darker text-sm font-bold mb-2" for='physical'>Physical</label>
    <input
      id='physical'
      type="checkbox"
      value="Physical"
      onChange={(e)=>handleCheckBox(e)}
    />
    </div>
  <div class="flex flex-row">
  <label class="block text-grey-darker text-sm font-bold mb-2" for='PsychoSocial'>PsychoSocial</label>
  <input
    id = 'PsychoSocial'
    type="checkbox"
    value="PsychoSocial"
    onChange={handleCheckBox}
  />
  </div>
  <div class="flex flex-row">
    <label class="block text-grey-darker text-sm font-bold mb-2" for='Cognitive'>Cognitive</label>
    <input
      id = 'Cognitive'
      type="checkbox"
      value="Cognitive"
      onChange={handleCheckBox}
    />
  </div>
</div>
<input type="submit" class="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-grab" />
</form>
<div class='copyright'>
<h5>© Barker D, Stier J, Nowrouzi-Kia B. Department of Occupational Science & Occupational Therapy, University of Toronto, 2020</h5>
</div>
</div>
)}}

export default ProjectForm;
