import React from 'react'
import './index.css'
import TheTeam from './theteam.jpg'

function Team() {
    return (
        <>
        <br/>
        <h1>The Team</h1>
        <div className="team">
        <div class="member">
                <h3>Philip Gunning</h3>
            </div>
            <div class="member">
                <h3>Matthew Greenlees</h3>
            </div>
            <div class="member">
                <h3>Robert Sketch</h3>
            </div>
            <div class="member">
                <h3>Eoin Stewart</h3>
            </div>
            <div class="member">
                <h3>Andrew McNaught</h3>
            </div>
        </div>
        <img src={TheTeam} className="teamPic" alt=""/>
        </>
    );
}

export default Team;