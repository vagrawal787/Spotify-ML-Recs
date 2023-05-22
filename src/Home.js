
import './Home.css';
import LoadingSpinner from "./LoadingSpinner";
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';

axios.defaults.withCredentials = true

const { API_ENDPOINT } = process.env;

const HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Content-Type": "application/json",
    "Accept": "application/json",
    credentials: "include"
}
function Home() {
    const [userLoading, setUserLoading] = useState(true)
    const [userName, setUsername] = useState('')
    const [loginLink, setLoginLink] = useState('')
    const [searchParam, setSearchParam] = useSearchParams('')
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const handleGeneratePlaylist = () => {
        setLoading(true)
        console.log(prompt)
        let data = {"prompt": prompt}
        axios.post(process.env.REACT_APP_API_URL + 'recplaylist', data, HEADERS).then(res => {
            console.log(res)
            navigate("/playlist", {state: {tracks: res.data}});
        }).catch(e => {
            setLoading(false)
        })
    };
    function isValidHttpUrl(string) {
        let url;
        
        try {
          url = new URL(string);
        } catch (_) {
          return false;  
        }
      
        return url.protocol === "http:" || url.protocol === "https:";
      }
    const getUser = () => {
        // const config = {
        //     headers:{
        //       header1: value1,
        //       header2: value2
        //     }
        //   };

        axios.get(process.env.REACT_APP_API_URL).then(res => {
            // console.log(res)
            if(typeof res.data == "string"){
                // console.log(res)
                if (isValidHttpUrl(res.data)){
                    setLoginLink(res.data)
                } else {
                    setUsername(res.data)
                }
                setUserLoading(false)
            }
            // console.log('hi')
        }).catch(e => {
            console.log(e)
            console.log("Get error")
        })
    }
    const authenticateServer = () => {
        // console.log("HERHERHER")
        // console.log("PARAM", searchParam.get('code'))
        let data = {"code": searchParam.get('code')}
        console.log(searchParam.get("code"))
        axios.post(process.env.REACT_APP_API_URL, data, HEADERS).then(res => {
            // console.log(res)
            let username = res["data"]
            console.log(username)
            setUsername(username)
            // console.log('userName' + userName)
            searchParam.delete('code')
            navigate('/')
        }).catch(e => {
            console.log(e)
            console.log("post error")
            navigate('/')
        })
    }
    const handleLogout = () => {
        axios.get(process.env.REACT_APP_API_URL + 'sign_out', HEADERS).then(res => {
            console.log(res)
            setUsername("")
        }).catch(e => {
            console.log("couldn't logout")
        })
    }
    const handleLogin = () => {
        getUser()
    }
    useEffect(() => {
        // console.log('fired')
        // console.log(userName)
        console.log(loading)
        if (loginLink == ''){
            console.log("yo")
            getUser()
        }
        if (searchParam.get('code')){
            authenticateServer()
            // console.log(userName + "BLAH")
        }
    }, [])
    return (
        <div className="App">
            <nav className="nav-bar">
                <button className="nav-item left rounded-button">about</button>
                <div className="nav-item center">Spotify Mood</div>
                {userName && <button onClick={handleLogout} className="nav-item right rounded-button">{userName}</button>}
                {(userName == ''  || userName == null) && <a className="nav-item right rounded-button" href={loginLink}>login</a>}
            </nav>
            <div className="input-container">
                <input type="text" placeholder="Enter your mood here" className="rounded-input" onChange = {e => setPrompt(e.target.value)}/>
                <button className="submit-button rounded-button" onClick={handleGeneratePlaylist}>generate playlist</button>
            </div>
            {loading && <LoadingSpinner />}
        </div>
    );
    
}

export default Home;
