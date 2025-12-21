import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css'
import AnalyzeVod from './screens/AnalyzeVod';
import ViewHighlights from './screens/ViewHighlights'

function App() {

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/analyze" replace />} /> 
        <Route path="/analyze" element={<AnalyzeVod />} />
        <Route path="/v/:vodId" element= {ViewHighlights}></Route>   
      </Routes>
    </BrowserRouter>
  )
}

export default App
