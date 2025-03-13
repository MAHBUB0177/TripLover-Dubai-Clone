import React, { useEffect, useState } from "react";
import { environment } from "../Pages/SharePages/Utility/environment";

const ImageComponentForAgent = ({ logo }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!logo) {
      setError(true);
      setLoading(false);
      console.error("Logo is undefined or empty");
      return; // Early return if the logo is invalid
    }

    const loadImage = async () => {
      const imageUrl = `${
        environment.s3URL
      }${logo}?timestamp=${new Date().getTime()}`; // Cache busting
      console.log(`Fetching image from: ${imageUrl}`);

      try {
        setLoading(true);
        setError(false);

        const response = await fetch(imageUrl, {
          method: "GET",
          headers: {},
          mode: "cors",
          credentials: "same-origin", // or "include" based on your needs
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
      } catch (error) {
        setError(true);
        console.error("Error fetching image:", error);
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
      src={imageSrc || `${environment.s3URL}${logo}`} // Fallback to the direct URL if fetching fails
      alt={logo}
      width="160px"
      crossOrigin="use-credentials" // Ensure this matches your CORS setup
    />
  );
};

export default ImageComponentForAgent;
