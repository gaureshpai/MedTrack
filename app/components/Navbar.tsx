import React from 'react';
import '@/public/styles/Navbar.css'

const Navbar = () => {
  return (
    <div className="navbar">
      <a href='./' className='Name'>Gajanana Stores</a>
      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Shop</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
