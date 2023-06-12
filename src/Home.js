
import './Home.css';
import LoadingSpinner from "./LoadingSpinner";
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';
import MessagePopup from './MessagePopup';

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
    const [message, setMessage] = useState("TESTING MFER")
    const [showMessage, setShowMessage] = useState(false)

    const navigate = useNavigate();

    //The recommend function of the app. Sends request to API to recommend songs.
    const handleGeneratePlaylist = () => {
        if (userName == "" || userName == null) {
            setMessage("Please login before generating")
            setShowMessage(true)
            return
        }
        if (prompt.length == 0){
            setMessage("Please enter a prompt")
            setShowMessage(true)
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
            setMessage("Couldn't generate tracklist, please try again later!")
            setShowMessage(true)
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
            setLoading(false)
            setMessage("Failed to login, please try again later!")
            setShowMessage(true)
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

    const showAbout = () => {
        setMessage("About page is in development. Check back later!")
        setShowMessage(true)
    }

    const handleButton = () => {
        console.log(showMessage)
        setMessage("Hola")
        setShowMessage(true)
        console.log(showMessage)
        console.log(message)
        // const timer = setTimeout(() => {
        //     setShowMessage(false);
        //     console.log(showMessage)
        // }, 3000);
        // return () => {
        //     clearTimeout(timer);
        // };
    }

    //Two functions:
    // 1) If we are being redirected from the server, we get the username from query params and login
    // 2) If we are already logged in and just refreshing the page, get the user from sessionStore
    useEffect(() => {
        if (searchParam.get('username')) {
            console.log("getting search param")
            let username = searchParam.get('username')
            setUsername(username)
            window.sessionStorage.setItem("loggedIn", "true")
            window.sessionStorage.setItem("sessionUser", username)
            setLoading(false)
            setMessage("Logged In!")
            setShowMessage(true)
            navigate('/')
        } else if (window.sessionStorage.getItem("loggedIn") == "true" && !loggingIn) {
            console.log("getting session storage")
            let username = window.sessionStorage.getItem("sessionUser")
            setMessage("Logged In!")
            setShowMessage(true)
            setUsername(username)
        } else if (searchParam.get('error')) {
            setLoading(false)
            setMessage("Could not log you in. Please try again later.")
            setShowMessage(true)
            navigate('/')
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

    useEffect(() => {
        let timeoutId
        if(showMessage){
            timeoutId = setTimeout(() => {
                setShowMessage(false);
            }, 3000); // Adjust the delay as needed
        }
        return () => clearTimeout(timeoutId);
    }, [showMessage])





    return (
        <div className="App">
            <nav className="nav-bar">
                <button className="nav-item left rounded-button" onClick={showAbout}>about</button>
                <div className="nav-item center">Mood2Music</div>
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
                {/* <button onClick={handleButton} /> */}
            </div>
            <div className="input-container">
                <input type="text" placeholder="Enter your mood here" className="rounded-input" onChange={e => setPrompt(e.target.value)} />
                <button className="submit-button rounded-button" onClick={handleGeneratePlaylist} >generate playlist</button>
            </div>
            {loading && (<div className={`loading-overlay ${showOverlay ? 'show' : 'hide'}`}>
                <LoadingSpinner />
            </div>)}
            <MessagePopup message={message} show={showMessage} />
        </div>
    );

}

export default Home;
