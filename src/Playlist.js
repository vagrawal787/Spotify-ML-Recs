import React, { useState } from "react";
// import LoadingSpinner from "./LoadingSpinner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import './Home.css'

const Playlist = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [trackList, _] = useState(location.state.tracks)
    const [currentTrack, setCurrentTrack] = useState(Object.values(location.state.tracks)[0][0].split(':')[2])
    // const [isLoading, setLoading] = useState(true)
    // window.onSpotifyIframeApiReady = (IFrameAPI) => {
    //     //
    //     console.log("YEAH")
    //     const element = document.getElementById('embed-iframe');
    //     // setLoading(false)
    //     const options = {
    //         width: 400,
    //         uri: 'spotify:playlist:55Mhk9MwrXXBoP3omQGWwo'
    //     };
    //     const callback = (EmbedController) => { };
    //     IFrameAPI.createController(element, options, callback);
    // }
    const changeTrack = (uri) => {
        let splitUri = uri.split(":")[2]
        setCurrentTrack(splitUri)
    }
    const handleBack = () => {
        navigate('/')
    }
    const displayTracks = () => {
        console.log(trackList)
        let rows = []
        // for (let i = 0; i < trackList.length; i++) {
        //     let trackName = Object.keys(trackList[i])[0]
        //     let trackArtist = trackList[i][trackName][1]
        //     let trackUri = trackList[i][trackName][0]

        //     rows.push(<li>
        //         <span class="number">{i + 1}</span>
        //         <div id={trackName} className="trackRow">
        //             <a id={trackName} onClick={changeTrack(this.id)}><h2 class="track-title"> {trackName} </h2></a>
        //             <p>{trackArtist}</p>
        //         </div>
        //     </li>)


        // }
        let count = 1
        for (var prop in trackList) {
            let trackName = prop
            let trackArtist = trackList[prop][1]
            let trackUri = trackList[prop][0]

            rows.push(<li key={count}>
                <a onClick={() => changeTrack(trackUri)} ><span className="number">{count}</span></a>
                <div id={trackName} className="trackRow">
                    <h2 className="track-title"> {trackName} </h2>
                    <p>{trackArtist}</p>
                </div>
            </li>)

            count = count + 1
        }
        return <ul>{rows}</ul>
    }
    return (
        <div className="container">
            <nav className="navbar">
                <Link className="navbar-brand" to="/">
                    <button className="navbar-button">About</button>
                </Link>
                <h1 className="navbar-title">Spotify Mood</h1>
                <Link className="navbar-brand" to="/">
                    <button className="navbar-button" onClick={handleBack}>Back</button>
                </Link>
            </nav>
            <div className="playlist-container">
                <div className="tracksWrapper">
                    {displayTracks()}
                </div>
                {/* <div id="embed-iframe"></div> */}
                {/* <button className="submit-button">Add to Playlist</button> */}
            </div>
            <div className="embed-iframe">
                <iframe src={`https://open.spotify.com/embed/track/${currentTrack}`} width="400" height="900" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                {/* <div class="button-container">
                    <button className="submit-button">Add to Playlist</button>
                </div> */}
            </div>
            {/* {isLoading && <LoadingSpinner />} */}
        </div>
        // <div>
        //     <nav>
        //         <a href="/">About</a>
        //         <h1>Spotify Mood</h1>
        //         <a href="/login">Login</a>
        //     </nav>
        //     <div style={{ marginTop: '80px' }}>
        //         {/* <iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DWUo7Z5GzTb6S" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe> */}
        //         <div id="embed-iframe"></div>
        //         <button>Add to Playlist</button>
        //     </div>
        // </div>
    );
};

export default Playlist;
