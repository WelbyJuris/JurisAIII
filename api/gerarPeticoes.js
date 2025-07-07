import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function gerarPeticao({ tipo, partes, fatos, pedido }) {
  const prompt = `
Você é um advogado experiente. Gere uma petição do tipo "${tipo}", com base nos dados abaixo:

- Partes: ${partes}
- Fatos: ${fatos}
- Pedido: ${pedido}

Gere um texto jurídico claro, formal e completo. Não use linguagem informal.
`;

  try {
    const resposta = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const textoPeticao = resposta.data.choices[0].message.content;

    // Criar arquivo Word simulado (pode ser .txt para testes)
    const nomeArquivo = `peticao_${Date.now()}.txt`;
    const caminho = path.join("output", nomeArquivo);

    // Cria pasta "output" se não existir
    if (!fs.existsSync("output")) {
      fs.mkdirSync("output");
    }

    fs.writeFileSync(caminho, textoPeticao, "utf8");

    return {
      sucesso: true,
      arquivo: nomeArquivo,
      conteudo: textoPeticao,
    };
  } catch (erro) {
    console.error("Erro ao gerar petição:", erro);
    return { sucesso: false, erro: erro.message };
  }
}
