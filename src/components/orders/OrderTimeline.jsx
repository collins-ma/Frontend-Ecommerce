import {
  FiClock,
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import React from "react";

export default function OrderTimeline({ order }) {


  const steps = [
    {
      title: "Order Placed",
      date: order.createdAt,
      icon: FiClock,
      completed: true,
      color: "bg-yellow-500",
    },

    {
      title: "Confirmed",
      date: order.confirmedAt,
      icon: FiCheckCircle,
      completed: !!order.confirmedAt,
      color: "bg-blue-500",
    },

    {
      title: "Processing",
      date: order.processingAt,
      icon: FiPackage,
      completed: !!order.processingAt,
      color: "bg-purple-500",
    },

    {
      title: "Shipped",
      date: order.shippedAt,
      icon: FiTruck,
      completed: !!order.shippedAt,
      color: "bg-indigo-500",
    },

    {
      title: "Delivered",
      date: order.deliveredAt,
      icon: FiCheckCircle,
      completed: !!order.deliveredAt,
      color: "bg-green-500",
    },

  ];



  // Handle cancelled orders separately

  if(order.cancelledAt){

    steps.push({

      title:"Cancelled",

      date:order.cancelledAt,

      icon:FiXCircle,

      completed:true,

      color:"bg-red-500",

    });

  }



  return (

    <div className="
      bg-white
      dark:bg-gray-800
      rounded-2xl
      shadow-md
      p-6
    ">


      <h2 className="
        text-xl
        font-bold
        text-gray-900
        dark:text-white
        mb-8
      ">

        Order Timeline

      </h2>



      <div className="relative">


        {steps.map((step,index)=>{


          const Icon = step.icon;


          return (

            <div
              key={step.title}
              className="
                flex
                gap-4
                relative
              "
            >


              {/* Vertical Line */}

              {
                index !== steps.length -1 && (

                  <div
                    className="
                      absolute
                      left-5
                      top-10
                      h-full
                      w-0.5
                      bg-gray-300
                      dark:bg-gray-700
                    "
                  />

                )
              }



              {/* Icon */}

              <div
                className={`
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-white
                  z-10
                  ${
                    step.completed
                    ? step.color
                    : "bg-gray-300 dark:bg-gray-700"
                  }
                `}
              >

                <Icon size={20}/>

              </div>



              {/* Text */}

              <div className="pb-10">


                <h3
                  className={`
                    font-semibold
                    ${
                      step.completed
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400"
                    }
                  `}
                >

                  {step.title}

                </h3>



                {
                  step.date && (

                    <p className="
                      text-sm
                      text-gray-500
                      mt-1
                    ">

                      {
                        new Date(
                          step.date
                        ).toLocaleString()
                      }

                    </p>

                  )
                }



              </div>



            </div>

          );


        })}


      </div>


    </div>

  );

}