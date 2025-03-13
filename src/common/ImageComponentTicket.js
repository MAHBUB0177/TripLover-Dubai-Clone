import React, { useEffect, useState } from "react";
import { environment } from "../Pages/SharePages/Utility/environment";

const ImageComponentTicket = ({ logo }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      const imageUrl = `${
        environment.s3ArliensImage
      }${logo}.png?timestamp=${new Date().getTime()}`; // Cache-busting mechanism

      try {
        setLoading(true);
        setError(false);

        const response = await fetch(imageUrl, {
          method: "GET",
          headers: {
            // Add necessary headers if needed
          },
          mode: "cors", // Ensure this is set properly depending on your server's CORS policy
          credentials: "same-origin",
        });

        if (response.ok) {
          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);
          setImageSrc(objectURL); // Set image URL if fetch is successful
        } else {
          setError(true); // Set error state if fetch fails
          console.error(
            `Failed to load image: ${response.status} ${response.statusText}`
          );
        }
      } catch (err) {
        setError(true);
        console.error("Error fetching image:", err);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [logo]); // Re-run the effect when the logo prop changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to load image</div>;
  }

  return (
    <img
      src={imageSrc || `${environment.s3ArliensImage}${logo}.png`} // Fallback to the direct URL if fetching fails
      alt={logo}
      width="30px"
      height="30px"
      crossOrigin="use-credentials" // Make sure this matches the server's CORS setup
    />
  );
};

export default ImageComponentTicket;
