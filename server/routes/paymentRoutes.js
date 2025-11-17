import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import userAuth from "../middlewares/auth.js";

const paymentRouter = express.Router();
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
paymentRouter.post("/create-order", userAuth, async (req, res) => {
  try {
    const { amount, planId, credits } = req.body;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId: planId,
        credits: credits,
      },
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
});

// Verify payment and update credits
paymentRouter.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      credits,
    } = req.body;

    console.log("Verification request received:");
    console.log("Order ID:", razorpay_order_id);
    console.log("Payment ID:", razorpay_payment_id);
    console.log("Signature:", razorpay_signature);
    console.log("User ID:", userId);
    console.log("Credits:", credits);

    // Check if all required fields are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    console.log("Expected signature:", expectedSign);
    console.log("Received signature:", razorpay_signature);
    console.log("Signatures match:", razorpay_signature === expectedSign);

    if (razorpay_signature === expectedSign) {
      // Payment is verified, update user credits
      const user = await userModel.findByIdAndUpdate(
        userId,
        { $inc: { creditBalance: credits } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      console.log(
        "Credits updated successfully. New balance:",
        user.creditBalance
      );

      res.json({
        success: true,
        message: "Payment verified and credits updated successfully",
        creditBalance: user.creditBalance,
      });
    } else {
      console.error("Signature mismatch!");
      res.status(400).json({
        success: false,
        message: "Invalid signature - payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed: " + error.message,
    });
  }
});

// Get user credits (optional - for fetching current balance)
paymentRouter.get("/credits/:userId", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      creditBalance: user.creditBalance,
    });
  } catch (error) {
    console.error("Fetch credits error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch credits",
    });
  }
});

export default paymentRouter;
