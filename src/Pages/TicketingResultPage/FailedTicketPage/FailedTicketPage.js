import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../Loading/Loading";
import Footer from "../../SharePages/Footer/Footer";
import Navbar from "../../SharePages/Navbar/Navbar";
import SideNavBar from "../../SharePages/SideNavBar/SideNavBar";
import axios from "axios";
import { environment } from "../../../Pages/SharePages/Utility/environment";
import { toast, ToastContainer } from "react-toastify";
import { getUserAllInfo } from "../../../common/allApi";
const FailedTicketPage = () => {
  window.scrollTo(0, 0);
  const { loading, ticketData } = useAuth();
  const navigate = useNavigate();
  const handleOrder = () => {
    //     const orderTicket = async () => {
    //         let transactionId=JSON.parse(localStorage.getItem("uniqueTransID"));
    // 	      const response = await axios.put(environment.changeTicketStatus+"/"+transactionId+"/Ordered",null,environment.headerToken);
    //         if(response.data>0){
    //             navigate('/successorderticket');
    //         }
    //         else{
    //             toast.error('Sorry! try again..');
    //         }
    // };
    // orderTicket();
    navigate("/search");
  };


  const getAgentInfo = async () => {
    const response = await getUserAllInfo()
    // await axios.get(
    //   environment.agentInfo,
    //   environment.headerToken
    // );
    sessionStorage.setItem("agentBalance", response.data.currentBalance);
  };
  useEffect(() => {
    getAgentInfo();
  }, [])
  return (
    <div>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <Loading loading={loading}></Loading>
      <ToastContainer position="bottom-right" autoClose={1500} />
      <div className="content-wrapper search-panel-bg">
        <section className="content-header"></section>
        <section className="content content-panel">
          <div className="container w-100">
            <div className="row p-4">
              <div className="col-lg-4"></div>
              <div className="col-lg-4  bg-white text-center p-2">
                {/* <h5 className="pt-4 fw-bold">Please try again</h5> */}
                {ticketData.item2 != undefined ? (
                  <>
                    <p className="">
                      {ticketData.item2?.isMessageShow === true ? (
                        ticketData.item2?.message
                      ) : (
                        <p>
                          Ticket is in order list please contact with the support team
                        </p>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    {ticketData.isMessageShow === true ? (
                      ticketData.message
                    ) : (
                      <p className="p-3">
                        Ticket is in order list please contact with the support team
                      </p>
                    )}
                  </>
                )}

                <button
                  className="btn button-color mb-3 text-white fw-bold"
                  onClick={() => handleOrder()}
                  style={{ borderRadius: '8px' }}
                >
                  Search more
                </button>
              </div>
              <div className="col-lg-4"></div>
            </div>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default FailedTicketPage;
