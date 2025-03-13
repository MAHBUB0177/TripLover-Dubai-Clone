import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import Loading from '../Loading/Loading';
import Footer from '../SharePages/Footer/Footer';
import Navbar from '../SharePages/Navbar/Navbar';
import SideNavBar from '../SharePages/SideNavBar/SideNavBar';

const SuccessCancelBook = () => {
    const { loading } = useAuth();
    const navigate = useNavigate();
    const handleSearch=()=>{
        navigate('/search');
        }
    return (
        <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <Loading loading={loading}></Loading>
      <ToastContainer position="bottom-right" autoClose={1500} />
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content content-panel">
          <div className="container bg-white w-25">
            <div className="row p-4">
              <div className="col-lg-12 text-center">
                <h5 className="pt-4 fw-bold">Successfully cancel this booking. Thank You.</h5>
                <hr></hr>
                <button className="btn button-color my-3 text-white fw-bold" onClick={()=>handleSearch()}>
                  Search more
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
    );
};

export default SuccessCancelBook;