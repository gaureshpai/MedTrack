import React from 'react';
import '@/public/styles/globals.css'

const Navbar = () => {
    return (
        <div className="navbar">
        <div className = "primary_head">
            <button className="file">file</button>
            <button className="edit">edit</button> 
            <button className="view">view</button>
            <button className="prgm_name">τρελός_addition.js</button>
        </div>

        <hr/>
        <div className="file_destination_grid">
            <p className = "file_path_parg">
            Desktop/CSEHUB/τρελός_addition.js
        </p>

        <button className="login">login</button>
        <button className="login">login</button>
        <button className="login">login</button>
        </div>
            <hr />
        </div>
    );
};

export default Navbar;