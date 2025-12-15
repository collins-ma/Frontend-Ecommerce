import { store } from '../app/store';
import React from 'react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { usersApiSlice } from '../features/users/usersApiSlice';
import { productsApiSlice } from '../features/products/productsApiSlice';
import { cartApiSlice } from '../features/cart/cartApiSlice';
import { ordersApiSlice } from '../features/orders/ordersApiSlice';
import useAuth from '../hooks/useAuth';




const Prefetch = () => {

    const {isAdmin, isUser}=useAuth()
  

    useEffect(() => {

    
            if(isAdmin){
        
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
            }
        
        if(isUser||isAdmin){
        store.dispatch(productsApiSlice.util.prefetch('getProducts', 'productsList', { force: true }))
        }

        if(isAdmin){
        store.dispatch(ordersApiSlice.util.prefetch('getOrders', 'ordersList', { force: true }))
        }

        if(isUser){
        
        store.dispatch(cartApiSlice.util.prefetch('getCart', 'cartList', { force: true }))

        store.dispatch(ordersApiSlice.util.prefetch('getMyOrders','myOrdersList',{force:true}))
        }
        
    }, [])

    return <Outlet />
}
export default Prefetch