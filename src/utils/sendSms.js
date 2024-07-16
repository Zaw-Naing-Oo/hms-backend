import config from "../config/index.js";
import twilio from "twilio";

// const accountSSID = 'AC09dea3f37249211ec933b72042311a9c';
// const token = '[54d3adddedbc1b20fe2d2856a4efccdc]';
// const phoneNUm = '+12085179865';

// const client = new twilio(accountSSID, token);

export const sendSms = async (mobileNo, message) => {
  const url = `http://bulksmsbd.net/api/smsapi?api_key=${config.SMS_API_KEY}&type=text&number=${mobileNo}&senderid=${config.SMS_SENDER_ID}&message=${message}`;

  const response = await fetch(url);

  const result = await response.json();

  return result;
};


/* new code */
// const formatPhoneNumber = (number) => {
//   // Remove all non-numeric characters
//   number = number.replace(/\D/g, '');

//   number = `+95${number}`;

//   return number;
// };

// export const sendSms = async (mobileNo, message) => {
//   const formattedNumber = formatPhoneNumber(mobileNo);
//   console.log(formattedNumber)

//   try {
//     const messageResponse = await client.messages.create({
//       body: message,
//       from: phoneNUm,
//       to: formattedNumber,
//     });
//     console.log("Response ", messageResponse);
//     return;
//     return messageResponse;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }
