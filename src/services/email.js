// src/services/email.js
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const PLAYERS = [
  { name: "Izabelinhagamerpvp", email: "izabelacoelho30@gmail.com" },
  { name: "Nicole", email: "nicolecoelho26@gmail.com" },
  { name: "Carina", email: "caripsantana@gmail.com" },
  { name: "Luiza", email: "malu.batistas28@gmail.com" },
];

export const notifyAllPlayers = async () => {
  for (const player of PLAYERS) {
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          user_email: player.email,
          user_name: player.name,
        },
        PUBLIC_KEY
      );
      console.log(`✅ Email enviado para ${player.name}`);
    } catch (error) {
      console.error(`❌ Erro ao enviar para ${player.name}:`, error);
    }
  }
};
