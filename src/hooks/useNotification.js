import React, { useEffect, useState } from 'react'

function useNotification() {
  const [notificationCount, setNotificationCount] = useState();

  useEffect(()=>{
    setNotificationCount(JSON.parse(localStorage.getItem("notificationCount")))
  })

  return {
    setNotificationCount,
    notificationCount
  }
}

export default useNotification