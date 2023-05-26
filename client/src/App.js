import React from 'react'
import Form from './components/Form'
import Edit from './components/Edit'
import Home from './components/Home'
import LandingPage from './components/LandingPage'
import ProjectForm from './components/ProjectForm';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import TitleBar from './components/Titlebar';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/add"} element={<Form/>}/>
          <Route path={"/delete"} element={<Edit/>}/>
          <Route path={"/home"} element={<Home/>}/>
          <Route path={"/"} element={<LandingPage/>}/>
          <Route path={"/pdminterface"} element={[<TitleBar/>, <ProjectForm/>]} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
