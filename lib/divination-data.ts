// Enhanced divination systems data

export const iChingHexagrams = [
  {
    number: 1,
    name: "The Creative",
    chinese: "乾",
    upperTrigram: "Heaven",
    lowerTrigram: "Heaven",
    element: "Metal",
    meaning: "Pure creative energy, leadership, initiative",
    keywords: ["Leadership", "Creativity", "Initiative", "Power"],
  },
  {
    number: 2,
    name: "The Receptive",
    chinese: "坤",
    upperTrigram: "Earth",
    lowerTrigram: "Earth",
    element: "Earth",
    meaning: "Receptivity, nurturing, following",
    keywords: ["Receptivity", "Nurturing", "Support", "Yielding"],
  },
  {
    number: 3,
    name: "Difficulty at the Beginning",
    chinese: "屯",
    upperTrigram: "Water",
    lowerTrigram: "Thunder",
    element: "Water",
    meaning: "Initial difficulties, perseverance needed",
    keywords: ["Challenges", "Perseverance", "New beginnings", "Growth"],
  },
  {
    number: 8,
    name: "Holding Together",
    chinese: "比",
    upperTrigram: "Water",
    lowerTrigram: "Earth",
    element: "Water",
    meaning: "Unity, cooperation, seeking guidance",
    keywords: ["Unity", "Cooperation", "Guidance", "Support"],
  },
  {
    number: 11,
    name: "Peace",
    chinese: "泰",
    upperTrigram: "Earth",
    lowerTrigram: "Heaven",
    element: "Earth",
    meaning: "Harmony, prosperity, good fortune",
    keywords: ["Harmony", "Prosperity", "Balance", "Success"],
  },
  {
    number: 25,
    name: "Innocence",
    chinese: "无妄",
    upperTrigram: "Heaven",
    lowerTrigram: "Thunder",
    element: "Metal",
    meaning: "Natural action, spontaneity, authenticity",
    keywords: ["Authenticity", "Natural action", "Spontaneity", "Truth"],
  },
]

export const baziElements = {
  wood: { chinese: "木", nature: "Growth", season: "Spring", direction: "East" },
  fire: { chinese: "火", nature: "Expansion", season: "Summer", direction: "South" },
  earth: { chinese: "土", nature: "Stability", season: "Late Summer", direction: "Center" },
  metal: { chinese: "金", nature: "Contraction", season: "Autumn", direction: "West" },
  water: { chinese: "水", nature: "Flow", season: "Winter", direction: "North" },
}

export const zodiacSigns = [
  { name: "Aries", element: "Fire", quality: "Cardinal", ruler: "Mars", dates: "Mar 21 - Apr 19" },
  { name: "Taurus", element: "Earth", quality: "Fixed", ruler: "Venus", dates: "Apr 20 - May 20" },
  { name: "Gemini", element: "Air", quality: "Mutable", ruler: "Mercury", dates: "May 21 - Jun 20" },
  { name: "Cancer", element: "Water", quality: "Cardinal", ruler: "Moon", dates: "Jun 21 - Jul 22" },
  { name: "Leo", element: "Fire", quality: "Fixed", ruler: "Sun", dates: "Jul 23 - Aug 22" },
  { name: "Virgo", element: "Earth", quality: "Mutable", ruler: "Mercury", dates: "Aug 23 - Sep 22" },
  { name: "Libra", element: "Air", quality: "Cardinal", ruler: "Venus", dates: "Sep 23 - Oct 22" },
  { name: "Scorpio", element: "Water", quality: "Fixed", ruler: "Pluto", dates: "Oct 23 - Nov 21" },
  { name: "Sagittarius", element: "Fire", quality: "Mutable", ruler: "Jupiter", dates: "Nov 22 - Dec 21" },
  { name: "Capricorn", element: "Earth", quality: "Cardinal", ruler: "Saturn", dates: "Dec 22 - Jan 19" },
  { name: "Aquarius", element: "Air", quality: "Fixed", ruler: "Uranus", dates: "Jan 20 - Feb 18" },
  { name: "Pisces", element: "Water", quality: "Mutable", ruler: "Neptune", dates: "Feb 19 - Mar 20" },
]

export const numerologyMeanings = {
  1: { meaning: "Leadership, Independence", traits: ["Leader", "Pioneer", "Independent", "Original"] },
  2: { meaning: "Cooperation, Harmony", traits: ["Diplomatic", "Cooperative", "Sensitive", "Peaceful"] },
  3: { meaning: "Creativity, Expression", traits: ["Creative", "Expressive", "Optimistic", "Social"] },
  4: { meaning: "Stability, Hard Work", traits: ["Practical", "Reliable", "Organized", "Patient"] },
  5: { meaning: "Freedom, Adventure", traits: ["Adventurous", "Free-spirited", "Curious", "Dynamic"] },
  6: { meaning: "Nurturing, Responsibility", traits: ["Caring", "Responsible", "Protective", "Healing"] },
  7: { meaning: "Spirituality, Analysis", traits: ["Spiritual", "Analytical", "Intuitive", "Mysterious"] },
  8: { meaning: "Material Success, Power", traits: ["Ambitious", "Practical", "Authoritative", "Successful"] },
  9: { meaning: "Universal Love, Completion", traits: ["Humanitarian", "Generous", "Wise", "Compassionate"] },
}

export const palmLines = {
  life: { meaning: "Vitality, health, major life changes", location: "Curves around thumb" },
  heart: { meaning: "Emotions, relationships, love", location: "Horizontal line below fingers" },
  head: { meaning: "Intelligence, thinking style", location: "Horizontal line in middle" },
  fate: { meaning: "Career, life direction", location: "Vertical line up palm center" },
  sun: { meaning: "Success, creativity, fame", location: "Vertical line under ring finger" },
  mercury: { meaning: "Communication, health", location: "Vertical line under pinky" },
}

export const faceFeatures = {
  forehead: { meaning: "Early life, intelligence, thinking patterns", age: "15-30" },
  eyebrows: { meaning: "Emotional control, relationships with siblings", age: "31-34" },
  eyes: { meaning: "Intelligence, emotional nature, life force", age: "35-40" },
  nose: { meaning: "Wealth potential, career success, willpower", age: "41-50" },
  mouth: { meaning: "Communication, relationships, late life", age: "51-60" },
  chin: { meaning: "Determination, late life fortune", age: "61+" },
}
