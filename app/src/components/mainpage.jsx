import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Component } from "react";
const supabase = createClient("https://vnyvvhxfyerdjkzmrayi.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZueXZ2aHhmeWVyZGprem1yYXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE1NzMxMTMsImV4cCI6MTk5NzE0OTExM30.Qq3JOHl2WBdmcT1jzLjrVroc2pDrcLjcMfJB3tv6wY8");


function MainPage() {
    const session = supabase.auth.getSession();
    const [userEmail, setUserEmail] = useState('');
    const [tasks,  setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      getTasks();
      checkUser();
      console.log(userEmail);
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


    function checkUser() {
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
    }

    async function addTask(e) {
        if (!taskName) {
            alert("Please enter a task name");
        } else {
            e.preventDefault();
            await supabase.from("tasks").insert([
            {
                name: taskName,
                user_email: userEmail,
            },
            ]);
            setTaskName('');
            getTasks();
        }
        
    }


    async function expandTask(taskName) {
        const expandButton = event.target;
        expandButton.classList.add("ebClicked");
        expandButton.disabled = true;
        await new Promise(r => setTimeout(r, 1000));
        try {
          const response = await fetch(`http://localhost:1212/${taskName}`);
          if (response.ok) {
            //each bullet point in the response and remove bullet points
            const data = await response.text();
            const splitData = data.split("\n");

            // make each bullet point a new task
            await supabase.from("tasks").insert([
              {
                name: splitData[2],
                user_email: userEmail,
              },
              {
                name: splitData[3],
                user_email: userEmail,
              },
              {
                name: splitData[4],
                user_email: userEmail,
              }
            ]);
            
            // Assuming 'getTasks' is defined somewhere in the code
            getTasks();
          } else {
            throw new Error('Failed to fetch task');
          }
        } catch (error) {
          console.error('Error occurred:', error);
        }
        expandButton.classList.remove("ebClicked");
        expandButton.disabled = false;
    }
      

    async function deleteTask(taskName) {
        await supabase.from("tasks").delete().match({ name: taskName });
        getTasks();
    }

    //if user is not logged in, tell them to sign in
    if (!userEmail) {
        return (
            <div className="container">
                <h1>What if your tasks could manage themselves?</h1>
                <button onClick={() => window.location.href = '/login'}>Sign In</button>
            </div>
        );
    } else {
        //if user is logged in, show them their tasks
        return (
            <>
                <div className="container">
                    <br></br>
                    <h1>Hey {userEmail}, here are your tasks!</h1>
                    
                    <form onSubmit={addTask}>
                        <input placeholder="Task Name" type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                        <button type="submit">Add Task</button>
                    </form>

                    {tasks.map((task) => (
                        <div key={task.name}>
                            <li>{task.name}</li>
                            <button className="completeButton" onClick={() => deleteTask(task.name)}>Complete</button>
                            <button name="expandBttn" className="expandButton" onClick={() => expandTask(task.name)}>Expand</button>
                            <br />
                        </div>
                    ))}
                    <br />
                    <br />
                    
                </div>
               
            </>
        )
    }
}

export default MainPage;