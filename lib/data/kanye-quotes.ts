export interface KanyeQuote {
  text: string;
  vibe: "wise" | "unhinged" | "motivational";
}

export const KANYE_QUOTES: KanyeQuote[] = [
  // Motivational
  { text: "Everything I'm not made me everything I am.", vibe: "motivational" },
  { text: "Believe in your flyness. Conquer your shyness.", vibe: "motivational" },
  { text: "I refuse to accept other people's ideas of happiness for me. As if there's a 'one size fits all' standard for happiness.", vibe: "motivational" },
  { text: "You have to stop letting people manage your emotions.", vibe: "motivational" },
  { text: "Keep your nose out the sky, keep your heart to God, and keep your face to the raising sun.", vibe: "motivational" },
  { text: "I'd rather be hated for who I am than loved for who I'm not.", vibe: "motivational" },
  { text: "Nothing in life is promised except death.", vibe: "motivational" },
  { text: "Take your passion and make it happen.", vibe: "motivational" },
  { text: "I feel like I'm too busy writing history to read it.", vibe: "motivational" },
  { text: "My greatest pain in life is that I will never be able to see myself perform live.", vibe: "motivational" },
  { text: "We all self-conscious. I'm just the first to admit it.", vibe: "motivational" },
  { text: "People always say that you can't please everybody. I think that's a cop-out. Why not attempt it?", vibe: "motivational" },
  { text: "I'm always pushing for human rights. And the human right is the right to be creative.", vibe: "motivational" },

  // Wise
  { text: "I hate when I'm on a flight and I wake up with a water bottle next to me like oh great now I gotta be responsible for this water bottle.", vibe: "wise" },
  { text: "For me, money is not my definition of success. Inspiring people is a definition of success.", vibe: "wise" },
  { text: "The world is not only art. It's a combination of art, architecture, music, and literature.", vibe: "wise" },
  { text: "I always feel like I can do everything. That's the problem with me.", vibe: "wise" },
  { text: "Hip-hop has done so much for racial relations, and I don't think it's given the proper credit.", vibe: "wise" },
  { text: "I think what Kanye West is going to mean is something similar to what Steve Jobs means.", vibe: "wise" },
  { text: "I am so credible and so influential and so relevant that I will change things.", vibe: "wise" },
  { text: "One of my biggest Achilles heels has been my ego. And if I, Kanye West, the very person, can remove my ego, I think the world will be a better place.", vibe: "wise" },
  { text: "I'm a pop enigma. I live and breathe every element in life. I rock a bespoke suit and I go to Harold's for fried chicken.", vibe: "wise" },
  { text: "The only luxury is time. The time you get to spend with your family.", vibe: "wise" },

  // Unhinged / iconic
  { text: "I'm not even gonna lie to you. I love me so much right now.", vibe: "unhinged" },
  { text: "I am Warhol. I am the number one most impactful artist of our generation.", vibe: "unhinged" },
  { text: "I still think I am the greatest.", vibe: "unhinged" },
  { text: "I am so gifted at finding what I don't like about things.", vibe: "unhinged" },
  { text: "Fur pillows are hard to actually sleep on.", vibe: "unhinged" },
  { text: "I don't even listen to rap. My apartment is too nice to listen to rap in.", vibe: "unhinged" },
  { text: "I would like to be the personal trainer of creative directors.", vibe: "unhinged" },
  { text: "I'm a creative genius and there's no other way to word it.", vibe: "unhinged" },
  { text: "Sometimes I push the door close button on the elevator if I see someone running.", vibe: "unhinged" },
  { text: "If you have the opportunity to play this game of life you need to appreciate every moment.", vibe: "unhinged" },
  { text: "I am the number one human being in music. That means any genre, including opera, blues, whatever.", vibe: "unhinged" },
  { text: "Would you believe in what you believe in if you were the only one who believed it?", vibe: "unhinged" },
  { text: "I am the most expressive human being on the planet Earth.", vibe: "unhinged" },
  { text: "I've reached a point where I'm doing what I want at all times.", vibe: "unhinged" },
  { text: "My mind moves in a million miles an hour. I always have something to say.", vibe: "unhinged" },
  { text: "Name one genius that ain't crazy.", vibe: "unhinged" },
  { text: "I am not a fan of books. I would never want a book's autograph.", vibe: "unhinged" },
];

/**
 * Get the quote of the day seeded from the current date.
 * Changes at midnight, same quote all day.
 */
export function getQuoteOfTheDay(): KanyeQuote {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const idx = seed % KANYE_QUOTES.length;
  return KANYE_QUOTES[idx];
}
