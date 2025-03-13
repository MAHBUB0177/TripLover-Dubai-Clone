import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "react-multi-carousel/lib/styles.css";
import "react-loading-skeleton/dist/skeleton.css";

import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter";
import AuthProvider from "./context/AuthProvider/AuthProvider";
import SideScrollbar from "./Pages/SharePages/sidescroll/SideScrollbar";
import ScrollToTopButton from "./component/scrollToTopButton";
import ErrorBoundary from "./Pages/Error/errorBoundary ";

const colors = {
  primary: "#7c04c0",
  primaryLight: "#b4dce2",
  secondary: "#ed7f22",
  secondaryLight: "#F9D8BC",
  backgroundVariant: "#FAF9FF",
  text: "#1E1E1E",
  inactiveText: "#6F6F6F",
  inactiveIcon: "#8796A1",
  white: "#FFFFFF",
  black: "#000000",
  gradient: "linear-gradient(100.94deg, #ed7f22 -9.51%, #ed7f22 115.79%)",
};

const fonts = {
  heading: "Inter",
  body: "Inter",
};

const theme = extendTheme({ colors, fonts });

// replace console.* for disable log on production
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <ErrorBoundary>
          <SideScrollbar />
          <App />
          <ScrollToTopButton />
        </ErrorBoundary>
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
