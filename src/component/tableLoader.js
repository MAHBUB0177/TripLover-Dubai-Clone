import { Center, Spinner } from '@chakra-ui/react'
import React from 'react'

const TableLoader = () => {
  return (
    <Center w="100%" py="50px">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="red.500"
      size="xl"
    />
  </Center>
  )
}

export default TableLoader