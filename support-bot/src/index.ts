import { exec } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import { promisify } from 'util'
import { ChatSession, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai'
import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js'
import dotenv from 'dotenv'

const execAsync = promisify(exec)

dotenv.config()

const apiKey = process.env.CLOUD_API_KEY
if (!apiKey) {
  throw new Error('CLOUD_API_KEY environment variable is not set')
}

const discordToken = process.env.DISCORD_BOT_TOKEN
if (!discordToken) {
  throw new Error('DISCORD_BOT_TOKEN environment variable is not set')
}

const genAI = new GoogleGenerativeAI(apiKey)

async function ensureSynpressSourceFile(): Promise<void> {
  try {
    // Check if synpress-source.txt exists
    try {
      await fs.access('synpress-source.txt')
      console.log('synpress-source.txt already exists')
      return
    } catch {
      console.log('synpress-source.txt not found, generating...')
    }

    // Run flatten.cjs to generate the file
    const workspaceRoot = process.cwd()
    console.log('Workspace root:', workspaceRoot)
    const flattenScript = path.join(workspaceRoot, 'flatten.cjs')
    console.log('Flatten script path:', flattenScript)
    await execAsync(`node ${flattenScript}`)

    // Move the generated file from output/output1.txt to synpress-source.txt
    const outputFile = path.join(workspaceRoot, 'output', 'output1.txt')
    console.log('Output file path:', outputFile)
    await fs.rename(outputFile, 'synpress-source.txt')
    console.log('Successfully generated synpress-source.txt')
  } catch (error) {
    console.error('Failed to generate synpress-source.txt:', error)
    throw error
  }
}

// Initialize bot after ensuring synpress-source.txt exists
async function initializeBot() {
  await ensureSynpressSourceFile()

  const modelConfig = {
    // model: 'gemini-2.0-pro-exp-02-05'
    model: 'gemini-1.5-pro-latest',
    systemInstruction:
      'When responding, make sure that response is not longer than 1900 characters. Also make sure to respond only to synpress-related questions.'
  }

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 1900,
    responseMimeType: 'text/plain'
  }

  const safetyConfig = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE
    }
  ]

  async function readFileContent(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8')
    } catch (err) {
      console.error('Error reading file:', err)
      throw err
    }
  }

  let chatSession: ChatSession | null = null
  let isProcessing = false

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
  })

  client.once('ready', () => {
    console.log(`Bot is ready! Logged in as ${client.user?.tag}`)
  })

  async function sendLongMessage(channel: TextChannel, messageText: string, author: string) {
    const maxMessageLength = 1900

    // If message fits in one chunk, send it as is
    if (messageText.length <= maxMessageLength) {
      await channel.send(`${author}, here's your response:\n${messageText}`)
      return
    }

    const lines = messageText.split('\n')
    let currentMessage = ''
    let isFirstMessage = true
    let insideCodeBlock = false
    let codeBlockLang = ''
    let pendingCodeBlockClose = false

    for (const line of lines) {
      const isCodeBlockStart = line.trim().match(/^```(\w*)/)
      const isCodeBlockEnd = line.trim() === '```'

      // Track code block state
      if (isCodeBlockStart && !insideCodeBlock) {
        insideCodeBlock = true
        codeBlockLang = isCodeBlockStart[1]
      } else if (isCodeBlockEnd && insideCodeBlock) {
        insideCodeBlock = false
        pendingCodeBlockClose = false
      }

      // Check if adding this line would exceed the limit
      const wouldExceedLimit = currentMessage.length + line.length + 1 > maxMessageLength

      if (wouldExceedLimit) {
        // If we're inside a code block, we need to close it properly
        let messageToSend = currentMessage
        if (insideCodeBlock) {
          messageToSend += '\n```'
          pendingCodeBlockClose = true
        }

        // Send the current chunk
        if (isFirstMessage) {
          await channel.send(`${author}, here's your response:\n${messageToSend}`)
          isFirstMessage = false
        } else {
          await channel.send(messageToSend)
        }

        // Start new chunk, reopening code block if needed
        currentMessage = pendingCodeBlockClose ? `\`\`\`${codeBlockLang}\n${line}` : line
        pendingCodeBlockClose = false
      } else {
        currentMessage += (currentMessage.length > 0 ? '\n' : '') + line
      }
    }

    // Send any remaining content
    if (currentMessage.length > 0) {
      if (isFirstMessage) {
        await channel.send(`${author}, here's your response:\n${currentMessage}`)
      } else {
        await channel.send(currentMessage)
      }
    }
  }

  client.on('messageCreate', async (message: Message) => {
    if (
      !(message.channel instanceof TextChannel) ||
      message.channel.name !== 'support-bot' ||
      message.author.bot ||
      !client.user ||
      !message.mentions.has(client.user.id)
    ) {
      return
    }

    if (isProcessing) {
      await message.channel.send(`${message.author}, I'm currently busy. Please wait for the response.`)
      return
    }

    isProcessing = true
    await message.channel.send(
      `${message.author}, I'm processing your question. Please wait up to 1 minute for the response.`
    )

    try {
      if (!chatSession) {
        const model = genAI.getGenerativeModel(modelConfig)
        const fileContent = await readFileContent('synpress-source.txt')

        chatSession = model.startChat({
          generationConfig,
          safetySettings: safetyConfig,
          history: [
            {
              role: 'user',
              parts: [
                {
                  text: "synpress-source.txt file that represents an entire repository of synpress. The repository's individual files are separated by the sequence '''// File: \", followed by the file path. Each file's content begins immediately after its file path and extends until the next sequence of ''// File: \". Analyse this file and learn from it, so that all my next questions will be referenced to this file."
                },
                {
                  text: fileContent
                }
              ]
            },
            {
              role: 'model',
              parts: [
                {
                  text: 'I have now analyzed and learned from the provided `synpress-source.txt` file. You can ask me questions about the code, the functionalities, or anything related to Synpress, and I will do my best to answer them based on my understanding of the repository.'
                }
              ]
            }
          ]
        })
      }

      const result = await chatSession.sendMessage(message.content)
      let responseText = result.response.text()
      const botMention = new RegExp(`<@!?${client.user.id}>`, 'g')
      responseText = responseText.replace(botMention, '')

      await sendLongMessage(message.channel, responseText, message.author.toString())
    } catch (error) {
      console.error('Failed to process the message:', error)
      await message.channel.send(
        `${message.author}, there was an error processing your request: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    } finally {
      isProcessing = false
    }
  })

  client.login(discordToken).catch((error) => {
    console.error('Failed to login:', error)
    process.exit(1)
  })
}

initializeBot()
