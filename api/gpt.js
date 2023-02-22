import { Configuration, OpenAIApi } from "openai"
import csv from "csv-parser"
import fs from "fs"

const gptApiKey = process.env.OPENAI_API_KEY
const configuration = new Configuration({
  apiKey: gptApiKey,
})
const openai = new OpenAIApi(configuration)

async function gptEmbedding(prompt) {
  try {
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: prompt,
    })
    return embeddingResponse["data"]["data"][0]["embedding"]
  } catch (e) {
    if (e.response) {
      console.log(e.response.status)
      console.log(e.response.data)
    } else {
      console.log(e.message)
    }
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
    if (e.response) {
      console.log(e.response.status)
      console.log(e.response.data)
    } else {
      console.log(e.message)
    }
    throw e
  }
}

async function searchForBestEmbedding(questionEmbedding, embeddingsFile) {
  let maxSimilarity = 0
  let maxSimilarityAnswer = ""

  const maxSimilarityAnswerPromise = new Promise((resolve, reject) => {
    fs.createReadStream(embeddingsFile)
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
        console.log("Found best answer!")
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
  console.log("--------------------")

  // get the embedding
  console.log("Fetching embedding for: ", question)
  const questionEmbedding = await gptEmbedding(question)
  console.log("Received embedding!")
  console.log("--------------------")

  // find the closest response
  console.log("Finding best response...")
  const bestResponse = await searchForBestEmbedding(questionEmbedding, "./data/embeddings.csv")
  console.log("Best response: ", bestResponse)
  console.log("--------------------")

  // prepare prompt
  const prompt = preparePrompt(question, bestResponse)
  console.log("Prompt: ", prompt)
  console.log("--------------------")

  // get the response
  const completion = await gptCompletion(prompt)
  console.log("Received completion: ", completion["data"])
  console.log("--------------------")

  return completion
}

export default getGPTResponse
