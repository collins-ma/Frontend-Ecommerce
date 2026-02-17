import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ShopVista from './pages/ShopVista';
import ProductsList from './pages/ProductsList';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Layout from './pages/Layout.jsx';
import AdminDashBoard from './pages/AdminDashBoard.jsx';
import UsersList from './pages/UsersList.jsx';
import UserDetail from './pages/userDetail.jsx';
import OrdersList from './pages/OrdersList.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import CartPage from './pages/CartPage.jsx';
import MyOrders from './pages/MyOrders.jsx';
import RequireAuth from './pages/RequireAuth.jsx';
import { ROLES } from './config/roles.jsx';
import PersistLogin from "./pages/persistLogin.jsx";
import Prefetch from "./pages/Prefetch.jsx";
import SessionPage from './pages/SessionPage'
import VerifyPage from "./pages/VerifyPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { setNavigate } from './utils/navigation.jsx';
import SettingsLayout from "./pages/SettingsLayout.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate); // store global navigate function
  }, [navigate]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
     

     
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/" element={<ShopVista />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/login" element={<Login />} />

          {/* Routes that require login + prefetch */}
          <Route element={<PersistLogin />}>
            {/* Wrap all child routes in Prefetch */}

            <Route  element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />} >


            <Route element={<Prefetch />}>
              
              {/* User routes */}
              <Route path="/products" element={<ProductsList />} />
              
              <Route path="/cart" element={<CartPage />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/settings" element={<SettingsLayout />}>
             <Route index element={<SettingsPage />} />
             <Route path="change-password" element={<ChangePassword />} />
             <Route path="sessions" element={<SessionPage />} />
            </Route>

              {/* Protected Admin Routes */}
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="/admin/dashboard" element={<AdminDashBoard />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/users/:userId" element={<UserDetail />} />
              </Route>

              {/* Protected Orders Routes */}
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                <Route path="/admin/orders" element={<OrdersList />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
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
