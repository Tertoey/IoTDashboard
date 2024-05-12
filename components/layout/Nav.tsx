'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLineChart, faHome, faSignOut, faBars, faUser, faCloud} from '@fortawesome/free-solid-svg-icons'
// import '../style/dashboard.css';

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false); // Track profile options visibility

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const showProfileOptionsOnHover = () => {
    setShowProfileOptions(true);
  };

  const hideProfileOptionsOnLeave = () => {
    setShowProfileOptions(false);
  };

  return (
    <nav>
      {/* Sidebar */}
      <div
        className={`${
          isNavOpen ? 'w-44' : 'w-16'
        } bg-gray-800 text-white h-screen transition-all duration-200`}
      >
        <div className="p-4 flex flex-col absolute">
          {/* Sidebar links */}
          <button
            className="navBar-button flex justify-start py-4 pl-1 text-xl"
            onClick={toggleNav}
          >
            {isNavOpen ? <FontAwesomeIcon icon={faBars} /> : <FontAwesomeIcon icon={faBars} />}
          </button>
          <a href="/restroom" className="navBar-button py-4 pl-1 text-xl">
            {isNavOpen && <FontAwesomeIcon icon={faHome} />} {isNavOpen && 'Home'} {!isNavOpen && <FontAwesomeIcon icon={faHome} />}
          </a>
          <a href="/building" className="navBar-button py-4 pl-1 text-xl">
            {isNavOpen && <FontAwesomeIcon icon={faLineChart} />} {isNavOpen && 'Dashboard'} {!isNavOpen && <FontAwesomeIcon icon={faLineChart} />}
          </a>
          <div
            onMouseEnter={showProfileOptionsOnHover} // Show profile options on hover
            onMouseLeave={hideProfileOptionsOnLeave} // Hide profile options when no longer hovering
            className='py-4'
          >
            <a href="/profile" className="navBar-button py-4 pl-1 text-xl">
              {isNavOpen && <FontAwesomeIcon icon={faUser} />} {isNavOpen && 'Profile'} {!isNavOpen && <FontAwesomeIcon icon={faUser} />}
            </a>
            {showProfileOptions && ( // Conditional rendering for profile options
              <div  className='expNavbar ml-3'>
                <a href="/editprofile" className="navBar-button pl-4 text-xl">
                {isNavOpen && <div className='mt-3'>Edit Profile</div>}
                </a>
              </div>
            )}
          </div>
          <a href="/weather" className="navBar-button py-4 pl-1 text-xl">
            {isNavOpen && <FontAwesomeIcon icon={faCloud} />} {isNavOpen && 'Weather'} {!isNavOpen && <FontAwesomeIcon icon={faCloud} />}
          </a>
        </div>
        <footer className='navBar-button pl-4 pb-10 absolute bottom-0'>
          <a href="/" className="py-4 pl-1 text-xl">
            {isNavOpen && <FontAwesomeIcon icon={faSignOut} /> } {isNavOpen && 'Logout'} {!isNavOpen && <FontAwesomeIcon icon={faSignOut} />}
          </a>
        </footer>
      </div>
    </nav>
  );
}

export default Navbar;