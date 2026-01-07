import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/App.css'
import AnalyzeVod from './screens/AnalyzeVod';
import ViewHighlights from './screens/ViewHighlights'

import ReactGA from "react-ga4";

ReactGA.initialize("G-TPZ1390SH1");

function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // Send pageview on route change
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
}

function App() {

  return(
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<Navigate to="/analyze" replace />} /> 
        <Route path="/analyze" element={<AnalyzeVod />} />
        <Route path="/v/:vodId" element= {<ViewHighlights />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
