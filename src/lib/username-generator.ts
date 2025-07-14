/**
 * Username generation utilities for creating unique, user-friendly usernames
 */

const adjectives = [
  "amazing", "brilliant", "creative", "dynamic", "elegant", "fantastic", "genius", "happy",
  "incredible", "joyful", "kind", "lively", "magnificent", "noble", "optimistic", "peaceful",
  "quiet", "radiant", "stellar", "thoughtful", "unique", "vibrant", "wonderful", "excellent",
  "zealous", "bright", "clever", "daring", "energetic", "friendly", "graceful", "humble",
  "innovative", "jovial", "keen", "luminous", "motivated", "natural", "original", "passionate",
  "quick", "remarkable", "smart", "talented", "uplifting", "vivacious", "wise", "youthful"
];

const nouns = [
  "artist", "builder", "creator", "dreamer", "explorer", "founder", "genius", "helper",
  "inventor", "journeyer", "keeper", "learner", "maker", "navigator", "optimizer", "pioneer",
  "questioner", "researcher", "strategist", "thinker", "unicorn", "visionary", "warrior", "expert",
  "zenith", "architect", "champion", "designer", "engineer", "facilitator", "guardian", "hero",
  "innovator", "judge", "knight", "leader", "mentor", "ninja", "oracle", "protector",
  "ranger", "sage", "trainer", "user", "veteran", "wizard", "xenial", "yielder"
];

const animals = [
  "tiger", "eagle", "dolphin", "wolf", "fox", "lion", "bear", "owl", "hawk", "deer",
  "rabbit", "cat", "dog", "horse", "elephant", "panda", "koala", "whale", "shark", "turtle",
  "penguin", "flamingo", "parrot", "butterfly", "bee", "spider", "ant", "snail", "octopus", "crab"
];

/**
 * Generates a random username combining adjective + noun + random number
 * Format: {adjective}{noun}{number}
 * Example: creativeDreamer42
 */
export function generateRandomUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  // Capitalize first letter of each word
  const capitalizedAdjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);
  const capitalizedNoun = noun.charAt(0).toUpperCase() + noun.slice(1);
  
  return `${capitalizedAdjective}${capitalizedNoun}${number}`;
}

/**
 * Generates a random username combining adjective + animal + random number
 * Format: {adjective}{animal}{number}
 * Example: BrightTiger88
 */
export function generateAnimalUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  // Capitalize first letter of each word
  const capitalizedAdjective = adjective.charAt(0).toUpperCase() + adjective.slice(1);
  const capitalizedAnimal = animal.charAt(0).toUpperCase() + animal.slice(1);
  
  return `${capitalizedAdjective}${capitalizedAnimal}${number}`;
}

/**
 * Generates a simple username from name or email
 * Falls back to random generation if no valid input
 */
export function generateUsernameFromInfo(name?: string | null, email?: string | null): string {
  // Try to generate from name first
  if (name && name.trim()) {
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanName.length >= 3) {
      const number = Math.floor(Math.random() * 999) + 1;
      return `${cleanName}${number}`;
    }
  }
  
  // Try to generate from email
  if (email && email.includes('@')) {
    const emailPrefix = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    if (emailPrefix.length >= 3) {
      const number = Math.floor(Math.random() * 999) + 1;
      return `${emailPrefix}${number}`;
    }
  }
  
  // Fall back to random generation
  return generateRandomUsername();
}

/**
 * Validates if a username meets requirements
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: "Username is required" };
  }
  
  const trimmed = username.trim();
  
  if (trimmed.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters long" };
  }
  
  if (trimmed.length > 30) {
    return { valid: false, error: "Username must be no more than 30 characters long" };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { valid: false, error: "Username can only contain letters, numbers, underscores, and hyphens" };
  }
  
  if (!/^[a-zA-Z]/.test(trimmed)) {
    return { valid: false, error: "Username must start with a letter" };
  }
  
  return { valid: true };
}

/**
 * Generates multiple username suggestions
 */
export function generateUsernameSuggestions(count: number = 5): string[] {
  const suggestions: string[] = [];
  
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      suggestions.push(generateRandomUsername());
    } else {
      suggestions.push(generateAnimalUsername());
    }
  }
  
  return suggestions;
}