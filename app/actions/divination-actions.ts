"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Enhanced divination systems with AI integration
export async function generateTarotReading(card: string, question: string, userProfile?: any) {
  const prompt = `
    You are a master tarot reader with 30+ years of experience. Provide a deeply insightful reading for:
    
    Card: ${card}
    Question: ${question}
    ${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ""}
    
    Structure your reading with:
    1. Card's core message and symbolism
    2. Direct answer to the question
    3. Hidden influences and subconscious factors
    4. Practical guidance and next steps
    5. Spiritual practice recommendation
    
    Be mystical yet practical, compassionate yet honest. 4-5 paragraphs.
  `

  return await generateReading(prompt, "tarot")
}

export async function generateIChingReading(hexagram: any, question: string, userProfile?: any) {
  const prompt = `
    You are a wise I Ching master versed in ancient Chinese wisdom. Provide guidance for:
    
    Hexagram: ${hexagram.name} (${hexagram.number})
    Trigrams: ${hexagram.upperTrigram} over ${hexagram.lowerTrigram}
    Question: ${question}
    ${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ""}
    
    Provide:
    1. Hexagram meaning and current situation analysis
    2. The natural flow and timing of events
    3. Proper action vs. non-action guidance
    4. Changing lines interpretation if applicable
    5. Harmony with natural cycles recommendation
    
    Use Taoist wisdom, speak of balance, timing, and natural flow. 4-5 paragraphs.
  `

  return await generateReading(prompt, "iching")
}

export async function generateBaziReading(birthData: any, userProfile?: any) {
  const prompt = `
    You are a Bazi master with deep knowledge of Chinese metaphysics. Analyze this birth chart:
    
    Birth Data: ${JSON.stringify(birthData)}
    ${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ""}
    
    Provide comprehensive analysis:
    1. Day Master strength and elemental balance
    2. 10-year luck pillar analysis and current phase
    3. Personality traits and natural talents
    4. Career and relationship compatibility
    5. Timing for major life decisions
    6. Elemental remedies and feng shui recommendations
    
    Be specific about timing, cycles, and practical applications. 5-6 paragraphs.
  `

  return await generateReading(prompt, "bazi")
}

export async function generateAstrologyReading(birthChart: any, userProfile?: any) {
  const prompt = `
    You are a professional astrologer with expertise in psychological astrology. Analyze:
    
    Birth Chart: ${JSON.stringify(birthChart)}
    ${userProfile ? `User Profile: ${JSON.stringify(birthChart)}` : ""}
    
    Provide soul-level insights:
    1. Sun, Moon, Rising sign synthesis and life purpose
    2. Planetary aspects and psychological patterns
    3. Current transits and their influence
    4. Karmic lessons and soul growth opportunities
    5. Relationship patterns and compatibility insights
    6. Career path and creative expression guidance
    
    Focus on psychological depth and spiritual evolution. 5-6 paragraphs.
  `

  return await generateReading(prompt, "astrology")
}

export async function generateNumerologyReading(numbers: any, userProfile?: any) {
  const prompt = `
    You are a master numerologist with deep understanding of sacred numbers. Calculate and interpret:
    
    Numbers: ${JSON.stringify(numbers)}
    ${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ""}
    
    Provide detailed analysis:
    1. Life Path number and soul mission
    2. Expression number and natural talents
    3. Soul Urge and inner motivations
    4. Personal Year cycle and current themes
    5. Compatibility numbers for relationships
    6. Lucky numbers and timing recommendations
    
    Connect numbers to practical life guidance. 4-5 paragraphs.
  `

  return await generateReading(prompt, "numerology")
}

export async function generatePalmReading(palmData: any, userProfile?: any) {
  const prompt = `
    You are an expert palmist with knowledge of both Western and Eastern palm reading traditions. Analyze:
    
    Palm Features: ${JSON.stringify(palmData)}
    ${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ""}
    
    Provide comprehensive reading:
    1. Life line analysis - vitality, health, major life changes
    2. Heart line - emotional nature, relationships, love patterns
    3. Head line - mental approach, decision-making style
    4. Fate line - career path and life direction
    5. Minor lines and mounts - special talents and characteristics
    6. Hand shape and finger analysis - personality traits
    
    Be specific about timing and practical implications. 5-6 paragraphs.
  `

  return await generateReading(prompt, "palm")
}

export async function generateFaceReading(faceData: any, userProfile?: any) {
  const prompt = `
    You are a master of Chinese face reading (Mian Xiang) with deep knowledge of physiognomy. Analyze:
    
    Facial Features: ${JSON.stringify(faceData)}
    ${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ""}
    
    Provide detailed analysis:
    1. Face shape and overall constitution
    2. Eyes - intelligence, emotional nature, life force
    3. Nose - wealth potential, career success, willpower
    4. Mouth and lips - communication style, relationships
    5. Forehead and eyebrows - early life, thinking patterns
    6. Ears and chin - longevity, determination, late life fortune
    
    Include timing analysis and practical life guidance. 5-6 paragraphs.
  `

  return await generateReading(prompt, "face")
}

export async function generateCombinedReading(systems: string[], data: any, question: string, userProfile?: any) {
  const prompt = `
    You are a master metaphysician versed in both Eastern and Western divination systems. Provide a unified reading combining:
    
    Systems Used: ${systems.join(", ")}
    Data: ${JSON.stringify(data)}
    Question: ${question}
    ${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ""}
    
    Create a comprehensive analysis that:
    1. Synthesizes insights from all systems used
    2. Identifies common themes and patterns
    3. Resolves any apparent contradictions with wisdom
    4. Provides timing guidance from multiple perspectives
    5. Offers practical steps combining Eastern and Western approaches
    6. Suggests spiritual practices that honor both traditions
    
    Create a unified, coherent reading that respects each tradition while providing clear guidance. 6-8 paragraphs.
  `

  return await generateReading(prompt, "combined")
}

async function generateReading(prompt: string, type: string) {
  try {
    const hasApiKey = process.env.OPENAI_API_KEY || false

    if (!hasApiKey) {
      return {
        success: true,
        reading: getFallbackReading(type),
        type: type,
      }
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 800,
    })

    return {
      success: true,
      reading: text,
      type: type,
    }
  } catch (error) {
    console.error(`Error generating ${type} reading:`, error)
    return {
      success: true,
      reading: getFallbackReading(type),
      type: type,
    }
  }
}

function getFallbackReading(type: string): string {
  const fallbacks = {
    tarot:
      "The cards reveal that you are at a significant crossroads in your spiritual journey. The energy surrounding your question suggests that transformation is not only possible but necessary for your growth. Trust your intuition as you navigate the path ahead, for your inner wisdom holds the key to the answers you seek.",
    iching:
      "The ancient wisdom of the I Ching speaks of natural cycles and perfect timing. Your current situation reflects the eternal dance between yin and yang, action and receptivity. The hexagram suggests that by aligning with natural flow rather than forcing outcomes, you will find the harmony you seek.",
    bazi: "Your birth chart reveals a unique elemental constitution that shapes your life's journey. The current 10-year luck pillar indicates a period of growth and opportunity, particularly in areas related to your natural talents. Pay attention to seasonal cycles and elemental balance in your daily life.",
    astrology:
      "The planetary influences in your chart speak to deep soul patterns and karmic lessons. Your current transits suggest a time of awakening and spiritual evolution. The cosmos is supporting your journey toward authentic self-expression and meaningful connections.",
    numerology:
      "The sacred numbers in your chart reveal a divine blueprint for your life's purpose. Your current personal year cycle indicates themes of growth, creativity, and new beginnings. Trust in the mathematical perfection of the universe as it guides your path.",
    palm: "The lines in your palm tell the story of your soul's journey through this lifetime. Your life line speaks of vitality and resilience, while your heart line reveals deep capacity for love and connection. The wisdom held in your hands guides you toward your highest potential.",
    face: "The features of your face reflect the wisdom of your ancestors and the potential of your future. Your facial structure reveals natural talents and life themes that, when understood and honored, can lead to great fulfillment and success.",
    combined:
      "The convergence of Eastern and Western wisdom traditions in your reading reveals a powerful synthesis of spiritual insight. Multiple systems confirm themes of transformation, timing, and authentic self-expression. Trust in the unified message that emerges from this ancient wisdom.",
  }

  return fallbacks[type] || fallbacks.combined
}
