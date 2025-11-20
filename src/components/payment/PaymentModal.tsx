// import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// import { toast } from "react-hot-toast";
// import { useForm } from "react-hook-form";
// import { X } from "lucide-react";

// type Props = {
//   totalAmount: number;
//   initialPayment: number;
//   bookingSummary: {
//     title: string;
//     days: number;
//   };
// };

// const PaymentModal = ({ totalAmount, initialPayment, bookingSummary }: Props) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const { handleSubmit } = useForm();

//   const onSubmit = async () => {
//     if (!stripe || !elements) return toast.error("Stripe not loaded");

//     const card = elements.getElement(CardElement);
//     if (!card) return;

//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: "card",
//       card,
//     });

//     if (error) {
//       toast.error(error.message || "Payment failed");
//       return;
//     }

//     toast.success("Payment Successful!");
//     (document.getElementById("payment_modal") as HTMLDialogElement).close();
//   };

//   return (
//     <dialog id="payment_modal" className="modal">
//       <div className="modal-box w-11/12 max-w-5xl bg-white">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-2xl font-bold text-gray-700">Payment</h3>
//           <form method="dialog">
//             <button className="text-gray-500 hover:text-red-500">
//               <X size={20} />
//             </button>
//           </form>
//         </div>

//         <p className="text-gray-500 mb-6">Kindly follow the instructions below</p>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Left - Booking Summary */}
//           <div>
//             <p className="text-gray-700">Transfer LankaStay:</p>
//             <p className="text-gray-700">
//               {bookingSummary.days} Days at <span className="font-medium">{bookingSummary.title}</span>
//             </p>
//             <p className="text-gray-700">
//               Total: <span className="text-blue-600 font-bold">${totalAmount.toFixed(2)} USD</span>
//             </p>
//             <p className="text-gray-700">
//               Initial Payment:{" "}
//               <span className="text-blue-600 font-bold">${initialPayment.toFixed(2)}</span>
//             </p>
//           </div>

//           {/* Right - Stripe Card Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <label className="text-gray-700 font-medium">Card Details</label>
//             <div className="border border-gray-300 rounded p-3">
//               <CardElement
//                 options={{
//                   style: {
//                     base: {
//                       fontSize: "16px",
//                       color: "#374151",
//                       fontFamily: "inherit",
//                     },
//                   },
//                 }}
//               />
//             </div>

//             <div className="flex flex-col gap-3 mt-4">
//               <button
//                 type="submit"
//                 className="btn bg-blue-600 hover:bg-blue-700 text-white w-full"
//               >
//                 Pay Now
//               </button>
//               <form method="dialog">
//                 <button className="btn bg-gray-200 text-gray-600 w-full">Cancel</button>
//               </form>
//             </div>
//           </form>
//         </div>
//       </div>
//     </dialog>
//   );
// };

// export default PaymentModal;
