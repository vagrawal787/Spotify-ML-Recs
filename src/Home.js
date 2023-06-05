
import './Home.css';
import LoadingSpinner from "./LoadingSpinner";
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';

axios.defaults.withCredentials = true


const HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Content-Type": "application/json",
    "Accept": "application/json",
    credentials: "include"
}
function Home() {
    // const [userLoading, setUserLoading] = useState(true)
    const [userName, setUsername] = useState('')
    const [loginLink, setLoginLink] = useState('')
    const [searchParam, _] = useSearchParams('')
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const [loggingIn, setLogging] = useState(false)
    const [showOverlay, setShowOverlay] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    //The recommend function of the app. Sends request to API to recommend songs.
    const handleGeneratePlaylist = () => {
        if (prompt.length == 0){
            return
        }
        setLoading(true)
        console.log(prompt)
        let data = JSON.stringify({ "prompt": prompt, "userId": userName })
        axios.post(process.env.REACT_APP_API_RECOMMEND, data, HEADERS).then(res => {
            console.log(res)
            console.log(typeof res["data"])
            navigate("/playlist", { state: { tracks: res["data"] } });
        }).catch(e => {
            setLoading(false)
        })
    };

    //Handles the login button action
    const handleLogin = () => {
        console.log("logging in")
        setLogging(true)
        setLoading(true)
        axios.get(process.env.REACT_APP_API_LOGIN, HEADERS).then(res => {
            console.log("LOGIN", res)
            window.location.href = res["data"]
        }).catch(e => {
            console.log(e)
        })
    }

    //Handles the logout button action
    const handleLogout = () => {
        // axios.get(process.env.REACT_APP_API_LOGOUT, HEADERS).then(res => {
        //     console.log(res)
        //     setUsername("")
        // }).catch(e => {
        //     console.log("couldn't logout")
        // })
        setIsOpen(false)
        window.sessionStorage.removeItem("sessionUser")
        setUsername("")
    }

    //Two functions:
    // 1) If we are being redirected from the server, we get the username from query params and login
    // 2) If we are already logged in and just refreshing the page, get the user from sessionStore
    useEffect(() => {
        if (searchParam.get('username')) {
            let username = searchParam.get('username')
            setUsername(username)
            window.sessionStorage.setItem("loggedIn", "true")
            window.sessionStorage.setItem("sessionUser", username)
            setLoading(false)
            navigate('/')
        } else if (window.sessionStorage.getItem("loggedIn") == "true" && !loggingIn) {
            let username = window.sessionStorage.getItem("sessionUser")
            setUsername(username)
        }

    }, [])


    //Effect for the loading icon. Kind of broken, doesn't fade out but it does fade in
    useEffect(() => {
        let timeoutId
        if (loading) {
            setShowOverlay(true)
        } else {
            timeoutId = setTimeout(() => {
                setShowOverlay(false);
            }, 300); // Adjust the delay as needed

        }
        return () => clearTimeout(timeoutId);
    }, [loading])





    return (
        <div className="App">
            <nav className="nav-bar">
                <button className="nav-item left rounded-button">about</button>
                <div className="nav-item center">Spotify Mood</div>
                {userName && <button onClick={() => setIsOpen(!isOpen)} className="nav-item right rounded-button">{userName}</button>}
                {(userName == '' || userName == null) && <button className="nav-item right rounded-button" onClick={handleLogin}>login</button>}
            </nav>
            {isOpen && (
                    <div className="dropdown">
                        <button className="drop-button" onClick={handleLogout}>log-out</button>
                    </div>
                )}
            <div>
                <h1 className="title-text"> An AI-created playlist based on your mood  </h1>
            </div>
            <div className="input-container">
                <input type="text" placeholder="Enter your mood here" className="rounded-input" onChange={e => setPrompt(e.target.value)} />
                <button className="submit-button rounded-button" onClick={handleGeneratePlaylist} disabled={userName == null || userName == ""}>generate playlist</button>
            </div>
            {loading && (<div className={`loading-overlay ${showOverlay ? 'show' : 'hide'}`}>
                <LoadingSpinner />
            </div>)}
        </div>
    );

}

export default Home;
