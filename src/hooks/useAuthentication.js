import { useState } from "react";
import axios from "axios";
import { environment } from "../Pages/SharePages/Utility/environment";
import { getFareRules } from "../common/allApi";

const useAuthentication = () => {
  const [bookData, setBookData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [login, setLogin] = useState(token && token.length > 0);
  let [fareRules, setFareRules] = useState({});
  const [count, setCount] = useState(0);
  const [id, setId] = useState();
  const [notificationCount, setNotificationCount] = useState();

  const onClickLoginButton = (loginData, navigate, location, toast) => {
    setLoading(true);
    axios
      .post(environment.login, loginData, {
        headers: {
          XLocation: sessionStorage.getItem("full_details") ?? null,
        },
      })
      .then((response) => {
        if (response.data.isSuccess == true) {
          if (response?.data?.otpRequired === undefined) {
            localStorage.setItem("token", JSON.stringify(response.data.data));
            localStorage.setItem("popup", JSON.stringify(true));
            setLogin(true);
            const destination = location.state?.from.pathname || "/search";
            window.location.href = destination;
          } else {
            localStorage.setItem("OTP", JSON.stringify(response?.data));
            navigate("/varify-account");
          }
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((err) => {
        if (
          err?.response?.data?.status === 428 &&
          err.response?.data?.actionType === 2
        ) {
          toast.error("Please allow your location and try again");
        } else {
          toast.error("Please try again");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFareRules = (uId, dir, itemCode, brandedFareRef) => {
    const fareRulesObj = {
      itemCodeRef: itemCode,
      uniqueTransID: uId,
      segmentCodeRefs: [],
      brandedFareRefs: brandedFareRef,
    };

    dir[0][0].segments.map((i) =>
      fareRulesObj.segmentCodeRefs.push(i.segmentCodeRef)
    );

    async function fetchOptions() {
      // alert("ok");
      setLoading(true);
      await getFareRules(fareRulesObj)
        .then((response) => {
          setFareRules(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    fetchOptions();
  };

  return {
    onClickLoginButton,
    login,
    setBookData,
    bookData,
    setTicketData,
    ticketData,
    setLoading,
    loading,
    setCount,
    count,
    setId,
    id,
    handleFareRules,
    fareRules,
    setFareRules,
    setNotificationCount,
    notificationCount,
  };
};

export default useAuthentication;
