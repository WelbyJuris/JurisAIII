import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";

dotenv.config(); // Carrega variáveis do .env

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // pegando a API do .env
});

const openai = new OpenAIApi(configuration);

async function testar() {
  try {
    const resposta = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Olá, tudo bem?" }],
    });

    console.log("Resposta da IA:", resposta.data.choices[0].message.content);
  } catch (error) {
    console.error("❌ Erro ao chamar a API:", error.response?.data || error.message);
  }
}

testar();
