import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import userModel from "../models/userModel.js"; // Adjust path as needed

const paymentRouter = express.Router();
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
paymentRouter.post("/create-order", async (req, res) => {
  try {
    const { amount, planId, credits } = req.body;

    const options = {
      amount: amount, // amount in paise
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

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

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

      res.json({
        success: true,
        message: "Payment verified and credits updated successfully",
        creditBalance: user.creditBalance,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
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
