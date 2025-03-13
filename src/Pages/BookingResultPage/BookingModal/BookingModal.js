import React, { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import $ from "jquery";
import "./BookingModal.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../SharePages/Navbar/Navbar";
import SideNavBar from "../../SharePages/SideNavBar/SideNavBar";
import Footer from "../../SharePages/Footer/Footer";
import Loading from "../../Loading/Loading";
import { requestBook } from "../../../common/allApi";

const BookingModal = () => {
  const sendObj = JSON.parse(sessionStorage.getItem("passengerPack"));
  const reprice = JSON.parse(sessionStorage.getItem("reprice"));
  const bookingComponent = JSON.parse(
    sessionStorage.getItem("bookingComponents")
  );
  const navigate = useNavigate();
  const { setLoading, loading } = useAuth();
  const handleCancle = () => {
    // document.getElementsByClassName("modal-backdrop")[0].remove();
    navigate("/");
  };

  const handleBooking = () => {
    async function booking() {
      setLoading(true);
      sendObj.uniqueTransID = reprice?.data?.item1?.uniqueTransID;
      sendObj.itemCodeRef = reprice?.data?.item1?.itemCodeRef;
      sendObj.PriceCodeRef = reprice?.data?.item1?.priceCodeRef;
      await requestBook(sendObj)
        .then((response) => {
          if (response.data.item2.isSuccess === true) {
            sessionStorage.setItem("bookData", JSON.stringify(response));
            document.getElementsByClassName("modal-backdrop")[0].remove();
            setLoading(false);
            navigate("/successbooking");
          } else {
            document.getElementsByClassName("modal-backdrop")[0].remove();
            setLoading(false);
            navigate("/failedbooking");
          }
        });
    }
    // booking(bookData.data.item1.priceCodeRef);
    booking();
  };
  useEffect(() => {
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $("body").removeAttr("style");
  }, []);
  return (
    <>
      <div>
        <Navbar></Navbar>
        <SideNavBar></SideNavBar>
        {loading && (
          <Loading flag={2} title={"ticketing"} loading={loading}></Loading>
        )}
        <div className="content-wrapper search-panel-bg">
          <section className="content-header"></section>
          <section className="content content-panel">
            <div className="container bg-white w-50 p-5">
              <div className="row">
                <div className="col-lg-12 text-center">
                  <h5 class="button-color p-2 rounded text-white">
                    Your selected price has been changed!
                  </h5>
                  <p className="py-2">
                    Reference number :{" "}
                    {JSON.parse(sessionStorage.getItem("uniqueTransID"))}{" "}
                  </p>
                  <h5 className="text-success pb-1">
                    New Price is AED {reprice?.data?.item1?.totalPrice}
                  </h5>
                  <h5 className="text-success pb-3">
                    Old Price is AED {bookingComponent[0]?.totalPrice}
                  </h5>
                  <hr></hr>
                  <div className="my-2">
                    <button
                      type="button"
                      class="btn button-color rounded text-white me-2"
                      data-bs-dismiss="modal"
                      onClick={handleCancle}
                    >
                      Search Again
                    </button>
                    <button
                      type="button"
                      class="btn button-color rounded text-white"
                      onClick={handleBooking}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
};

export default BookingModal;
