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
    connection: "A study in self-scrutiny opens a portfolio built around testing one's own assumptions.",
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
    connection: "Contemplation becomes a shared act: looking outward in order to question inward.",
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
    connection: "History is presented not as neutral record, but as memory shaped into a consequential image.",
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
    connection: "Observation becomes rhythm, structure, and felt energy rather than passive description.",
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
    connection: "Stable architecture emerges from atmospheric noise, much as a useful signal emerges from markets.",
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
    connection: "A system under stress becomes legible through gesture, consequence, and the distribution of risk.",
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
    connection: "A moment of preparation: attention held just before the next work begins.",
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
    connection: "Human ambition enters a field too powerful and uncertain to be completely controlled.",
    description: "Turner places the whale hunt inside a turbulent expanse of spray, cloud, light, and churning water. Boats and bodies remain visible, but the unstable atmosphere nearly overwhelms them, turning action into a struggle with forces larger than any individual plan.",
    symbolism: "For me, this is the final horizon: ambition matters, but it must remain humble before uncertainty. The goal is not to dominate complexity; it is to build judgment strong enough to move through it.",
  },
];

export const artworkById = Object.fromEntries(artworks.map((artwork) => [artwork.id, artwork])) as Record<string, Artwork>;
