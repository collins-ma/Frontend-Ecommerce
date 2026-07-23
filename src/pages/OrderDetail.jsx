import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiPackage,
  FiCreditCard,
  FiMapPin,
  FiXCircle,
} from "react-icons/fi";

import useDocumentTitle from "../hooks/useDocumentTitle";

import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} from "../features/orders/ordersApiSlice";

import CancelOrderModal from "../components/CancelOrderModal";


export default function OrderDetail() {


  useDocumentTitle("Order Details");


  const { id } = useParams();

  const navigate = useNavigate();


  const [showCancelModal, setShowCancelModal] = useState(false);



  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetOrderByIdQuery(id);




  const [
    cancelOrder,
    {
      isLoading: isCancelling
    }
  ] = useCancelOrderMutation();





  const handleCancel = async(reason)=>{


    console.log("CANCEL REASON:", reason);


    try {


      await cancelOrder({
        id,
        reason
      }).unwrap();



      setShowCancelModal(false);



    } catch(error){

      console.log(error);

    }


  };







  if(isLoading){

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        Loading order details...

      </div>

    );

  }






  if(isError || !order){

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-red-600
      ">

        {
          error?.data?.message ||
          "Failed to load order"
        }

      </div>

    );

  }







  // customer can cancel only pending and processing

  const canCancel =
    order.orderStatus?.toLowerCase() === "pending" ||
    order.orderStatus?.toLowerCase() === "processing";







  const orderColors = {


    pending:
      "bg-yellow-100 text-yellow-700",

    confirmed:
      "bg-blue-100 text-blue-700",

    processing:
      "bg-purple-100 text-purple-700",

    shipped:
      "bg-indigo-100 text-indigo-700",

    delivered:
      "bg-green-100 text-green-700",

    cancelled:
      "bg-red-100 text-red-700",


  };







  const paymentColors = {


    pending:
      "bg-yellow-100 text-yellow-700",

    paid:
      "bg-green-100 text-green-700",

    failed:
      "bg-red-100 text-red-700",

    refund_pending:
      "bg-orange-100 text-orange-700",

    refunded:
      "bg-green-100 text-green-700",


  };









return (

<div className="
min-h-screen
bg-gray-50
dark:bg-gray-900
p-5 md:p-10
">







<button

onClick={()=>navigate("/my-orders")}

className="
flex
items-center
gap-2
bg-green-600
hover:bg-green-700
text-white
px-4
py-2
rounded-xl
mb-6
"

>

<FiArrowLeft/>

Back To Orders

</button>









<div className="
max-w-5xl
mx-auto
bg-white
dark:bg-gray-800
rounded-3xl
shadow-lg
p-6
">







{/* HEADER */}


<div className="
flex
flex-col
md:flex-row
justify-between
gap-4
">



<div>

<p className="text-gray-500">

Order Number

</p>



<h1 className="
text-2xl
font-bold
dark:text-white
">

#{order._id.slice(-8).toUpperCase()}

</h1>


</div>





<div className="flex gap-3">



<span

className={`
px-3
py-2
rounded-full
font-semibold
text-sm
${orderColors[order.orderStatus]}
`}

>

{order.orderStatus}

</span>





<span

className={`
px-3
py-2
rounded-full
font-semibold
text-sm
${paymentColors[order.paymentStatus]}
`}

>

{order.paymentStatus}

</span>



</div>



</div>









{/* ITEMS */}


<div className="mt-8">


<h2 className="
font-bold
dark:text-white
flex
items-center
gap-2
">

<FiPackage/>

Items

</h2>




<div className="mt-4 space-y-3">


{

order.items.map((item,index)=>(


<div

key={index}

className="
flex
justify-between
bg-gray-100
dark:bg-gray-700
rounded-xl
p-4
"

>


<div>


<p className="
font-semibold
dark:text-white
">

{item.product?.name || "Product"}

</p>



<p className="text-gray-500 text-sm">

Quantity: {item.quantity}

</p>


</div>




<p className="
font-bold
text-green-600
">

KSh {item.priceksh.toLocaleString()}

</p>


</div>


))

}



</div>



</div>









{/* TOTAL */}


<div className="
mt-8
border-t
pt-5
flex
justify-between
">


<span className="
font-semibold
dark:text-white
">

Total

</span>




<span className="
text-2xl
font-bold
text-green-600
">

KSh {order.total.toLocaleString()}

</span>


</div>









{/* PAYMENT */}


<div className="mt-8">


<h2 className="
font-bold
dark:text-white
flex
items-center
gap-2
">

<FiCreditCard/>

Payment

</h2>




<p className="
text-gray-600
dark:text-gray-300
mt-2
">

Method: {order.checkoutMethod}

</p>




{
order.transactionId &&

<p className="
text-gray-600
dark:text-gray-300
">

Transaction: {order.transactionId}

</p>

}



</div>









{/* SHIPPING */}


<div className="mt-8">


<h2 className="
font-bold
dark:text-white
flex
items-center
gap-2
">

<FiMapPin/>

Shipping Address

</h2>




<div className="
mt-3
text-gray-600
dark:text-gray-300
">


<p>{order.shippingAddress.name}</p>

<p>{order.shippingAddress.street}</p>

<p>{order.shippingAddress.city}</p>

<p>{order.shippingAddress.zip}</p>



{
order.shippingAddress.phone &&

<p>
{order.shippingAddress.phone}
</p>

}



</div>



</div>









{/* CANCEL BUTTON */}



{

canCancel &&


<div className="mt-10">


<button

onClick={()=>setShowCancelModal(true)}

className="
flex
items-center
gap-2
bg-red-600
hover:bg-red-700
text-white
px-5
py-3
rounded-xl
"

>


<FiXCircle/>

Cancel Order


</button>


</div>


}




</div>









{/* MODAL */}


<CancelOrderModal

isOpen={showCancelModal}

onClose={()=>setShowCancelModal(false)}

onConfirm={handleCancel}

loading={isCancelling}

/>






</div>


);


}