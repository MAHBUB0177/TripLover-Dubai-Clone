import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../Loading/Loading';
import nodata from "../../../images/flight.png";
import { Center } from '@chakra-ui/react';

const NoDataFoundPage = ({loading}) => {
  // const loading = false;
    return (
      <>
      <Loading loading={loading}></Loading>
      <Center>
        <img
          src={nodata}
          className="img-fluid"
          alt="no data found"
          width={"500px"}
          height={"500px"}
        />
        {/* <p className="fs-4 my-2 fw-bold text-center">No flight found!</p> */}
        <div className="pb-5">
          {/* <Link to="/search" className="btn btn-primary">
            Please Search Again
          </Link> */}
        </div>
      </Center>
      </>
    );
};

export default NoDataFoundPage;