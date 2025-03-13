import React, { useEffect } from "react";
import axios from "axios";
import logo from "../../../images/logo/logo-combined.png";
import { environment } from "../../../Pages/SharePages/Utility/environment.js";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordCanShown, setPasswordCanShown] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,32}$/;
    const changePassword = async () => {
      setLoading(true);
      if (re.test(password) === false) {
        toast.error(
          "Passwprd must one uppercase letter, lowercase letter, number, special character and 8 length",
          {
            className: "toast-message",
          }
        );
        setLoading(false);
        return;
      }
      if (password !== cpassword) {
        toast.error("password does not metch");
        setLoading(false);
        return;
      }
      let sendObj = {
        verificationCode: searchParams.get("ue"),
        password: password,
        confirmPassword: cpassword,
      };
      const response = await axios.post(environment.changePassword, sendObj);
      if (response.data.isSuccess === true) {
        toast.success("password reset successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (response.data.isSuccess === false) {
        toast.error(response.data.message);
      }
      setLoading(false);
    };
    changePassword();
    e.preventDefault();
  };

  useEffect(() => {});
  return (
    <div className="hold-transition login-page search-panel-bg">
      <ToastContainer position="bottom-right" autoClose={1500} />
      <div className="login-box">
        {/* <div className="login-logo">
          <img src={logo} alt="Triplover" />
          <Link to="/"></Link>
        </div> */}

        <div className="card">
          <div className="card-header text-center">
            <Link to="/">
              <img src={logo} alt="FirstTrip" />
            </Link>
          </div>
          <div className="card-body login-card-body">
            <p className="login-box-msg">Password Reset</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type={passwordShown ? "text" : "password"}
                  className="form-control rounded"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span
                      className="fas fa-lock"
                      onClick={() => setPasswordShown(!passwordShown)}
                    ></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type={passwordCanShown ? "text" : "password"}
                  className="form-control rounded"
                  placeholder="Confirm Password"
                  onChange={(e) => setCPassword(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span
                      className="fas fa-lock"
                      onClick={() => setPasswordCanShown(!passwordCanShown)}
                    ></span>
                  </div>
                </div>
              </div>
              <div className="row pb-4">
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn button-color text-white fw-bold btn-block rounded btn-sm"
                    disabled={loading ? true : false}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>

            {/* <p className="mt-3 mb-1 font-size">
              <Link to="/">
                <span className="fw-bold" style={{ color: "#1d94e4" }}>
                  Sign In
                </span>
              </Link>
            </p> */}
            {/* <p className="mb-0">
              <a href="register.html" className="text-center">
                Register a new membership
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </div>

    // <div>
    //     Reset Password
    //           <div className="col-6">
    //           <button
    //             type="button"
    //             className="btn button-color text-white fw-bold btn-block rounded btn-sm"
    //             onClick={()=>changePassword()}
    //           >
    //             Reset password
    //           </button>
    //         </div>
    // </div>
  );
};

export default ResetPassword;
