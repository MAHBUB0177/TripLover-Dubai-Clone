import React from "react";
import { Link } from "react-router-dom";
import "./SideNavBar.css";
import { MdAirplaneTicket } from "react-icons/md";
import { MdGroupWork } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { FaListAlt } from "react-icons/fa";
import { showHideController } from "../../../common/normal";

const SideNavBar = () => {
  let isAgent = JSON.parse(sessionStorage.getItem("isAgent"));
  const handelLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
    sessionStorage.setItem("popup", JSON.stringify(false));
  };
  return (
    <aside
      className="main-sidebar sidebar-dark-primary elevation-4 button-color"
      style={{ position: "fixed", height: "100%" }}
    >
      <div className="sidebar" style={{ overflow: "hidden" }}>
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">
                <i className="nav-icon fa fa-desktop text-white"></i>
                <p className="text-white">Dashboard</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/search" className="nav-link">
                <i className="nav-icon fas fa-search text-white"></i>
                <p className="text-white">Search</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/my-bookings" className="nav-link">
                <FaListAlt
                  className="nav-icon fa fa-list text-white"
                  style={{ fontSize: "20px" }}
                />
                <p className="text-white">My Booking</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/soto-ticket" className="nav-link">
                <MdAirplaneTicket
                  className="nav-icon fa fa-list text-white"
                  style={{ fontSize: "23px" }}
                />
                <p className="text-white">Ticket Alert</p>
              </Link>
            </li>
            {showHideController?.groupFare && (
              <li className="nav-item">
                <Link to="/fare-list" className="nav-link">
                  <MdGroupWork
                    className="nav-icon fa fa-list text-white"
                    style={{ fontSize: "23px" }}
                  />
                  <p className="text-white">Group Fare</p>
                </Link>
              </li>
            )}

            {isAgent && (
              <li className="nav-item">
                <Link to="/partial-payment" className="nav-link">
                  <RiSecurePaymentFill
                    className="nav-icon fa fa-list text-white"
                    style={{ fontSize: "23px" }}
                  />
                  <p className="text-white">Partial Payment</p>
                </Link>
              </li>
            )}

            {isAgent && (
              <li className="nav-item">
                <Link to="/balance" className="nav-link">
                  <i className="nav-icon fas fa-comment-dollar text-white"></i>
                  <p className="text-white">Topup Request</p>
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link to="/support" className="nav-link">
                <i className="nav-icon fas fa-headset text-white"></i>
                <p className="text-white">Support</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/all-Report" className="nav-link">
                <i
                  className="nav-icon  fa fa-file text-white"
                  aria-hidden="true"
                ></i>
                <p className="text-white">Reports</p>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/quickpassenger" className="nav-link">
                <i className="nav-icon fas fa-users text-white"></i>
                <p className="text-white">Add Passenger</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/setting" className="nav-link">
                <i
                  className="nav-icon fa fa-cog text-white"
                  aria-hidden="true"
                ></i>
                <p className="text-white">Settings</p>
              </Link>
            </li>

            {isAgent && (
              <li className="nav-item">
                <Link to="/staff" className="nav-link">
                  <i className="nav-icon fas fa-user text-white"></i>
                  <p className="text-white">My Users</p>
                </Link>
              </li>
            )}

            <li className="nav-item">
              <div
                className="nav-link"
                onClick={handelLogout}
                style={{ cursor: "pointer" }}
              >
                <i className="nav-icon fas fa-sign-out-alt text-white"></i>
                <p className="text-white">Logout</p>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default SideNavBar;
