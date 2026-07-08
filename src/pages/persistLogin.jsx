import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "../auth/authApiSlice"
import usePersist from "../hooks/usePersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../auth/authSlice"
import PulseLoader from 'react-spinners/PulseLoader'
import React from 'react'
import { Navigate } from "react-router-dom"
const PersistLogin = () => {

    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()


    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
               
                try {
                    //const response = 
                    await refresh()
                    //const { accessToken } = response.data
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])


    let content
   
    if (!persist) {
    content=<Outlet/>
}

     else if (isLoading) { //persist: yes, token: no
     
        content = <PulseLoader color={"#FFF"} />
    } else if (isError) { //persist: yes, token: no
   
   content = (
  <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
    <p className="text-red-600 font-medium">
      {(error?.data?.message ?? "Your session has expired. Please log in again.")}{" - "}
      <Link
        to="/login"
        className="text-blue-600 hover:underline font-semibold"
      >
        Login
      </Link>
    </p>
  </div>
);
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
     
        content = <Outlet />
    }

    return content
}
export default PersistLogin