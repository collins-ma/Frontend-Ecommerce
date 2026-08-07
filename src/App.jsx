import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate,Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import CreateProduct from "./pages/CreateProduct.jsx";

import ReturnDetails from "./pages/ReturnDetails.jsx";
import ProductsList from './pages/ProductsList';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Layout from './pages/Layout.jsx';
import AdminDashBoard from './pages/AdminDashBoard.jsx';
import UsersList from './pages/UsersList.jsx';  
import UserDetail from './pages/UserDetail.jsx';
import OrdersList from './pages/OrdersList.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import CartPage from './pages/CartPage.jsx';
import MyOrders from './pages/MyOrders.jsx';
import RequireAuth from './pages/RequireAuth.jsx';
import CheckoutPage from "./pages/CheckoutPage.jsx";
import { ROLES } from './config/roles.jsx';
import PersistLogin from "./pages/persistLogin.jsx";
import Prefetch from "./pages/Prefetch.jsx";
import SessionPage from './pages/SessionPage'
import UpdateUserProfile from './pages/UpdateUserProfile.jsx'
import VerifyPage from "./pages/VerifyPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { setNavigate } from './utils/navigation.jsx';
import SettingsLayout from "./pages/SettingsLayout.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import NetworkStatus from "./pages/NetworkStatus.jsx";
import AdminOrderDetails from "./pages/AdminOrderDetails.jsx";
import MyReturns from "./pages/MyReturns.jsx";
import AdminReturnDetails from "./pages/AdminReturnDetails.jsx";
import AdminReturns from "./pages/AdminReturns.jsx";
import Wishlist from "./pages/Wishlist.jsx"
import SuppliersPage from "./pages/SuppliersPage.jsx"
import CreateEditSupplier from "./pages/CreateEditSupplier.jsx";
import PurchaseDetails from "./pages/PurchaseDetails.jsx";
import PurchasesPage from "./pages/PurchasesPage.jsx";
import CreatePurchase from "./pages/CreatePurchase.jsx";
import CreateCategory from "./pages/CreateCategory.jsx";
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate); // store global navigate function
  }, [navigate]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
     
       <NetworkStatus />

     
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          
           <Route index element={<ProductsList />} />

        
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path ="/reset-password" element={<ResetPasswordPage/>}/>
          <Route path="/login" element={<Login />} />



          {/* Routes that require login + prefetch */}
          <Route element={<PersistLogin />}>

          <Route path="/products" element={<ProductsList />} />
           
            {/* Wrap all child routes in Prefetch */}

            <Route  element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />} >


            <Route element={<Prefetch />}>
              
              {/* User routes */}
              
              
              <Route path="/cart" element={<CartPage />} />

<Route path="/my-orders" element={<MyOrders />} />
<Route path="/wishlist" element={<Wishlist />} />

<Route path="/orders/:id" element={<OrderDetail />} />
<Route
  path="/returns/:id"
  element={<ReturnDetails />}
/>

<Route path="/checkout" element={<CheckoutPage/>}/>
<Route
 path="/my-returns"
 element={<MyReturns />}
/>
               <Route path="/change-profile" element={<UpdateUserProfile/>}/>
              <Route path="/settings" element={<SettingsLayout />}>
             
             <Route index element={<SettingsPage />} />
             <Route path="change-password" element={<ChangePassword />} />
             <Route path="sessions" element={<SessionPage />} />
            </Route>

              {/* Protected Admin Routes */}
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="/admin/dashboard" element={<AdminDashBoard />} /><Route
  path="purchases"
  element={<PurchasesPage />}
/>

<Route
  path="purchases/new"
  element={<CreatePurchase />}
/>

<Route
  path="purchases/:id"
  element={<PurchaseDetails />}
/>

                <Route path="/users" element={<UsersList />} />
                <Route
  path="/admin/suppliers/:id/edit"
  element={<CreateEditSupplier />}
/>
                   <Route path="/suppliers" element={<SuppliersPage />} /><Route
  path="/admin/suppliers/new"
  element={<CreateEditSupplier />}
/>

   
                  <Route
        path="/admin/orders/:id"
        element={<AdminOrderDetails />}
    />
                <Route path="/users/:userId" element={<UserDetail />} />
                <Route path="/create-product" element={<CreateProduct/>}/>
              </Route>

              {/* Protected Orders Routes */}
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="/admin/orders" element={<OrdersList />} />

                <Route
  path="/admin/returns"
  element={<AdminReturns />}
/>

 <Route
    path="/admin/categories/create"
    element={<CreateCategory />}
  />
 
             <Route
  path="/admin/returns/:id"
  element={<AdminReturnDetails />}
/>
             
              </Route>

            </Route>
          </Route>
          </Route>
          

        </Route>
      </Routes>
   
    </>
  );
}

export default App;
