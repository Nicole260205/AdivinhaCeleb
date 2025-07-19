import emailjs from "@emailjs/browser";

// Esses dados vêm do site do EmailJS
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendEmailToUser = async (userEmail, userName) => {
  try {
    const templateParams = {
      user_email: userEmail,
      user_name: userName,
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log("Email enviado com sucesso!", response.status, response.text);
  } catch (error) {
    console.error("Erro ao enviar email:", error);
  }
};
