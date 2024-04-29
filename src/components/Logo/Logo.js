import React from "react";
import Tilt from "react-parallax-tilt";
import "./Logo.css";
import brain from "./brain.png";


const Logo = () => {
    return (
        <Tilt className="ma4 mt0 br2 shadow-2 logodiv">
            <div style={{ height: '150px', width: '150px' }}>
                <div className="pa4"><img style={{paddingTop: '5px'}} alt="logo" src={brain}/></div>
            </div>
        </Tilt>
    );
}
export default Logo;