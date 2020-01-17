import React from 'react'
import Image from 'react-image-resizer'
import './index.css'
import Logo from './logo-left.png';
import Logo2 from './logo-right.png';

function Team() {
    return (
        <div id ="team">
            <Image src={Logo} alt="website logo" height="100" width="100" className="myImage"/>
            <Image src={Logo2} alt="website logo" height="100" width="100" className="myImage"/>
        </div>
    );
}

export default Team;