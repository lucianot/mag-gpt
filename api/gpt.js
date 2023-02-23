import { Configuration, OpenAIApi } from "openai"
import csv from "csv-parser"
import fs from "fs"
import path from "path"

const gptApiKey = process.env.OPENAI_API_KEY
const configuration = new Configuration({
  apiKey: gptApiKey,
})
const openai = new OpenAIApi(configuration)
const file = path.join(process.cwd(), "data", "embeddings.csv")

async function gptEmbedding(prompt) {
  try {
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: prompt,
    })
    return embeddingResponse["data"]["data"][0]["embedding"]
  } catch (e) {
    console.log("Error getting GPT embedding: ", e)
    throw e
  }
}

async function gptCompletion(prompt) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 200,
      temperature: 0.1,
    })
    return response
  } catch (e) {
    console.log("Error getting GPT completion: ", e)
    throw e
  }
}

async function searchForBestEmbedding(questionEmbedding, file) {
  let maxSimilarity = 0
  let maxSimilarityAnswer = ""

  const maxSimilarityAnswerPromise = new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (row) => {
        const answerEmbedding = row["embedding"].split(",").map(parseFloat)
        const similarity = cosineSimilarity(questionEmbedding, answerEmbedding)
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity
          maxSimilarityAnswer = row["answer"]
        }
      })
      .on("end", () => {
        // console.log("Found best answer!")
        resolve(maxSimilarityAnswer)
      })
      .on("error", (error) => {
        console.error("Error parsing CSV file: ", error)
        reject(error)
      })
  })

  return maxSimilarityAnswerPromise
}

function cosineSimilarity(vector1, vector2) {
  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0

  vector1.forEach((value, index) => {
    dotProduct += value * vector2[index]
    magnitude1 += value ** 2
    magnitude2 += vector2[index] ** 2
  })

  const magnitude = Math.sqrt(magnitude1) * Math.sqrt(magnitude2)
  return magnitude > 0 ? dotProduct / magnitude : 0
}

function preparePrompt(question, bestResponse) {
  const header = `Responda a pergunta da maneira mais verídica possível utilizando o contexto informado, e se a resposta não estiver contida no texto abaixo, diga simplesmente "Eu não sei a resposta."\n\nContexto:\n`
  const questionSection = `Pergunta: ${question}\nResposta:`
  const prompt = header + bestResponse + "\n\n" + questionSection
  return prompt
}

async function getGPTResponse(question) {
  console.log("\n\n\n\n--------------------")
  console.time("Total time: ")

  try {
    // get the embedding
    console.log("Fetching embedding for: ", question)
    console.time("Fetched GPT Embedding: ")
    const questionEmbedding = await gptEmbedding(question)
    console.timeEnd("Fetched GPT Embedding: ")
    console.log("--------------------")

    // find the closest response
    console.log("Finding best response...")
    console.time("Found best response: ")
    const bestResponse = await searchForBestEmbedding(questionEmbedding, "./data/embeddings.csv")
    console.timeEnd("Found best response: ")
    console.log("Best response: ", bestResponse)
    console.log("--------------------")

    // prepare prompt
    const prompt = preparePrompt(question, bestResponse)
    console.log("Prompt: ", prompt)
    console.log("--------------------")

    // get the response
    console.time("Fetched GPT Completion: ")
    const completion = await gptCompletion(prompt)
    console.timeEnd("Fetched GPT Completion: ")
    console.log("Completion: ", completion["data"])
    console.log("--------------------")

    console.timeEnd("Total time: ")
    return completion.data.choices[0].text
  } catch (e) {
    console.log("Error: ", e)
    return "Houve um erro ao processar a sua pergunta. Tente novamente."
  }
}

export default getGPTResponse
