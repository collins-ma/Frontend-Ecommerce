import React, { useState, useEffect } from "react";
import { useInitiatePaymentMutation } from "../features/payment/paymentApiSlice";
import { useGetOrderStatusQuery } from "../features/orders/ordersApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function CheckoutPage() {

  useDocumentTitle("checkout");

  const { username } = useAuth();
  const navigate = useNavigate();


  const [
    initiatePayment,
    {
      isLoading: isPaying,
      error: paymentError,
    },
  ] = useInitiatePaymentMutation();



  const [shippingName, setShippingName] =
    useState(username || "");

  const [shippingStreet, setShippingStreet] =
    useState("");

  const [shippingCity, setShippingCity] =
    useState("");

  const [shippingZip, setShippingZip] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");



  const [checkoutMethod, setCheckoutMethod] =
    useState("mpesa");



  const [currentOrderId, setCurrentOrderId] =
    useState(null);


  const [orderStatus, setOrderStatus] =
    useState(null);



  useEffect(() => {

    if(username){
      setShippingName(username);
    }

  },[username]);





  // Poll payment status

  const {
    data: orderStatusData
  } = useGetOrderStatusQuery(currentOrderId,{

    skip: !currentOrderId,

    pollingInterval:4000,

  });





  useEffect(()=>{

    if(orderStatusData?.paymentStatus){

      setOrderStatus(
        orderStatusData.paymentStatus
      );

    }

  },[orderStatusData]);







  // Redirect after successful payment

  useEffect(()=>{


    if(orderStatus === "paid"){


      setTimeout(()=>{

        navigate("/my-orders");

      },2000);


    }


  },[
    orderStatus,
    navigate
  ]);







  const handlePayment = async()=>{


    if(
      !shippingStreet ||
      !shippingCity ||
      !shippingZip
    ){

      return;

    }



    if(
      checkoutMethod === "mpesa" &&
      !phoneNumber
    ){

      return;

    }



    try{


      const response =
        await initiatePayment({

          checkoutMethod,


          phoneNumber:
            checkoutMethod === "mpesa"
            ? phoneNumber
            : undefined,



          shippingAddress:{


            name:shippingName,


            street:shippingStreet,


            city:shippingCity,


            zip:shippingZip,


            phone:phoneNumber,


          },


        }).unwrap();





      if(
        response.checkoutMethod === "mpesa"
      ){


        setCurrentOrderId(
          response.orderId
        );


        setOrderStatus("pending");


      }
      else{


        // Cash on delivery

        setOrderStatus("pending");


        setTimeout(()=>{

          navigate("/my-orders");

        },2000);


      }



    }catch(error){


      console.error(error);


      setOrderStatus("failed");


    }


  };








return (

<div
className="
min-h-screen
bg-gray-50
dark:bg-gray-900
flex
items-center
justify-center
py-10
px-4
"
>


<div
className="
w-full
max-w-md
bg-white
dark:bg-gray-800
rounded-2xl
shadow-lg
p-6
"
>


<h1
className="
text-3xl
font-bold
text-center
mb-6
dark:text-white
"
>
Checkout
</h1>




{
paymentError?.data?.message && (

<div
className="
bg-red-100
text-red-700
p-3
rounded-lg
mb-4
"
>
{paymentError.data.message}
</div>

)
}







{
orderStatus === "pending" && (

<p
className="
text-blue-600
text-center
mb-4
"
>
Processing payment...
</p>

)

}



{
orderStatus === "paid" && (

<p
className="
text-green-600
text-center
mb-4
"
>
Payment successful. Redirecting...
</p>

)

}



{
orderStatus === "failed" && (

<p
className="
text-red-600
text-center
mb-4
"
>
Payment failed.
</p>

)

}







<div className="space-y-3">



<input

value={shippingName}

readOnly

className="
w-full
border
rounded-lg
px-3
py-2
bg-gray-100
dark:bg-gray-700
dark:text-white
"

/>





<input

placeholder="Street"

value={shippingStreet}

onChange={(e)=>
setShippingStreet(e.target.value)
}

className="
w-full
border
rounded-lg
px-3
py-2
dark:bg-gray-700
dark:text-white
"

/>






<input

placeholder="City"

value={shippingCity}

onChange={(e)=>
setShippingCity(e.target.value)
}

className="
w-full
border
rounded-lg
px-3
py-2
dark:bg-gray-700
dark:text-white
"

/>







<input

placeholder="Zip Code"

value={shippingZip}

onChange={(e)=>
setShippingZip(e.target.value)
}

className="
w-full
border
rounded-lg
px-3
py-2
dark:bg-gray-700
dark:text-white
"

/>








<div className="mt-4">


<p
className="
font-medium
mb-2
dark:text-white
"
>
Payment Method
</p>





<label
className="
flex
gap-2
items-center
dark:text-white
mb-2
"
>


<input

type="radio"

value="mpesa"

checked={
checkoutMethod==="mpesa"
}

onChange={(e)=>
setCheckoutMethod(e.target.value)
}

/>


M-Pesa

</label>







<label
className="
flex
gap-2
items-center
dark:text-white
"
>


<input

type="radio"

value="cash_on_delivery"

checked={
checkoutMethod==="cash_on_delivery"
}

onChange={(e)=>
setCheckoutMethod(e.target.value)
}

/>


Cash On Delivery


</label>


</div>








{
checkoutMethod==="mpesa" && (

<input

type="tel"

placeholder="Phone Number (+2547xxxxxxxx)"

value={phoneNumber}

onChange={(e)=>
setPhoneNumber(e.target.value)
}

className="
w-full
border
rounded-lg
px-3
py-2
dark:bg-gray-700
dark:text-white
"

/>

)

}





</div>








<button

onClick={handlePayment}

disabled={
isPaying ||
orderStatus==="pending"
}

className="
mt-6
w-full
bg-green-600
hover:bg-green-700
text-white
py-3
rounded-lg
font-semibold
disabled:opacity-50
"

>


{
isPaying ||
orderStatus==="pending"

?

"Processing..."

:

checkoutMethod==="mpesa"

?

"Pay with M-Pesa"

:

"Place Order"

}


</button>





</div>


</div>


);


}