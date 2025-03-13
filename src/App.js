import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthProvider from "./context/AuthProvider/AuthProvider";
import ForgotPassword from "./Pages/AuthenticationPage/ForgotPassword/ForgotPassword";
import LoginPage from "./Pages/AuthenticationPage/LoginPage/LoginPage";
import Balance from "./Pages/Balance/Balance";
import BookingModal from "./Pages/BookingResultPage/BookingModal/BookingModal";
import FailedBookingPage from "./Pages/BookingResultPage/FailedBookingPage/FailedBookingPage/FailedBookingPage";
import SuccessBookingPage from "./Pages/BookingResultPage/SuccessBookingPage/SuccessBookingPage/SuccessBookingPage";
import DashboardPage from "./Pages/DashboardPage/DashboardPage/DashboardPage";
import FlightHistoryPage from "./Pages/FlightHistoryPage/FlightHistoryPage/FlightHistoryPage";
import Markup from "./Pages/Markup/Markup";
import NoDataFoundPage from "./Pages/NoDataFoundPage/NoDataFoundPage/NoDataFoundPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage/ProfilePage";
import SearchPage from "./Pages/SearchPage/SearchPage/SearchPage";
import ShowAllFlightPage from "./Pages/ShowAllFlightPage/ShowAllFlightPage/ShowAllFlightPage";
import SuccessTicketPage from "./Pages/TicketingResultPage/SuccessTicketPage/SuccessTicketPage/SuccessTicketPage";
import TravelCartConfirmPage from "./Pages/TravelCartConfirmPage/TravelCartConfirmPage/TravelCartConfirmPage";
import TravelCartPage from "./Pages/TravelCartPage/TravelCartPage/TravelCartPage";
import ViewFlightHistory from "./Pages/ViewFlightHistory/ViewFlightHistory/ViewFlightHistory";
import Staff from "./Pages/Staff/Staff";
import Support from "./Pages/Support/Support";
import Queues from "./Pages/Queues/Queues";
import Proposal from "./Pages/Proposal/Proposal";
import PrivateRoute from "./Pages/AuthenticationPage/PrivateRoute/PrivateRoute";
import Registration from "./Pages/AuthenticationPage/Registration/Registration";
import QuickPassenger from "./Pages/QuickPassenger/QuickPassenger";
import Loading from "./Pages/Loading/Loading";
import Contact from "./Pages/Optional/Contact/Contact";
import BankDetails from "./Pages/Optional/BankDetails/BankDetails";
import PrivacyPolicy from "./Pages/Optional/PrivacyPolicy/PrivacyPolicy";
import TermCondition from "./Pages/Optional/TermCondition/TermCondition";
import RefundAndCancellation from "./Pages/Optional/RefundAndCancellation/RefundAndCancellation";
import FAQ from "./Pages/Optional/FAQ/FAQ";
import Ticket from "./Pages/Ticket/Ticket";
import Voucher from "./Pages/Voucher/Voucher";
import Invoice from "./Pages/Invoice/Invoice";
import BookedView from "./Pages/BookedView/BookedView";
import FailedTicketPage from "./Pages/TicketingResultPage/FailedTicketPage/FailedTicketPage";
import CompanyBankAccount from "./Pages/CompanyBankAccount/CompanyBankAccount";
import Description from "./Pages/Description/Description";
import Ledger from "./Pages/Ledger/Ledger";
import SalesReport from "./Pages/Reports/SalesReport/SalesReport";
import { useState } from "react";
import TicketOrderSuccess from "./Pages/TicketingResultPage/TicketOrderSuccess/TicketOrderSuccess";
import CreditNotes from "./Pages/CreditNotes/CreditNotes";
import CheckoutSuccess from "./Pages/CheckoutConfirmation/CheckoutSuccess";
import CheckoutFailed from "./Pages/CheckoutConfirmation/CheckoutFailed";
import { Box } from "@chakra-ui/react";
import cardBg from "../src/images/landing/landing-bg.png";
import RegComplete from "./Pages/AuthenticationPage/RegComplete/RegComplete";
import Issued from "./Pages/Queues/Issued";
import Booked from "./Pages/Queues/Booked";
import Canceled from "./Pages/Queues/Canceled";
import InvoiceView from "./Pages/InvoiceView/InvoiceView";
import Expired from "./Pages/Queues/Expired";
import LoanLedger from "./Pages/Ledger/LoanLedger";
import ResetPassword from "./Pages/AuthenticationPage/ResetPassword/ResetPassword";
import EmiPolicy from "./Pages/Optional/EmiPolicy";
import AboutUs from "./Pages/Optional/About/About";
import CancleTicketView from "./Pages/CancleTicketView/CancleTicketView";
import SuccessCancelBook from "./Pages/BookedView/successCancelBook";
import FlightChange from "./Pages/BookingResultPage/FailedBookingPage/FlightChange";
import FailPayment from "./Pages/Balance/failpayment";
import SuccessPayment from "./Pages/Balance/successpayment";
import Shownotification from "./Pages/SharePages/Navbar/shownotification";
import useNotification from "./hooks/useNotification";
import { Image, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { environment } from "./Pages/SharePages/Utility/environment";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import AdmPolicy from "./Pages/Optional/AdmPolicy/AdmPolicy";
import Payment from "./Pages/Balance/payment";
import SharePnr from "./Pages/SharePnr";
import VarifyAccount from "./Pages/AuthenticationPage/VarifyAccount";
import PartialPaymentDue from "./Pages/Queues/PartialDue";
import PartialPaid from "./Pages/Queues/PartialPaid";
import {
  getAccountManager,
  getGetCurrentUser,
  getTop20LatestNotification,
  getUserAllInfo,
} from "./common/allApi";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PaymentAlreadyCompleted from "./Pages/Balance/paymentAlreadyCompleted";
import FormWithExcelData from "./Pages/Balance/formWithExcelData";
import Error from "./Pages/Error";
import BookingPolicy from "./Pages/Optional/BookingPolicy";
import PaymentRequest from "./Pages/partialPayment/paymentRequest";
import SettingPage from "./Pages/Setting/setting";
import SotoTicket from "./Pages/Queues/sotoTicket";
import GroupFareSearchPage from "./Pages/GroupFare/Search";
import PaxCart from "./Pages/GroupFare/PaxCart/paxCart";
import SuccessGroupFare from "./Pages/GroupFare/BookingResult/success";
import GroupFare from "./Pages/Queues/GroupFare";
import RefundRequstList from "./Pages/Refund/refundRequstList";
import QuotationList from "./Pages/Refund/quotationList";
import RefundRequest from "./Pages/Refund/refundRequest";
import QuotationHistory from "./Pages/Refund/refundHistory";
import GetRefund from "./Pages/Refund/createRequest";
import CancelPayment from "./Pages/Balance/cancelPayment";

import GetVoid from "./Pages/Void/createRequest";
import VoidRequstList from "./Pages/Void/voidRequstList";
import VoidQuotationList from "./Pages/Void/quotationList";
import VoidQuotationHistory from "./Pages/Void/voidHistory";
import VoidRequest from "./Pages/Void/voidRequest";
import DirectTopUp from "./Pages/SharePages/DirectTopUp/DirectTopUp";
import AllReport from "./Pages/Reports/allReport";
import PartialPayment from "./Pages/partialPayment/partialPayment";
import BookingWraper from "./Pages/Queues/bookingWraper";
import ShowAllFlightPageForProgressive from "./Pages/ShowAllFlightPageForProgressiveSearch/ShowAllFlightPage/ShowAllFlightPageForProgressive";
import GetReissue from "./Pages/Reissue/createRequest";
import ReissueRequest from "./Pages/Reissue/reissueRequest";
import { showHideController } from "./common/normal";
import SearchList from "./Pages/SharePages/Navbar/SearchList";
import TravelCartPageComboFare from "./Pages/TravelCartPageComboFare/TravelCartPage/TravelCartPageComboFare";

function App() {
  var isLoggedIn = localStorage.getItem("token") !== null ? true : false;
  const { setNotificationCount } = useNotification();
  const [signalRConnection, setSignalRConnection] = useState();
  const [connectionId, setConnectionId] = useState();
  let toast = useToast();
  const GetTopNotificationList = async () => {
    await getTop20LatestNotification()
      .then((res) => {
        (async () =>
          await localStorage.setItem(
            "notificationCount",
            JSON.stringify(res?.data?.data?.unreadCount)
          ))();
        setNotificationCount(
          JSON.parse(localStorage.getItem("notificationCount"))
        );
      })
      .catch((error) => {});
  };
  const startSignalRConnection = async () => {
    try {
      const signalRConnection = new HubConnectionBuilder()
        .withUrl(environment.signalRNegotiationLink, {
          accessTokenFactory: () =>
            JSON.parse(localStorage.getItem("token")).token,
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      signalRConnection.on("notification", (data) => {
        if (data.message && data.message.trim() !== "") {
          toast({
            title: data.title,
            description: data.message,
            status: "info",
            isClosable: true,
            duration: 10000,
          });
          GetTopNotificationList();
        }
      });

      await signalRConnection
        .start()
        .then(() => {})
        .then(() => {
          signalRConnection.invoke("getconnectionid").then((data) => {
            setConnectionId(data);
          });
        })
        .catch((err) => {});
      setSignalRConnection(signalRConnection);
    } catch (e) {}
  };

  //current user data
  const getUserData = async () => {
    try {
      const response = await getGetCurrentUser();
      sessionStorage.setItem("currentUser", JSON.stringify(response?.data));
      sessionStorage.setItem(
        "isAgent",
        JSON.stringify(response?.data?.isAgent)
      );
      sessionStorage.setItem("userName", response.data.fullName);
      localStorage.setItem(
        "userRole",
        btoa(btoa(btoa(response.data.b2BRoleID)))
      );
      sessionStorage.setItem("isTempInspector", response.data.isTempInspector);
    } catch (error) {}
  };

  const accountManagerInfo = async (agentId) => {
    await getAccountManager(agentId)
      .then((amRes) => {
        sessionStorage.setItem("accountManager", JSON.stringify(amRes.data));
      })
      .catch((err) => {});
  };
  // agent information
  const getAgentData = async () => {
    getUserAllInfo()
      .then((agentRes) => {
        accountManagerInfo(agentRes.data.id);
        sessionStorage.setItem("agentId", agentRes.data.id);
        sessionStorage.setItem("agentCode", agentRes.data.code);
        sessionStorage.setItem("agentBalance", agentRes.data.currentBalance);
        sessionStorage.setItem("agentName", agentRes.data.name);
        sessionStorage.setItem("logoName", agentRes.data.logoName);
        sessionStorage.setItem("agentAddress", agentRes.data.address);
        sessionStorage.setItem("agentInfoData", JSON.stringify(agentRes?.data));
      })
      .catch((err) => {});
  };

  useEffect(() => {
    startSignalRConnection();
    if (isLoggedIn) {
      getUserData();
      getAgentData();
    }
  }, []);

  const [isOnline, setIsonline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsonline(window.navigator.onLine);
      window.location.reload();
    };

    const handleOffline = () => {
      setIsonline(window.navigator.onLine);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return <Error />;
  }

  return (
    <Box bg="white">
      <Box
        w="100%"
        // h="100vh"
        // backgroundImage={`url(${cardBg})`}
        zIndex={0}
        position="absolute"
      />
      <AuthProvider>
        <BrowserRouter>
          {isLoggedIn && <DirectTopUp />}
          <Routes>
            <Route
              path="/"
              element={isLoggedIn ? <SearchPage /> : <LoginPage />}
            />
            <Route
              path="/registration"
              element={isLoggedIn ? <SearchPage /> : <Registration />}
            />
            <Route path="/loading" element={<Loading />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/bankdetail" element={<BankDetails />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/termandcondition" element={<TermCondition />} />
            <Route path="/bookingpolicy" element={<BookingPolicy />} />
            <Route path="/EmiPolicy" element={<EmiPolicy />} />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="/regsuccess" element={<RegComplete />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/cancelbooking" element={<SuccessCancelBook />} />
            <Route path="/Admpolicy" element={<AdmPolicy />} />
            <Route
              path="/varify-account"
              element={isLoggedIn ? <SearchPage /> : <VarifyAccount />}
            />
            <Route path="/error" element={<Error />} />
            <Route
              path="/refundandcancellation"
              element={<RefundAndCancellation />}
            />
            <Route path="/faq" element={<FAQ />} />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <SearchPage />
                </PrivateRoute>
              }
            />
            {showHideController?.groupFare && (
              <>
                <Route
                  path="/groupfarelist"
                  element={
                    <PrivateRoute>
                      <GroupFareSearchPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/groupfare-pax-cart"
                  element={
                    <PrivateRoute>
                      <PaxCart />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/fare-list"
                  element={
                    <PrivateRoute>
                      <GroupFare />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/booking-success"
                  element={
                    <PrivateRoute>
                      <SuccessGroupFare />
                    </PrivateRoute>
                  }
                />
              </>
            )}

            <Route
              path="/setting"
              element={
                <PrivateRoute>
                  <SettingPage />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/share-pnr"
              element={
                <PrivateRoute>
                  <SharePnr />
                </PrivateRoute>
              }
            /> */}
            <Route
              path="/showallflight"
              element={
                <PrivateRoute>
                  {environment.isProgressiveSearch === true ? (
                    <ShowAllFlightPageForProgressive />
                  ) : (
                    <ShowAllFlightPage />
                  )}
                </PrivateRoute>
              }
            />
            <Route
              path="/farechange"
              element={
                <PrivateRoute>
                  <FlightChange />
                </PrivateRoute>
              }
            />

            <Route
              path="/travellcart"
              element={
                <PrivateRoute>
                  <TravelCartPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/travellcartcombofare"
              element={
                <PrivateRoute>
                  <TravelCartPageComboFare />
                </PrivateRoute>
              }
            />


            <Route
              path="/cancelticket"
              element={
                <PrivateRoute>
                  <CancleTicketView />
                </PrivateRoute>
              }
            />
            <Route
              path="/cartconfirm"
              element={
                <PrivateRoute>
                  <TravelCartConfirmPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/successbooking"
              element={
                <PrivateRoute>
                  <SuccessBookingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/failedbooking"
              element={
                <PrivateRoute>
                  <FailedBookingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookingmodal"
              element={
                <PrivateRoute>
                  <BookingModal />
                </PrivateRoute>
              }
            />
            <Route
              path="/successticket"
              element={
                <PrivateRoute>
                  <SuccessTicketPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/partial-request"
              element={
                <PrivateRoute>
                  <PaymentRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/flighthistory"
              element={
                <PrivateRoute>
                  <FlightHistoryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/view"
              element={
                <PrivateRoute>
                  <ViewFlightHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/balance"
              element={
                <PrivateRoute>
                  <Balance></Balance>
                </PrivateRoute>
              }
            />
            <Route
              path="/successPayment"
              element={
                <PrivateRoute>
                  <SuccessPayment />
                </PrivateRoute>
              }
            />
            <Route
              path="/paymentAlreadyCompleted"
              element={
                <PrivateRoute>
                  <PaymentAlreadyCompleted />
                </PrivateRoute>
              }
            />
            <Route
              path="/failPayment"
              element={
                <PrivateRoute>
                  <FailPayment />
                </PrivateRoute>
              }
            />
            <Route
              path="/cancelPayment"
              element={
                <PrivateRoute>
                  <CancelPayment />
                </PrivateRoute>
              }
            />

            <Route
              path="/Payment"
              element={
                <PrivateRoute>
                  <Payment />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage></DashboardPage>
                </PrivateRoute>
              }
            />
            <Route
              path="/balance"
              element={
                <PrivateRoute>
                  <Balance></Balance>
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/markup"
              element={
                <PrivateRoute>
                  <Markup></Markup>
                </PrivateRoute>
              }
            /> */}
            <Route
              path="/support"
              element={
                <PrivateRoute>
                  <Support></Support>
                </PrivateRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <PrivateRoute>
                  <BookingWraper></BookingWraper>
                </PrivateRoute>
              }
            />
            <Route
              path="/Queues"
              element={
                <PrivateRoute>
                  <Queues></Queues>
                </PrivateRoute>
              }
            />
            <Route
              path="/Staff"
              element={
                <PrivateRoute>
                  <Staff></Staff>
                </PrivateRoute>
              }
            />
            <Route
              path="/proposal"
              element={
                <PrivateRoute>
                  <Proposal></Proposal>
                </PrivateRoute>
              }
            />
            <Route
              path="/forgotpassword"
              element={<ForgotPassword></ForgotPassword>}
            />
            <Route
              path="/quickpassenger"
              element={
                <PrivateRoute>
                  <QuickPassenger></QuickPassenger>
                </PrivateRoute>
              }
            />
            <Route
              path="/ticket"
              element={
                <PrivateRoute>
                  <Ticket />
                </PrivateRoute>
              }
            />
            <Route
              path="/soto-ticket"
              element={
                <PrivateRoute>
                  <SotoTicket />
                </PrivateRoute>
              }
            />

            <Route
              path="/invoice"
              element={
                <PrivateRoute>
                  <Invoice />
                </PrivateRoute>
              }
            />
            <Route
              path="/voucher"
              element={
                <PrivateRoute>
                  <Voucher />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookedview"
              element={
                <PrivateRoute>
                  <BookedView />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/form-with-excel-data"
              element={
                <PrivateRoute>
                  <FormWithExcelData/>
                </PrivateRoute>
              }
            /> */}
            <Route
              path="/processticket"
              element={
                <PrivateRoute>
                  <FailedTicketPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cbankaccount"
              element={
                <PrivateRoute>
                  <CompanyBankAccount />
                </PrivateRoute>
              }
            />
            <Route
              path="/details"
              element={
                <PrivateRoute>
                  <Description />
                </PrivateRoute>
              }
            />
            <Route
              path="/all-Report"
              element={
                <PrivateRoute>
                  <AllReport />
                </PrivateRoute>
              }
            />

            <Route
              path="/ledger"
              element={
                <PrivateRoute>
                  <Ledger />
                </PrivateRoute>
              }
            />
            <Route
              path="/loanledger"
              element={
                <PrivateRoute>
                  <LoanLedger />
                </PrivateRoute>
              }
            />
            <Route
              path="/salesreport"
              element={
                <PrivateRoute>
                  <SalesReport></SalesReport>
                </PrivateRoute>
              }
            />
            <Route
              path="/successorderticket"
              element={
                <PrivateRoute>
                  <TicketOrderSuccess></TicketOrderSuccess>
                </PrivateRoute>
              }
            />

            <Route
              path="/refundstatus"
              element={
                <PrivateRoute>
                  <CreditNotes />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkoutsuccess"
              element={
                <PrivateRoute>
                  <CheckoutSuccess></CheckoutSuccess>
                </PrivateRoute>
              }
            />
            <Route
              path="/checkoutfailed"
              element={
                <PrivateRoute>
                  <CheckoutFailed></CheckoutFailed>
                </PrivateRoute>
              }
            />
            <Route
              path="/ticketed"
              element={
                <PrivateRoute>
                  <Issued />
                </PrivateRoute>
              }
            />
            <Route
              path="/booked"
              element={
                <PrivateRoute>
                  <Booked />
                </PrivateRoute>
              }
            />

            {/* //partial payment menu */}
            <Route
              path="/partial-payment"
              element={
                <PrivateRoute>
                  <PartialPayment />
                </PrivateRoute>
              }
            />

            <Route
              path="/partial-due"
              element={
                <PrivateRoute>
                  <PartialPaymentDue />
                </PrivateRoute>
              }
            />

            <Route
              path="/partial-paid"
              element={
                <PrivateRoute>
                  <PartialPaid />
                </PrivateRoute>
              }
            />

            <Route
              path="/ticket-cancel"
              element={
                <PrivateRoute>
                  <Canceled />
                </PrivateRoute>
              }
            />
            <Route
              path="/invoiceview"
              element={
                <PrivateRoute>
                  <InvoiceView />
                </PrivateRoute>
              }
            />
            <Route
              path="/booking-cancel"
              element={
                <PrivateRoute>
                  <Expired />
                </PrivateRoute>
              }
            />

            <Route
              path="/notification"
              element={
                <PrivateRoute>
                  <Shownotification />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-refund"
              element={
                <PrivateRoute>
                  <GetRefund />
                </PrivateRoute>
              }
            />
            <Route
              path="/all-refund-request"
              element={
                <PrivateRoute>
                  <RefundRequstList />
                </PrivateRoute>
              }
            />
            <Route
              path="/all-quotation"
              element={
                <PrivateRoute>
                  <QuotationList />
                </PrivateRoute>
              }
            />

            <Route
              path="/quotation-history"
              element={
                <PrivateRoute>
                  <QuotationHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/refund-request"
              element={
                <PrivateRoute>
                  <RefundRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-void"
              element={
                <PrivateRoute>
                  <GetVoid />
                </PrivateRoute>
              }
            />
            <Route
              path="/void-request"
              element={
                <PrivateRoute>
                  <VoidRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/void-all-request"
              element={
                <PrivateRoute>
                  <VoidRequstList />
                </PrivateRoute>
              }
            />

            <Route
              path="/void-all-quotation"
              element={
                <PrivateRoute>
                  <VoidQuotationList />
                </PrivateRoute>
              }
            />

            <Route
              path="/void-quotation-history"
              element={
                <PrivateRoute>
                  <VoidQuotationHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-reissue"
              element={
                <PrivateRoute>
                  <GetReissue />
                </PrivateRoute>
              }
            />

            <Route
              path="/reissue-request"
              element={
                <PrivateRoute>
                  <ReissueRequest />
                </PrivateRoute>
              }
            />
             <Route
              path="/global-search"
              element={
                <PrivateRoute>
                  <SearchList />
                </PrivateRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Box>
  );
}

export default App;
