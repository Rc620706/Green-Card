import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LoginIndex from './views/Login/LoginIndex';
import { BrowserRouter, Routes ,Route }from "react-router-dom";
import SearchBar from './views/searchBar/searchBar';
import AntipsychoticsGuide from './views/antipsychoticsGuide/antipsychoticsGuide';
import NeuropsychiatricSymptoms from './views/neuropsychiatricSymptoms/neuropsychiatricSymptoms';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>} />
      <Route path="/login" element={<LoginIndex/>}/>
      <Route path = "/searchBar" element={<SearchBar/>}/>
      <Route path = "/antipsychoticsGuide" element={<AntipsychoticsGuide/>}/>
      <Route path = "/neuropsychiatricSymptoms" element={<NeuropsychiatricSymptoms/>}/>
    </Routes>
  </BrowserRouter>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();