import React, { useEffect, useState } from "react";
import { TiArrowSortedUp } from "react-icons/ti";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 50) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <div
          className="button-secondary-color d-flex justify-content-center p-2  align-items-center bounce"
          onClick={scrollToTop}
        >
          <TiArrowSortedUp
            style={{ fontSize: "20px", color: "white" }}
          />
        </div>
      )}
    </>
  );
};

export default ScrollToTopButton;
