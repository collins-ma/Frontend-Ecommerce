import React from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useCancelOrderMutation } from "../features/orders/ordersApiSlice";

import AdminCancelOrderModal from "../components/orders/admin/AdminCancelModal";
import { useGetOrderByIdQuery,   useUpdateOrderStatusMutation,
  useRecordCashPaymentMutation,
  useRecordMpesaPaymentMutation,
  useCompleteRefundMutation, } from "../features/orders/ordersApiSlice";



import CustomerCard from "../components/orders/admin/CustomerCard";
import PaymentCard from "../components/orders/admin/PaymentCard";
import OrderItemsCard from "../components/orders/admin/OrderItemsCard";
import OrderTimeline from "../components/orders/admin/OrderTimeline";
import OrderActions from "../components/orders/admin/OrderActions";
import OrderHeader from "../components/orders/admin/OrderHeader";
import MpesaPaymentModal from "../components/orders/admin/MpesaPaymentModal";
import RefundModal from "../components/orders/admin/RefundModal";



const AdminOrderDetails=()=>{

    const { id } = useParams();

    const {
    data: order,
    isLoading,
    isError,
    error,
} = useGetOrderByIdQuery(id);

const [updateOrderStatus,
{
    isLoading: updatingStatus,
}] = useUpdateOrderStatusMutation();

const [recordCashPayment,
{
    isLoading: recordingCash,
}] = useRecordCashPaymentMutation();

const [
    cancelOrder,
    {
        isLoading: cancelling
    }
] = useCancelOrderMutation();

const [recordMpesaPayment,
{
    isLoading: recordingMpesa,
}] = useRecordMpesaPaymentMutation();

const [completeRefund,
{
    isLoading: refunding,
}] = useCompleteRefundMutation();


const loading =
    updatingStatus ||
    recordingCash ||
    recordingMpesa ||
    refunding ||
    cancelling;


const navigate = useNavigate();

    const [showMpesaModal, setShowMpesaModal] =
    useState(false);

const [showRefundModal, setShowRefundModal] =
    useState(false);

    const [showCancelModal, setShowCancelModal] =
useState(false);

    const handleUpdateStatus = async (status) => {
    try {

        await updateOrderStatus({
            id,
            status,
        }).unwrap();

    } catch (err) {
        console.error(err);
    }
};

const handleRecordCashPayment = async () => {
    try {

        await recordCashPayment(id).unwrap();

    } catch (err) {
        console.error(err);
    }
};


const handleRecordMpesaPayment = async (transactionId) => {
  try {
    await recordMpesaPayment({
      id,
      transactionId,
    }).unwrap();

    setShowMpesaModal(false);
  } catch (err) {
    console.error(err);
  }
};

const handleRefund = async (data) => {

    try {

        await completeRefund({
            id,
            ...data,
        }).unwrap();

        setShowRefundModal(false);

    } catch (err) {
        console.error(err);
    }

};
const handleCancelOrder = async(data)=>{

    try{

        await cancelOrder({
            id,
            ...data
        }).unwrap();


        setShowCancelModal(false);


    }catch(err){

        console.error(err);

    }

;

};

if (isLoading) {
    return <div>Loading...</div>;
}
if (isError) {
    return (
        <div>
            Failed to load order.
        </div>
    );
}

return (
  <div className="max-w-7xl mx-auto p-6 space-y-6">

    <OrderHeader order={order} />

    <div className="grid lg:grid-cols-2 gap-6">
      <CustomerCard order={order} />
      <PaymentCard order={order} />
    </div>

    <OrderItemsCard items={order.items} />

    <OrderTimeline order={order} />

    
    <OrderActions
  order={order}
  loading={loading}

  onUpdateStatus={handleUpdateStatus}

  onRecordCashPayment={
    handleRecordCashPayment
  }

  onOpenMpesaModal={() =>
    setShowMpesaModal(true)
  }

  onOpenRefundModal={() =>
    setShowRefundModal(true)
  }

  onOpenCancelModal={() =>
    setShowCancelModal(true)
  }
/>


    <MpesaPaymentModal
      isOpen={showMpesaModal}
      loading={loading}
      onClose={() => setShowMpesaModal(false)}
      onConfirm={handleRecordMpesaPayment}
    />

    <RefundModal
      isOpen={showRefundModal}
      loading={loading}
      onClose={() => setShowRefundModal(false)}
      onConfirm={handleRefund}
    />

<AdminCancelOrderModal

  isOpen={showCancelModal}

  loading={loading}

  onClose={() =>
    setShowCancelModal(false)
  }

  onConfirm={handleCancelOrder}

/>

  </div>
);
 
}

export default AdminOrderDetails