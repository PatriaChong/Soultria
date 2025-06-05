"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Fallback readings for when API is not available
const fallbackReadings = {
  "The Tower":
    "The Tower appears in your reading, signifying a period of sudden change and upheaval in your life. While this may feel challenging, remember that these moments of disruption often clear away outdated structures to make room for new growth.\n\nRegarding your question, the Tower suggests you may be holding onto situations or beliefs that no longer serve you. The universe is creating necessary change, even if it feels uncomfortable. This isn't punishment, but rather redirection.\n\nMoving forward, embrace rather than resist these changes. When old structures fall, you have the opportunity to build something more authentic and aligned with your true self. Trust that this process, though difficult, is ultimately for your highest good.\n\nI recommend a grounding meditation practice during this time of change. Focus on connecting with the earth element to help you stay centered as you navigate these transformative energies.",
  "The Star":
    "The Star shines brightly in your reading, bringing a message of hope, inspiration, and spiritual connection. After periods of challenge or difficulty, this card appears as a cosmic reminder that healing and renewal are available to you now.\n\nIn relation to your question, the Star indicates you're on the right path. This is a time of authentic growth and gentle healing. Trust your intuition and the subtle guidance you're receiving, as you're more connected to your higher self than you may realize.\n\nMoving forward, allow yourself to be vulnerable and open to possibility. The Star encourages you to dream big while taking small, consistent steps toward your vision. This is an excellent time for creative projects and spiritual practices.\n\nI recommend spending time under the night sky in meditation or contemplation. Connect with the actual stars above to amplify this energy, allowing their ancient light to inspire and guide your journey.",
  "The Moon":
    "The Moon illuminates your reading, bringing attention to your intuition, subconscious patterns, and the mysteries that lie beneath the surface. This card suggests you're navigating a path where not everything is as it appears.\n\nRegarding your question, the Moon indicates there may be hidden factors or emotions influencing the situation. You're being called to trust your intuition over logic alone, as your subconscious mind holds important wisdom right now.\n\nMoving forward, pay close attention to your dreams and subtle feelings. This is not a time for rushed decisions but rather for deep listening and allowing clarity to emerge naturally. The path may seem uncertain, but your inner guidance knows the way.\n\nI recommend a journaling practice focused on recording and reflecting on your dreams. Working with moon phases for your spiritual practices would also be beneficial now, particularly setting intentions during the new moon and releasing during the full moon.",
  "The Sun":
    "The Sun brightens your reading, bringing messages of joy, vitality, and success. This is one of the most positive cards in the tarot, suggesting a period of clarity, authenticity, and positive outcomes in your life.\n\nIn relation to your question, the Sun indicates that truth and clarity are illuminating your path. Whatever challenges you've faced, you're now entering a period where your authentic self can shine through and be recognized.\n\nMoving forward, embrace optimism and allow yourself to be fully seen. This is an excellent time for new beginnings, creative expression, and celebrating life's simple pleasures. The warmth of the Sun's energy supports your growth and happiness.\n\nI recommend spending time outdoors in natural sunlight to amplify this energy. A solar-focused meditation practice would be beneficial now - visualize golden light filling your body and energizing your spirit as you connect with your inner truth.",
  "The Hermit":
    "The Hermit appears in your reading, bringing wisdom through solitude, introspection, and inner guidance. This card suggests you're in or entering a period where your greatest insights will come from within rather than from external sources.\n\nRegarding your question, the Hermit indicates that quiet contemplation will provide the answers you seek. This is a time to trust your inner wisdom and perhaps step back from the noise and opinions of others.\n\nMoving forward, create space for solitude and reflection in your life. The Hermit doesn't suggest isolation, but rather intentional alone time for self-discovery. When you do return to your social world, you'll bring back the light of new understanding.\n\nI recommend establishing a regular meditation practice in a private, comfortable space. Even 10 minutes daily of sitting in silence with your thoughts can illuminate your path. Working with the element of earth can also help ground your spiritual insights into practical wisdom.",
  "The Fool":
    "The Fool dances into your reading, bringing energy of new beginnings, innocence, and spontaneity. This card represents the start of a journey, taking a leap of faith, and embracing the unknown with an open heart.\n\nIn relation to your question, the Fool encourages you to trust your instincts and take that first step, even if you don't see the entire path ahead. There's a childlike wisdom in approaching situations with fresh eyes and without preconceptions.\n\nMoving forward, embrace the beginner's mindset. Release fears of looking foolish or making mistakes, as these are essential parts of any meaningful journey. The universe supports your willingness to venture into new territory.\n\nI recommend a daily practice of identifying one small risk to take that aligns with your authentic self. Also beneficial would be spending time in nature, observing how life unfolds naturally without force or excessive planning.",
  "The Magician":
    "The Magician manifests in your reading, symbolizing your power to transform intention into reality. This card represents focused will, skillful communication, and the ability to channel higher energy into earthly creation.\n\nRegarding your question, the Magician reminds you that you already possess all the tools and elements needed for success. This is a time to align your thoughts, emotions, and actions toward a singular purpose.\n\nMoving forward, practice conscious creation by clearly defining what you wish to manifest. The Magician's energy supports beginning new projects, especially those requiring creativity and communication. Remember that your words and thoughts carry power.\n\nI recommend creating a small personal altar with symbols of the four elements (earth, air, fire, water) to help you connect with the Magician's integrative energy. Daily affirmations spoken aloud will also help you harness the power of your voice to shape your reality.",
  "The High Priestess":
    "The High Priestess graces your reading, bringing energy of intuition, mystery, and access to the subconscious realm. She sits between the visible and invisible worlds, reminding you of the wisdom that exists beyond rational thought.\n\nIn relation to your question, the High Priestess suggests that the answers you seek lie within your deeper knowing. This is a time to trust your intuition over external advice or purely logical analysis.\n\nMoving forward, create space for silence and receptivity. The High Priestess works through subtle impressions, dreams, and the quiet voice within. Pay attention to recurring symbols or patterns in your life, as these contain important messages for you now.\n\nI recommend keeping a dream journal by your bedside to record insights that come during sleep. Moon-based meditation practices would also be beneficial, particularly during the full moon when the veil between conscious and unconscious is thinnest.",
  "The Empress":
    "The Empress blooms in your reading, embodying nurturing energy, abundance, and creative fertility. She represents the divine feminine principle that gives birth to new life, ideas, and experiences with loving care.\n\nRegarding your question, the Empress indicates a time of growth and fruition. This card suggests nurturing yourself and your projects with patience and compassion, allowing natural development rather than forcing outcomes.\n\nMoving forward, connect with the abundant energy around you. The Empress reminds you to appreciate sensory pleasures and beauty in your environment. This is an excellent time for creative projects and for giving attention to what you wish to see flourish in your life.\n\nI recommend spending time in nature, particularly gardens or forests where you can witness the Earth's generosity. Creating art or engaging with creative expression without judgment would also help you connect with the Empress energy.",
  "The Emperor":
    "The Emperor stands firm in your reading, representing structure, authority, and the establishment of order. This card embodies the divine masculine principle that provides protection, clear boundaries, and stable foundations.\n\nIn relation to your question, the Emperor suggests establishing clear structures and boundaries will be beneficial. This is a time for logical planning and creating systems that support your long-term vision.\n\nMoving forward, examine where you can bring more organization and consistency to your life. The Emperor's energy supports leadership roles and making decisions with confidence. Consider where you need to step into your personal authority more fully.\n\nI recommend creating a daily routine that provides structure while supporting your goals. Working with the element of fire through candle meditation can help connect you with the Emperor's transformative yet controlled energy.",
}

export async function generateTarotReading(card: string, question: string) {
  try {
    // Check if we have an OpenAI API key available
    const hasApiKey = process.env.OPENAI_API_KEY || false

    // If no API key is available, use the fallback readings
    if (!hasApiKey) {
      console.log("No OpenAI API key available, using fallback reading")
      return {
        success: true,
        reading:
          fallbackReadings[card] ||
          "The cosmic energies reveal that this card represents an important message for you. Trust your intuition to interpret its meaning in relation to your question. The universe is guiding you toward the answers you seek, even if the path isn't immediately clear. Take time to reflect on how this card's energy resonates with your current situation.",
        card: card,
      }
    }

    // If API key is available, generate a reading using the AI SDK
    const prompt = `
      You are a skilled tarot reader with deep spiritual knowledge. 
      Provide a personalized tarot reading based on the following:
      
      Card drawn: ${card}
      User's question: ${question}
      
      Your reading should include:
      1. An interpretation of the card in the context of the question
      2. Insights about the querent's situation
      3. Guidance for moving forward
      4. A spiritual practice recommendation related to the card's energy
      
      Keep your tone mystical yet compassionate. Limit your response to 3-4 paragraphs.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    return {
      success: true,
      reading: text,
      card: card,
    }
  } catch (error) {
    console.error("Error generating tarot reading:", error)

    // Return a fallback reading even in case of error
    return {
      success: true,
      reading:
        fallbackReadings[card] ||
        "The cosmic energies are speaking through this card, offering guidance on your journey. While the specific message may not be clear at this moment, trust that the universe is working in your favor. Take time to meditate on this card's imagery and symbolism, as your intuition will reveal deeper insights when you're ready to receive them.",
      card: card,
    }
  }
}
