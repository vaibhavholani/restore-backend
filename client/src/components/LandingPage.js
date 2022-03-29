import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';

export default function LandingPage() {

  const [pass, setPass] = useState("");
  const [error, setError] = useState(false)
  const navigate = useNavigate();
  const secure_key = "restore";

  const authenticate = () => {
      if (pass === secure_key) {
        navigate("/home");
      }
      else {
          setError(true);
          setTimeout(()=>{setError(false)}, 1000);
      }
  }
  return (
   <div className="headerContainer">
        <h1 className="heading">Restore Lab Data Updates</h1>
        <h3>Sign In</h3>
        <input value={pass} onChange={e=> {setPass(e.target.value)}} />
        <button onClick={()=>{authenticate()}}>Log In</button>
        {error? <p style={{color: "red"}}>Incorrect Password</p> : null}
    </div>
  )
}
