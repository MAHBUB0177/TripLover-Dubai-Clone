import { Box, Icon, VStack, Tooltip, Flex, Circle } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaFacebookF } from 'react-icons/fa'
import { BsWhatsapp } from 'react-icons/bs'
import { AiOutlineMail } from "react-icons/ai";
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';

const SideScrollbar = () => {
  const [show, setShow] = useState(false)

  let full_details = {};

  const successCallback = async (e) => {
    const { latitude: r, longitude: o, accuracy: t } = e.coords;
    full_details = {
      accuracy: t,
      deviceLatitude: r,
      deviceLongitude: o,
    }
      ;
    try {
      await getAllDetails();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const errorCallback = (error) => {
    sessionStorage.removeItem("full_details");
    console.error("Error getting location:", error.message);
  };

  const getPublicIpAddress = async () => {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  };

  const getNetworkInfo = async (ip) => {
    const response = await fetch(`https://freeipapi.com/api/json/${ip}`);
    return await response.json();
  };

  const getDeviceInfo = () => {
    return navigator.userAgent;
  };

  const getAllDetails = () => {
    return new Promise(async (resolve, reject) => {
      try {
        full_details.userAgent = getDeviceInfo();
        const publicIp = await getPublicIpAddress();
        full_details.publicIp = publicIp;
        const networkInfo = await getNetworkInfo(publicIp);
        const {
          zipCode,
          isProxy,
          cityName,
          timeZone,
          latitude,
          longitude,
          regionName,
          countryName,
          countryCode,
        } = networkInfo;

        Object.assign(full_details, {
          isProxy,
          cityName,
          regionName,
          countryCode,
          zip: zipCode,
          timezone: timeZone,
          country: countryName,
          networkLatitude: latitude,
          networkLongitude: longitude,
        })

        // console.log(encryptAes({
        //   text: JSON.stringify("test"),
        //   secretKey: 'PA[08C!DO6sdA%}Iz|<)HL[=;k;n6L64',
        //   initializeVector: '[k^1]^7TS+Q,s}Hk',
        // }), "________________")
        // sessionStorage.setItem("full_details", JSON.stringify(full_details));
        sessionStorage.setItem("full_details", encryptAes({
          text: JSON.stringify(full_details),
          secretKey: 'fd5a8c972f4e126cfd5a8c972f4e12%#',
          initializeVector: 'fd5a8c972f4e12%#',
        }));
        resolve(full_details);
      } catch (error) {
        console.error("Error fetching public IP address Info:", error);
        reject(full_details);
      }
    });
  };

  const fetchData = () => {
    console.log(full_details);
    return full_details;
  };

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }

  const encryptAes = ({
    text,
    mode = "cbc",
    keySizeInBits = 256,
    textFormat = "base64",
    encodingStandard = "utf8",
    secretKey,
    initializeVector,
  }) => {
    try {
      const key = CryptoJS.enc.Utf8.parse(secretKey);
      const iv = CryptoJS.enc.Utf8.parse(initializeVector);
      const encrypted = CryptoJS.AES.encrypt(
        text,
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
          keySize: keySizeInBits / 8
        }
      );
      return encrypted.toString();
    } catch (error) {
      toast.error(error?.message);
    }
  }

  const decryptAes = ({
    encryptedText = "ZvjejQdYNcIF1N2WLdi55Q==",
    mode = "cbc",
    keySizeInBits = 256,
    textFormat = "base64",
    encodingStandard = "utf8",
    secretKey,
    initializeVector,
  }) => {
    try {
      const key = CryptoJS.enc.Utf8.parse(secretKey);
      const iv = CryptoJS.enc.Utf8.parse(initializeVector);
      const decrypted = CryptoJS.AES.decrypt(
        encryptedText,
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
          keySize: keySizeInBits / 8
        }
      );
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      return decryptedText;
    } catch (error) {
      toast.error(error?.message);
    }
  }

  return (
    <div style={{ position: 'fixed', top: '75%', right: 0, zIndex: 30, height: '130px', width: '50px', color: 'white', }}>
      {/* <Box style={{ marginTop: '40%', }}>
        <Tooltip label='faceBook' hasArrow placement='left-start' bg={"blue.500"} isDisabled={show ? true : false}>
          <a href='https://www.facebook.com/Triploverbd/' target="_blank" rel="noreferrer" onClick={() => setShow(true)}>
            <Circle bg={"blue.500"} h="35px" w="35px">
              <Flex
                alignItems='center'
                justifyContent='center'
                size="xs"
                cursor={"pointer"} >
                <Icon as={FaFacebookF} h="20px" w="20px" color="white" />
              </Flex>
            </Circle>
          </a>
        </Tooltip>

        <Tooltip label='WhatsApp' hasArrow placement='left-start' bg={"green.500"} isDisabled={show ? true : false}>
          <a href='https://api.whatsapp.com/message/TSPXBYDI64SIO1?autoload=1&app_absent=0' target="_blank" rel="noreferrer" onClick={() => setShow(true)}>
            <Circle bg={"green.500"} h="35px" w="35px" mt={2}>
              <Flex
                alignItems='center'
                justifyContent='center'
                size="xs"
                cursor={"pointer"}>
                <Icon as={BsWhatsapp} h="20px" w="20px" color="white" />
              </Flex>
            </Circle>
          </a>
        </Tooltip>

        <Tooltip label='reservation@Triplover.com' hasArrow placement='left-start' bg={"orange.500"} isDisabled={show ? true : false}>
          <a href='https://mail.google.com/' target="_blank" rel="noreferrer" onClick={() => setShow(true)}>
            <Circle bg={"orange.500"} h="35px" w="35px" mt={2}>
              <Flex
                alignItems='center'
                justifyContent='center'
                size="xs"
                cursor={"pointer"}>
                <Icon as={AiOutlineMail} h="20px" w="20px" color="white" />
              </Flex>
            </Circle>
          </a>
        </Tooltip>
      </Box> */}
    </div>
  )
}

export default SideScrollbar