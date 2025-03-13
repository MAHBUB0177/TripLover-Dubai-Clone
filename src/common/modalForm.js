import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React from 'react'

function ModalForm({ isOpen, onClose, getTableData, children, title, size, scrollBehavior,bg,boxShadow, ...props }) {
    return (
        <>
            <Modal {...props} closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose} size={size ?? "5xl"} scrollBehavior={scrollBehavior}>
                <ModalOverlay />
                <ModalContent bg={ bg && bg} boxShadow={boxShadow && boxShadow} >
                    {title && <Box borderBottom='2px solid #bbc5d3'>
                        <ModalHeader >{title}</ModalHeader>
                        <ModalCloseButton />
                    </Box> }
                    <ModalBody>
                        {children}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalForm