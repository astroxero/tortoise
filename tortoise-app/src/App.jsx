import './App.css';
import { Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Login from "./components/login";
import LoggedinPage from "./components/loggedinpage";

const supabase = createClient("https://vnyvvhxfyerdjkzmrayi.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueXZ2aHhmeWVyZGprem1yYXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1NzMxMTMsImV4cCI6MTk5NzE0OTExM30.Qq3JOHl2WBdmcT1jzLjrVroc2pDrcLjcMfJB3tv6wY8");

function App() {
  const session = supabase.auth.getSession();

  return (
    <>
      <nav>
        <div className="logo">
          <img src="./src/assets/tortoise.png" alt="Logo" />
        </div>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/">Home</Link></li>
        </ul>
        
      </nav>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<LoggedinPage/>} />
      </Routes>
    </>
  );
}

export default App;