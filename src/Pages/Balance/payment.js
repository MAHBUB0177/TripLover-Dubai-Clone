import { Center, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../SharePages/Navbar/Navbar';
import SideNavBar from '../SharePages/SideNavBar/SideNavBar';
import Footer from '../SharePages/Footer/Footer';

const Payment = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = [];
  searchParams.forEach((value, key) => {
    params.push([key, value]);
  });

  const statusCode = params[0][0].split('/')[0];
  const code = params[0][1]
  const trackingId = searchParams.get('trackingId');
  const paymentOrderId = searchParams.get('paymentOrderId');


  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/search');
  };

  return (
    <>
      <Navbar></Navbar>
      <SideNavBar></SideNavBar>
      <Center minH={"calc(100vh - 100px)"}>
        <VStack
          bg={"white"}
          boxShadow="0px 5px 15px rgba(204, 204, 204, 0.3)"
          borderRadius={"lg"}
          px={"40px"}
          py={"50px"}
          zIndex={50}
        >
          <h1
            className={`font-bold text-[20px] ${statusCode === 'PaymentFailed' || statusCode === 'PaymentCancel' ? 'text-[#ED3675]' : 'text-[#0F9B48]'}`}>
            {statusCode === 'PaymentFailed' ? 'Payment Failed' : (statusCode === 'PaymentCancel' ? 'Payment Cancel' : (statusCode === 'PaymentSuccess' ? 'Payment Successful' : ''))}

          </h1>
          <p className={"pt-3"}>Tracking ID: {trackingId}</p>
          <p>payment Order Id: {paymentOrderId}</p>
          <p>Status Code: {code}</p>
          <p className={'pt-5'}>
            For any query Please contact with Triplover Support Team
          </p>

          <div className={'pt-4'}>
            <button
              onClick={handleGoBack}
              className="button-color text-white font-bold py-3 px-5 border-radius"
            >
              Back To Search
            </button>
          </div>
        </VStack>
      </Center>
      <Footer></Footer>
    </>
  )
}

export default Payment