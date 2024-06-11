import React from 'react';
import '@/public/styles/Navbar.css'

const Navbar = () => {
    return (
        <div className="navbar">
        <div className = "primary_head">
            <button className="file">file</button>
            <button className="edit">edit</button> 
            <button className="view">view</button>
            <a className="prgm_name">MINI PROJECT</a>
        </div>

        <hr/>
        <div className="file_destination_grid">
            <p className = "file_path_parg">
                filename
            </p>
            <button className="login">login</button>
            <button className="login">sync in</button>
            <button className="login">sync out</button>
        </div>
        <hr />
        </div>
    );
};

export default Navbar;