import React from 'react'
import Image from 'react-image-resizer'
import './index.css'
import Matt from './matt.jpg';
import Rob from './rob.png'
import Eoin from './eoin.jpg'
import Phil from './phil.jpg'
import Andy from './andrew.jpg'
import TheTeam from './theteam.jpg'

function Team() {
    return (
        <>
        <h1>The Team</h1>
        <div className="team">
        <div class="member">
                <h3>Phillip Gunning</h3>
                <p>Didn't do stuff for his team</p>
            </div>
            <div class="member">
                <h3>Matthew Greenlees</h3>
                <p>Did stuff for his team</p>
            </div>
            <div class="member">
                <h3>Robert Sketch</h3>
                <p>The Americant</p>
            </div>
            <div class="member">
                <h3>Eoin Stewart</h3>
                <p>Also did stuff for his team</p>
            </div>
            <div class="member">
                <h3>Andrew McNaught</h3>
                <p>Literally did nothing</p>
            </div>
        </div>
        <img src={TheTeam} className="teamPic" />
        </>
    );
}

export default Team;