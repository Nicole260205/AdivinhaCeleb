// src/services/email.js
import emailjs from "emailjs-com";

// Importa as variáveis do .env
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Envia um email usando EmailJS
 * @param {Object} params - Parâmetros do email
 * @param {string} params.to_name - Nome do destinatário
 * @param {string} params.to_email - Email do destinatário
 * @param {string} params.message - Corpo da mensagem
 */
export const sendEmail = async ({ to_name, to_email, message }) => {
  const templateParams = {
    to_name,
    to_email,
    message,
  };

  try {
    const res = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log("✅ Email enviado:", res.status, res.text);
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
  }
};
