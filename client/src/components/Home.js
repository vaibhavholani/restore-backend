import React from 'react';
import {Link} from 'react-router-dom';
import './Home.css'

export default function Home() {

  const optionsList = [ {text: "Add Team Member/Projects/Published Research", to: "/add"}, 
                        {text: "Edit/Remove Team Member/Projects/Published Research", to: "/delete"},]
  return (
    <>
    <div className="headerContainer">
        <h1 className="heading">Restore Lab Data Updates</h1>
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
