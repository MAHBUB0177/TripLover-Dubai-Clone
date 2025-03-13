import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../Loading/Loading";
import "./FailedBookingPanel.css"

const FailedBookingPanel = () => {
  const { loading } = useAuth();
  return (
    <div>
      <Loading loading={loading}></Loading>
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content content-panel">
          <div className="container bg-white w-25">
            <div className="row">
              <div className="col-lg-12 text-center">
                <h5 className="pt-4 fw-bold">Please try again</h5>
                {/* <p>Something is wrong </p> */}
                <p>Reference number : {(JSON.parse(sessionStorage.getItem("uniqueTransID")))} </p>
                <div className="my-3">
                  <span className="text-danger fs-3"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></span>
                </div>
                <p>We couldn't book that flight <br></br>Please contact the support team or try again<br></br>Thank You</p>
                <hr></hr>
                <Link to="/search" className="btn button-color my-3 text-white fw-bold border-radius">Search again</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FailedBookingPanel;
