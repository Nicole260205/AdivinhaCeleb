import emailjs from "@emailjs/browser";

export const sendEmail = async ({ to_name, to_email, message }) => {
  const templateParams = {
    to_name,
    to_email,
    message,
  };

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
    console.log("✅ Email enviado para:", to_email);
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
  }
};
