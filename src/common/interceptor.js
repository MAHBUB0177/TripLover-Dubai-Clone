import axios from "axios";
import { environment } from "../Pages/SharePages/Utility/environment";
import moment from "moment";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(async (config) => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  const fullDetails = sessionStorage.getItem("full_details");
  if (tokenData?.token && (config.url === (environment.locationURL + "Search") || config.url === (environment.locationURL + "RePrice") || config.url === (environment.locationURL + "Book") || config.url === (environment.locationURL + "Ticket/NewTicket") || config.url === (environment.locationURL + "Cancel") || config.url === (environment.locationURL + "Ticket/ImportPnrTicket"))) {
    config.headers.Authorization = `Bearer ${tokenData?.token}`;
    config.headers.XLocation = fullDetails ?? null;
  } else {
    config.headers.Authorization = `Bearer ${tokenData?.token}`;
  }
  return config;
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//     //   signOut();

//     }
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokenData = JSON.parse(localStorage.getItem('token'))
      let sendobj = {
        token: tokenData?.token,
        refreshToken: tokenData?.refreshToken
      }
      try {
        if (tokenData?.refreshTokenExpieryTime !== undefined) {
          const refreshTokenExpiryTime = new Date(tokenData?.refreshTokenExpieryTime);
          const currentTime = new Date();
          const isAfter = refreshTokenExpiryTime > currentTime;
          if (isAfter === false) {
            const handelLogout = () => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = "/";
              sessionStorage.setItem("popup", JSON.stringify(false));
            };
            handelLogout();
          } else {
            const refreshTokenResponse = await axios.post(environment.refreshTokenUrl, sendobj);
            const newAccessToken = refreshTokenResponse.data.data;
            if (newAccessToken) {
              localStorage.setItem('token', JSON.stringify(newAccessToken));
              originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
              return axiosInstance(originalRequest);
            }
          }
        }

      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


