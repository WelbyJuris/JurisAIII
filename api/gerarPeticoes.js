import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use método POST" });
  }

  const { tipo, partes, fatos, pedido } = req.body;

  if (!tipo || !partes || !fatos || !pedido) {
    return res.status(400).json({ error: "Parâmetros faltando" });
  }

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

    return res.status(200).json({ sucesso: true, textoPeticao });
  } catch (erro) {
    console.error("Erro:", erro);
    return res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
