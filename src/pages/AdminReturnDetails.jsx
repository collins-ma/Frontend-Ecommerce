import React from "react";
import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

import useDocumentTitle from "../hooks/useDocumentTitle";

import { toast } from "react-hot-toast";
import { useState } from "react";

import {
  useGetReturnByIdQuery,
  useApproveReturnMutation,
  useRejectReturnMutation,
  useReceiveReturnedItemMutation,
  useRefundReturnMutation,
} from "../features/returns/returnsApiSlice";



export default function AdminReturnDetails() {


  useDocumentTitle("Return Details");


  const { id } = useParams();

  const [refundChannel, setRefundChannel] = useState("");




  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetReturnByIdQuery(id);





  const [
    approveReturn,
    {
      isLoading: approving,
      error: approveError
    }

  ] = useApproveReturnMutation();





  const [
    rejectReturn,
    {
      isLoading: rejecting,
      error: rejectError
    }

  ] = useRejectReturnMutation();






  const [
    receiveReturnedItem,
    {
      isLoading: receiving,
      error: receiveError
    }

  ] = useReceiveReturnedItemMutation();







  const [
    refundReturn,
    {
      isLoading: refunding,
      error: refundError
    }

  ] = useRefundReturnMutation();







  const handleApprove = async()=>{

    try{

      await approveReturn(id).unwrap();

    toast.success(
      "Return approved successfully"
    );
    }
    catch(err){

       toast.error(
      err?.data?.message ||
      "Failed to approve return"
    );


    }

  };








  const handleReject = async()=>{


    const reason =
      window.prompt(
        "Enter rejection reason"
      );


    if(!reason) return;



    try{


      await rejectReturn({

        id,

        rejectedReason:reason,

        adminNotes:"Rejected by admin"

      }).unwrap();
      


    }
    catch(err){
toast.error(
   err?.data?.message ||
   "Failed to reject return"
 );

    }


  };









  const handleReceive = async()=>{


    try{


      await receiveReturnedItem({

        id,

        adminNotes:"Item received"

      }).unwrap();



    }
    catch(err){

       toast.error(
   err?.data?.message ||
   "Failed to receive item"
 );


    }


  };




const handleRefund = async () => {

  if (!refundChannel) {

    toast.error("Please select refund method");

    return;

  }

  let txId = null;

  if (refundChannel === "mpesa") {

    txId = window.prompt(
      "Enter M-Pesa transaction ID"
    );

    if (!txId) return;

  }

  try {

    await refundReturn({

      id,

      refundChannel,

      transactionId: txId,

    }).unwrap();

    toast.success(
      "Refund completed successfully"
    );

    setRefundChannel("");

  } catch (err) {

    toast.error(
      err?.data?.message ||
      "Refund failed"
    );

  }

};












  if(isLoading){

    return (

      <div className="
      flex
      justify-center
      items-center
      min-h-screen
      ">

        <PulseLoader color="#2563EB"/>

      </div>

    );

  }







  if(isError){

    return (

      <div className="
      text-center
      mt-10
      text-red-600
      ">

      {
        error?.data?.message
        ||
        "Failed to load return"
      }

      </div>

    );

  }







  const returnRequest = data.return;

  const order = returnRequest.order;

  const customer = returnRequest.customer;






  return (

<div className="
min-h-screen
bg-gray-100
dark:bg-gray-900
p-6
">


<div className="
max-w-6xl
mx-auto
">






{/* HEADER */}


<Section title="Return Details">


<div className="
flex
justify-between
items-center
">


<div>


<h1 className="
text-3xl
font-bold
dark:text-white
">


Return #
{
returnRequest._id
.slice(-6)
.toUpperCase()
}


</h1>


<p className="text-gray-500 mt-2">


Requested:

{
new Date(
returnRequest.createdAt
)
.toLocaleDateString()
}


</p>


</div>



<ReturnStatusBadge
status={returnRequest.status}
/>



</div>


</Section>









{/* CUSTOMER */}


<Section title="Customer Information">


<div className="
grid
md:grid-cols-3
gap-6
">


<InfoRow
label="Name"
value={customer?.username}
/>



<InfoRow
label="Email"
value={customer?.email}
/>



<InfoRow
label="Phone"
value={customer?.phoneNumber}
/>



</div>


</Section>









{/* ORDER */}


<Section title="Order Information">


<div className="
grid
md:grid-cols-4
gap-6
">


<InfoRow
label="Order"
value={
`#${order._id.slice(-8)}`
}
/>



<InfoRow
label="Total"
value={
`KSh ${order.total}`
}
/>



<InfoRow
label="Status"
value={
order.orderStatus
}
/>



<InfoRow
label="Payment"
value={
order.paymentStatus
}
/>



</div>


</Section>









{/* PRODUCTS */}


<Section title="Products">


<div className="space-y-5">


{

order.items.map(item=>(


<div
key={item._id}
className="
flex
gap-5
border-b
pb-5
"
>


<img

src={item.product?.image}

className="
w-20
h-20
rounded-xl
object-cover
"

/>



<div>


<h3 className="
font-bold
dark:text-white
">

{
item.product?.name
}

</h3>


<p>

Quantity:
{
item.quantity
}

</p>


<p className="text-green-600">


KSh
{
item.product?.priceKsh
}


</p>


</div>


</div>


))

}



</div>


</Section>









{/* RETURN INFO */}


<Section title="Return Information">


<div className="
grid
md:grid-cols-2
gap-6
">


<InfoRow
label="Reason"
value={
returnRequest.reason
}
/>



<InfoRow
label="Status"
value={
returnRequest.status
}
/>



<InfoRow
label="Admin Notes"
value={
returnRequest.adminNotes
}
/>



<InfoRow
label="Refund Channel"
value={
returnRequest.refundChannel
}
/>


</div>


</Section>









{/* ACTIONS */}


<Section title="Actions">


<div className="
flex
gap-4
flex-wrap
">

<div className="mb-6">


<label className="
block
text-sm
font-semibold
mb-2
dark:text-white
">

Refund Method

</label>



<select

value={refundChannel}

onChange={(e)=>
  setRefundChannel(e.target.value)
}

className="
border
rounded-lg
p-2
dark:bg-gray-700
"

>

<option value="">
Select method
</option>


<option value="mpesa">
M-Pesa
</option>


<option value="cash">
Cash
</option>


</select>






</div>

{
returnRequest.status === "requested"
&&
<>


<button

onClick={handleApprove}

disabled={approving}

className="
bg-blue-600
text-white
px-5
py-2
rounded-xl
"
>

{
approving
?
"Approving..."
:
"Approve"
}


</button>





<button

onClick={handleReject}

disabled={rejecting}

className="
bg-red-600
text-white
px-5
py-2
rounded-xl
"
>


{
rejecting
?
"Rejecting..."
:
"Reject"
}


</button>



</>

}







{
returnRequest.status === "approved"

&&

<button

onClick={handleReceive}

disabled={receiving}

className="
bg-purple-600
text-white
px-5
py-2
rounded-xl
"

>

{
receiving
?
"Receiving..."
:
"Receive Item"
}


</button>


}








{
returnRequest.status === "item_received"

&&


<button

onClick={handleRefund}

disabled={refunding}

className="
bg-green-600
text-white
px-5
py-2
rounded-xl
"

>

{
refunding
?
"Refunding..."
:
"Complete Refund"
}


</button>


}



</div>



</Section>





</div>


</div>


);

}










function Section({title,children}){


return (

<div className="
bg-white
dark:bg-gray-800
rounded-2xl
shadow
p-6
mb-6
">


<h2 className="
text-xl
font-bold
dark:text-white
mb-6
">

{title}

</h2>


{children}


</div>


);


}









function InfoRow({label,value}){


return (

<div>


<p className="text-gray-500 text-sm">

{label}

</p>


<p className="
font-semibold
dark:text-white
mt-1
">

{
value || "-"
}

</p>


</div>


);


}









function ReturnStatusBadge({status}){


const colors={

requested:
"bg-yellow-100 text-yellow-700",

approved:
"bg-blue-100 text-blue-700",

item_received:
"bg-purple-100 text-purple-700",

refunded:
"bg-green-100 text-green-700",

rejected:
"bg-red-100 text-red-700",

};



return (

<span className={`
px-4
py-2
rounded-full
font-semibold
capitalize
${colors[status]}
`}>

{
status.replaceAll("_"," ")
}

</span>


);


}