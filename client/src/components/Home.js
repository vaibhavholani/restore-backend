import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './Home.css'
import { get_current_traffic } from '../api_calls/get_current_traffic';

export default function Home() {

  const optionsList = [ {text: "Add Team Member/Projects/Banner", to: "/add"}, 
                        {text: "Edit/Remove Team Member/Projects/Banners", to: "/delete"},
                      ]
  const [traffic, setTraffic] = useState("Loading!")
  useEffect(()=> {
    get_current_traffic(setTraffic)
  })

  return (
    <>
    <div className="headerContainer">
        <h1 className="heading">Restore Lab Data Updates</h1>
        <h4> Daily Lab Website Visits: {traffic}</h4>
        <h3>Please select one of the following options:</h3>
        {optionsList.map(option => {
            return (
                <Link to={option.to}>{option.text}</Link>
            )
        })}
    </div>
    </>
  )
}
