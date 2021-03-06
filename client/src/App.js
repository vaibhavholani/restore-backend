import React, {useState, useEffect} from 'react'
import logo from './logo.svg';
import Form from './components/Form'
import Edit from './components/Edit'
import Home from './components/Home'
import LandingPage from './components/LandingPage'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import {API_HOST} from './api.js'

function App() {

  return (

    <>
    <BrowserRouter>
      <Routes>
        <Route path={"/add"} element={<Form/>}/>
        <Route path={"/delete"} element={<Edit/>}/>
        <Route path={"/home"} element={<Home/>}/>
        <Route path={"/"} element={<LandingPage/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
