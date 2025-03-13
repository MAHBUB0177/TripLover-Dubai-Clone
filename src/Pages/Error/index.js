import React, { useEffect } from 'react'
import useAuth from '../../hooks/useAuth';
import { IoMdWarning } from "react-icons/io";
import { Center, useDisclosure } from '@chakra-ui/react';
import ModalForm from '../../common/modalForm';
const Error = () => {
    const { setLoading } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    useEffect(() => {
        setLoading(false);
        onOpen();
    }, [])
    return (

        <ModalForm isOpen={isOpen} onClose={onClose} size={'sm'}>
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
                                    backgroundColor: "red",
                                    padding: "15px",
                                    borderRadius: "25px"
                                }}
                            />
                        </div>

                        <h5 class='p-2 rounded text-danger my-1'>
                            No network connection
                        </h5>
                        {/* <div className='mt-1'>
                            <button
                                type='button'
                                class='btn button-color rounded text-white w-100'
                                onClick={() => {
                                    onClose();
                                    window.location.href = '/';
                                }}
                            >
                                Close
                            </button>
                        </div> */}
                    </div>
                </div>
            </Center>
        </ModalForm>
    )
}

export default Error