import { useContext, useState } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "motion/react";

const BuyCredit = () => {
  const { user, setShowLogin, backendUrl, razorPayId, loadCreditsData, token } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleOnClick = async (plan) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    // Check if Razorpay key exists
    if (!razorPayId) {
      alert("Payment configuration error. Please contact support.");
      console.error("Razorpay Key ID is missing");
      return;
    }

    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      alert("Payment system not loaded. Please refresh the page.");
      console.error("Razorpay script not loaded");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Razorpay order
      const res = await fetch(backendUrl + "/api/payment/create-order", {
        method: "POST",
        headers: { token },
        body: JSON.stringify({
          amount: plan.price * 100,
          planId: plan.id,
          credits: plan.credits,
        }),
      });

      const orderData = await res.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create order");
      }

      console.log("Order created:", orderData.order);

      // Step 2: Open Razorpay checkout
      const options = {
        key: razorPayId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Pixelfy Credits",
        description: `${plan.id} Plan - ${plan.credits} credits`,
        order_id: orderData.order.id,
        handler: async function (response) {
          // Step 3: Verify payment on backend
          await verifyPayment(response, plan.credits);
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      console.log("Opening Razorpay with options:", { ...options, key: "***" });

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment Failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse, credits) => {
    try {
      console.log("Verifying payment with response:", paymentResponse);
      console.log("User ID:", user._id);
      console.log("Credits to add:", credits);

      const res = await fetch(backendUrl + "/api/payment/verify-payment", {
        method: "POST",
        headers: { token },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          userId: user._id,
          credits: credits,
        }),
      });

      const data = await res.json();
      console.log("Verification response:", data);

      if (data.success) {
        alert(`Payment Successful! ${credits} credits added to your account.`);
        // Refresh user credits in context
        if (loadCreditsData) {
          await loadCreditsData();
        }
      } else {
        console.error("Verification failed:", data.message);
        alert(
          `Payment verification failed: ${data.message}. Please contact support.`
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert(
        "Failed to verify payment. Please contact support with your payment ID: " +
          paymentResponse.razorpay_payment_id
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] text-center pt-14 mb-10"
    >
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>
      <h1 className="text-center text-4xl font-medium mb-6 sm:mb-10">
        Choose the plan
      </h1>
      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            key={index}
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
          >
            <img width={40} src={assets.logo_icon} alt="Logo" />
            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">Rs. {item.price}</span> /{" "}
              {item.credits} credits
            </p>
            <button
              onClick={() => handleOnClick(item)}
              disabled={loading}
              className={`w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
              }`}
            >
              {loading ? "Processing..." : user ? "Purchase" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;
