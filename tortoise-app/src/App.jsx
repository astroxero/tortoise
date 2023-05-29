import './App.css';
import { Link, Route, Routes } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Login from "./components/login";
import MainPage from "./components/mainpage";
import Account from "./components/account";
import { useState, useEffect } from "react";

const supabase = createClient("https://vnyvvhxfyerdjkzmrayi.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueXZ2aHhmeWVyZGprem1yYXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1NzMxMTMsImV4cCI6MTk5NzE0OTExM30.Qq3JOHl2WBdmcT1jzLjrVroc2pDrcLjcMfJB3tv6wY8");

function App() {
  const session = supabase.auth.getSession();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loginText,  setLoginText] = useState('Login');
  const [loginRoute, setLoginRoute] = useState('/login');

  useEffect(() => {
    if (session && session.user && session.user.email) {
      setUserEmail(session.user.email);
      setLoggedIn(true);
      setLoginText(userEmail);
      setLoginRoute('/account');
    } else {
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session && session.user && session.user.email) {
          setUserEmail(session.user.email);
          setLoginText(session.user.email); // Update login text to user's email
          setLoginRoute('/account');
        }
        if (event === 'SIGNED_OUT') {
          setUserEmail('');
          setLoginText('Login'); // Reset login text to 'Login' when signed out
          setLoginRoute('/login');
        }
      });
    }
  }, [session, userEmail]);

  return (
    <>
      <nav>
        <div className="logo">
          <img src="./src/assets/tortoise.png" alt="Logo" onClick={() => window.location = "/"} />
        </div>
        <ul>
          <li><Link id='loginlink' to={loginRoute}>{loginText}</Link></li>
          <li><Link to="/">Home</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </>
  );
}

export default App;
