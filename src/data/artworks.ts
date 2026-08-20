export type Artwork = {
  id: string;
  room: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  collection: string;
  sourceUrl: string;
  image: string;
  connection: string;
  description: string;
  symbolism: string;
};

export const artworks: Artwork[] = [
  {
    id: "rembrandt-self-portrait",
    room: "Entrance / Personal Work",
    title: "Self-Portrait",
    artist: "Rembrandt van Rijn",
    year: "1660",
    medium: "Oil on canvas",
    collection: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/437397",
    image: "/archive/rembrandt.jpg",
    connection: "I chose this for the entrance because it refuses polish: the face is evidence, not branding.",
    description: "Painted late in Rembrandt's life, this self-portrait places his direct gaze and visibly worked face against a deep, restrained field. The thick, tactile paint refuses idealization and makes age, experience, and self-observation the subject.",
    symbolism: "For me, it represents intellectual honesty. Serious work begins by examining the assumptions, ambitions, and limitations of the person doing the work.",
  },
  {
    id: "friedrich-moon",
    room: "Philosophy",
    title: "Two Men Contemplating the Moon",
    artist: "Caspar David Friedrich",
    year: "ca. 1825-30",
    medium: "Oil on canvas",
    collection: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/438417",
    image: "/archive/friedrich.jpg",
    connection: "I return to questions of free will, ethics, and truth; this painting lets those questions remain unresolved.",
    description: "Two figures stand beneath a crooked tree and look toward a pale moon suspended in a violet evening sky. Friedrich turns a quiet landscape into a shared act of contemplation, where scale and silence make the unknown feel present.",
    symbolism: "For me, the moon is the unanswered question and the two observers are the discipline of thinking together. Philosophy is not abstraction alone; it is a way of standing calmly before uncertainty.",
  },
  {
    id: "leutze-washington",
    room: "History",
    title: "Washington Crossing the Delaware",
    artist: "Emanuel Leutze",
    year: "1851",
    medium: "Oil on canvas",
    collection: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/11417",
    image: "/archive/washington.jpg",
    connection: "I read history to see institutions and incentives meet events, not to collect heroic stories.",
    description: "Leutze transforms Washington's 1776 crossing into a monumental, theatrical image of collective resolve. Painted in 1851, its heroic scale and carefully arranged figures show how later generations construct a usable memory of the past.",
    symbolism: "For me, it symbolizes the power and danger of historical narrative. History guides action, but every celebrated image also asks who composed the story and what complexity was left outside the frame.",
  },
  {
    id: "van-gogh-cypresses",
    room: "Art",
    title: "Wheat Field with Cypresses",
    artist: "Vincent van Gogh",
    year: "1889",
    medium: "Oil on canvas",
    collection: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/436535",
    image: "/archive/van-gogh.jpg",
    connection: "It reminds me that a chart can be exact and still miss what matters; selection and rhythm shape understanding.",
    description: "Van Gogh built the Saint-Remy landscape from rolling bands of wheat, cloud, mountain, and dark vertical cypresses. The vigorous brushwork does more than record a view: it gives the entire scene a shared rhythm and emotional pressure.",
    symbolism: "For me, it represents the moment observation becomes structure. Art can organize complexity and communicate an argument before language has found the right words.",
  },
  {
    id: "turner-venice",
    room: "Quant Finance / Personal Work",
    title: "Venice, from the Porch of Madonna della Salute",
    artist: "J. M. W. Turner",
    year: "ca. 1835",
    medium: "Oil on canvas",
    collection: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/437853",
    image: "/archive/turner.jpg",
    connection: "The architecture is the model; the haze is market noise. The question is which structure persists.",
    description: "Turner sets Venice's architecture inside a luminous field of water, haze, boats, and reflected color. Solid buildings remain legible, yet their edges continually dissolve into atmosphere and motion.",
    symbolism: "For me, Venice is the model and the surrounding haze is market noise. Quantitative research is the search for durable structure without pretending uncertainty can be removed.",
  },
  {
    id: "pierre-harmonia",
    room: "Research",
    title: "The Death of Harmonia",
    artist: "Jean-Baptiste Marie Pierre",
    year: "ca. 1740-41",
    medium: "Oil on canvas",
    collection: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/437286",
    image: "/archive/harmonia.jpg",
    connection: "This room asks the question behind my insurance research: when a shock arrives, who carries it?",
    description: "Pierre stages a mythological death through urgent gestures, overlapping bodies, and a tightly compressed dramatic space. The scene makes consequence visible as something distributed across every figure rather than confined to one isolated event.",
    symbolism: "For me, it represents systemic risk. Research means tracing how a shock travels through people, institutions, incentives, and capital until the full pattern of consequence becomes legible.",
  },
  {
    id: "vermeer-lute",
    room: "Future",
    title: "Young Woman with a Lute",
    artist: "Johannes Vermeer",
    year: "ca. 1662-63",
    medium: "Oil on canvas",
    collection: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/437880",
    image: "/archive/vermeer.jpg",
    connection: "The instrument is ready, but the next movement is open. That feels closer to real work than a finished manifesto.",
    description: "A young woman holds a lute while turning toward an unseen source beyond the room. Vermeer's map, chair, window light, and suspended gesture create a scene poised between preparation and performance.",
    symbolism: "For me, it symbolizes readiness without false certainty. The instrument is present and the work has begun, but the decisive next movement is still open.",
  },
  {
    id: "turner-whalers",
    room: "Closing Room / Horizon",
    title: "Whalers",
    artist: "J. M. W. Turner",
    year: "ca. 1845",
    medium: "Oil on canvas",
    collection: "The Metropolitan Museum of Art",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/437854",
    image: "/archive/whalers.jpg",
    connection: "I keep this at the exit as a warning: ambition matters, but uncertainty is never conquered.",
    description: "Turner places the whale hunt inside a turbulent expanse of spray, cloud, light, and churning water. Boats and bodies remain visible, but the unstable atmosphere nearly overwhelms them, turning action into a struggle with forces larger than any individual plan.",
    symbolism: "For me, this is the final horizon: ambition matters, but it must remain humble before uncertainty. The goal is not to dominate complexity; it is to build judgment strong enough to move through it.",
  },
];

export const artworkById = Object.fromEntries(artworks.map((artwork) => [artwork.id, artwork])) as Record<string, Artwork>;
