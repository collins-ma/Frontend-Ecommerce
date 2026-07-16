import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "../auth/authApiSlice"
import usePersist from "../hooks/usePersist"
import { useSelector,useDispatch } from 'react-redux'
import { selectCurrentToken,setRefreshing } from "../auth/authSlice"
import { LoaderCircle } from "lucide-react";
import React from 'react'
import { Navigate } from "react-router-dom"
const PersistLogin = () => {

    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const dispatch=useDispatch()

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()


    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== 'development')
             { // React 18 Strict Mode
             
            const verifyRefreshToken = async () => {
                   dispatch(setRefreshing(true))
               
                try {
                      
                    const response = 
                    await refresh()

                    const { accessToken } = response.data
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }

                finally{

                    dispatch(setRefreshing(false))
                }
            }

            if (!token && persist)

                
                     verifyRefreshToken()
                
              
        }

        else {
    dispatch(setRefreshing(false));
}

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])


    let content
   
    if (!persist) {
    content=<Outlet/>
}
    else if (isLoading) {
  content = (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <LoaderCircle className="w-6 h-6 text-green-600 animate-spin" />
    </div>
  );

    } else if (isError) { //persist: yes, token: no
   
         // Refresh failed.
    // User is simply treated as a guest.
    content = <Outlet />;
//    content = (
//   <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
//     <p className="text-red-600 font-medium">
//       {(error?.data?.message ?? "Your session has expired. Please log in again.")}{" - "}
//       <Link
//         to="/login"
//         className="text-blue-600 hover:underline font-semibold"
//       >
//         Login
//       </Link>
//     </p>
//   </div>
// );
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
     
        content = <Outlet />
    }

    return content
}
export default PersistLogin