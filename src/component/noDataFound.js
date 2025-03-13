import { Center } from '@chakra-ui/react';
import React from 'react'
import { IoMdWarning } from "react-icons/io";
const NoDataFound = () => {
    return (
        <Center>
            <div className='row'>
                <div className='col-lg-12 text-center m-2 p-3'>
                    <div className="d-flex justify-content-center">
                        <IoMdWarning
                            style={{
                                color: "white",
                                height: "60px",
                                width: "60px",
                                fontWeight: "bold",
                                display: "flex",
                                alignContent: "center",
                                justifyContent: "center",
                                backgroundColor: "#7c04c0",
                                padding: "15px",
                                borderRadius: "25px"
                            }}
                        />
                    </div>
                    <h5 class='p-2 rounded my-1 fw-bold' style={{ fontSize: "15px" }}>
                        No data found
                    </h5>
                </div>
            </div>
        </Center>
    )
}

export default NoDataFound