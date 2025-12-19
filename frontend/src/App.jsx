import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css'
import AnalyzeVod from './screens/AnalyzeVod';

function App() {

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/analyze" replace />} />
        <Route path="/analyze" element={<AnalyzeVod />} />        
      </Routes>
    </BrowserRouter>
  )
}

export default App
