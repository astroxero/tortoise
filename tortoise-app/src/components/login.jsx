import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://vnyvvhxfyerdjkzmrayi.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueXZ2aHhmeWVyZGprem1yYXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1NzMxMTMsImV4cCI6MTk5NzE0OTExM30.Qq3JOHl2WBdmcT1jzLjrVroc2pDrcLjcMfJB3tv6wY8");

function Login() {
  const [em, setEM] = useState('');
  const [pw, setPW] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);


  async function signIn(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: em,
      password: pw,
    });
      
    if (error) {
      alert(error.message);
    } else {
      setLoggedIn(true);
      window.location.href = '/';
    }
  }
    

  async function signUp(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: em,
      password: pw,
    });
    
    if (error) {
      alert(error.message);
    } else {
      alert("Signed up successfully! Please check your email for verification.");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setLoggedIn(false);
  }

  return (
    <>
      <div className="container">
        <h1>Sign In</h1>
        <form>
            <input placeholder="Email" type="email" value={em} onChange={(e) => setEM(e.target.value)} />
            <input placeholder="Password" type="password" value={pw} onChange={(e) => setPW(e.target.value)} />
          <br></br>
          <button onClick={signUp}>Sign Up</button>
          <button type="button" onClick={signIn}>Sign In</button>
        </form>
      </div>
    </>
  );
}

export default Login;
