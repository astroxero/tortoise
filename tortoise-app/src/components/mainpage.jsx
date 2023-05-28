import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://vnyvvhxfyerdjkzmrayi.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueXZ2aHhmeWVyZGprem1yYXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1NzMxMTMsImV4cCI6MTk5NzE0OTExM30.Qq3JOHl2WBdmcT1jzLjrVroc2pDrcLjcMfJB3tv6wY8");


function MainPage() {
    const session = supabase.auth.getSession();
    const [userEmail, setUserEmail] = useState('')
    const [tasks,  setTasks] = useState([])

    useEffect(() => {
      getTasks();
    }, []);

    //make gettasks happen when useremail changes
    useEffect(() => {
        getTasks();
    }, [userEmail]);

    //get tasks from supabase
    async function getTasks() {
        const { data } = await supabase.from("tasks").select();
        const filteredData = data.filter((task) => task.user_email === userEmail);
        setTasks(filteredData);
    }


    //check if user is logged in
    if (session && session.user) {
        setUserEmail(session.user.email);
        setLoggedIn(true);
    } else {
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session && session.user) {
            setUserEmail(session.user.email);
        }
        if (event === 'SIGNED_OUT') {
            setUserEmail('');
        }
      });
    }

    
    //sign out
    function signOut() {
        supabase.auth.signOut();
        window.location.href = "/login";
    }
    //if user is not logged in, tell them to sign in
    if (!userEmail) {
        return <h1 className="container">Please sign in</h1>;
    } else {
        //if user is logged in, show them their tasks
        return (
            <>
                <div className="container">
                    <h1>Hey {userEmail}, here are your tasks!</h1>
                    
                    <ul>
                        {tasks.map((task) => (
                            <div key={task.name}>
                                <li>{task.name}</li>
                                <br />
                            </div>
                        ))}
                    </ul>


                    <button onClick={signOut}>Sign Out</button>
                </div>
               
            </>
        )
    }
}

export default MainPage;