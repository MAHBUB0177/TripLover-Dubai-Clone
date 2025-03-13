import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../images/logo/logo-combined.png";

const Navbar = () => {
  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid ms-5">
          <Link class="navbar-brand" to="/search">
            <img src={logo} alt="" width="60%" height="40" />
          </Link>
        
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
