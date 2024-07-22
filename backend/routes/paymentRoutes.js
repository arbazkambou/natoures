import express from "express";
import axios from "axios";
import crypto from "crypto";
import { Buffer } from "buffer";

const paymentRouter = express.Router();

// Replace with your credentials

paymentRouter.route("/").post(async (req, res) => {
  const merchantId = process.env.JAZZCASH_MERCHANT_ID;
  const password = process.env.JAZZCASH_PASSWORD;
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT;
  const jazzCashUrl = process.env.JAZZCASH_PORTAL_URL;
  ("https://sandbox.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction"); // Use the live URL for production
  const { amount, description } = req.body;
  // Generate current timestamp
  const date = new Date();
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  const formattedDate = formatDate(date);
  function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }
  const expiryDate = addMinutes(date, 10);
  const formattedExpiryDate = formatDate(expiryDate);
  const transactionId = "T" + formattedDate; // Generate a unique transaction ID
  const txnRefNumber = "Ref" + formattedDate; // Reference number
  // Prepare the parameters
  const params = {
    // pp_Version: "2.0",
    // pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: merchantId,
    pp_SubMerchantID: "", // Optional
    pp_Password: password,
    // pp_BankID: "",
    // pp_ProductID: "",
    pp_MobileNumber: "03123456789",
    pp_CNIC: "345678",
    pp_TxnRefNo: transactionId,
    pp_Amount: amount * 100, // Amount in paisa
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: formattedDate,
    pp_DiscountedAmount: "",
    pp_BillReference: txnRefNumber,
    pp_Description: description,
    pp_TxnExpiryDateTime: formattedExpiryDate, // 10 minutes expiry time
    // pp_ReturnURL: "http://localhost:5173/", // Your callback URL
    pp_SecureHash: "",
    ppmpf_1: "1",
    ppmpf_2: "2",
    ppmpf_3: "3",
    ppmpf_4: "4",
    ppmpf_5: "5",
  };

  // const xyz={
  //   "pp_Language": "EN",
  //   "pp_MerchantID": "RafayKhan7",
  //   "pp_SubMerchantID": "",
  //   "pp_Password": "0123456789",
  //   "pp_TxnRefNo": "",
  //   "pp_MobileNumber":"03411728699",
  //   "pp_CNIC": "345678",
  //   "pp_Amount": "10000",
  //   "pp_DiscountedAmount":"",
  //   "pp_TxnCurrency": "PKR",
  //   "pp_TxnDateTime": "",
  //   "pp_BillReference": "",
  //   "pp_Description": "",
  //   "pp_TxnExpiryDateTime",: ""
  //   "pp_SecureHash": "",
  //   "ppmpf_1" : "",
  //   "ppmpf_2" : "",
  //   "ppmpf_3" : "",
  //   "ppmpf_4" : "",
  //   "ppmpf_5" : ""
  //   }
  const sortedKeys = Object.keys(params).sort();

  let sortedString = sortedKeys
    .filter((key) => params[key] !== "")
    .map((key) => params[key])
    .join("&");
  sortedString = integritySalt + "&" + sortedString;
  const utf8Bytes = Buffer.from(sortedString, "utf8");
  const isoBytes = Buffer.from(utf8Bytes.toString("binary"), "binary");
  const hash = crypto
    .createHmac("sha256", Buffer.from(integritySalt, "utf-8"))
    .update(isoBytes)
    .digest("hex")
    .toUpperCase();

  // Add the hash to the parameters
  params.pp_SecureHash = hash;
  // console.log(params);
  // console.log(hash);
  try {
    const response = await axios.post(jazzCashUrl, params);
    res.json({ status: "success", response });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default paymentRouter;
