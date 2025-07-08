import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ sucesso: false, erro: "Método não permitido" });
  }

  const { tipo, partes, fatos, pedido } = req.body;

  if (!tipo || !partes || !fatos || !pedido) {
    return res.status(400).json({ sucesso: false, erro: "Todos os campos são obrigatórios." });
  }

  const prompt = `
Você é um advogado experiente. Gere uma petição do tipo "${tipo}", com base nos dados abaixo:

- Partes: ${partes}
- Fatos: ${fatos}
- Pedido: ${pedido}

Gere uma petição formal, com linguagem jurídica clara e direta.
`;

  try {
    const resposta = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const textoPeticao = resposta.choices[0].message.content;

    res.status(200).json({
      sucesso: true,
      arquivo: `peticao_${Date.now()}.docx`,
      conteudo: textoPeticao,
    });
  } catch (erro) {
    console.error("Erro ao gerar petição:", erro);
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
}
