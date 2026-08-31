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
  imageWidth: number;
  imageHeight: number;
  connection: string;
  description: string;
  symbolism: string;
};

export const artworks: Artwork[] = [
  {
    id: "rubens-prometheus-bound",
    room: "Entrance / Personal Work",
    title: "Prometheus Bound",
    artist: "Peter Paul Rubens and Frans Snyders",
    year: "Begun c. 1611-12, completed by 1618",
    medium: "Oil on canvas",
    collection: "Philadelphia Museum of Art",
    sourceUrl: "https://www.philamuseum.org/objects/104468",
    image: "/archive/rubens-prometheus-bound.webp",
    imageWidth: 1280,
    imageHeight: 1479,
    connection: "I chose Prometheus for the entrance because knowledge is never passive: taking an idea seriously means accepting its cost.",
    description: "Rubens shows Prometheus chained to a rock as the eagle painted by Frans Snyders tears at his body. The violent diagonal, compressed space, and twisting figure turn the Titan's punishment for giving fire to humanity into a physical argument about knowledge, power, and consequence.",
    symbolism: "For me, Prometheus represents the bargain behind ambitious work. Mathematics, markets, and building can expand what is possible, but every useful form of knowledge carries responsibility and a price for using it badly.",
  },
  {
    id: "gowy-fall-of-icarus",
    room: "Philosophy",
    title: "The Fall of Icarus",
    artist: "Jacob Peeter Gowy",
    year: "1636-1638",
    medium: "Oil on canvas",
    collection: "Museo Nacional del Prado",
    sourceUrl: "https://www.museodelprado.es/en/the-collection/art-work/the-fall-of-icarus/2823dc25-398a-4d88-a4b2-be314065a62d",
    image: "/archive/gowy-fall-of-icarus.webp",
    imageWidth: 2035,
    imageHeight: 2200,
    connection: "Icarus belongs in the philosophy room because ambition needs a theory of limits, not merely the courage to rise.",
    description: "Gowy captures the instant Icarus falls after the sun melts the wax holding his wings. His body turns helplessly above the sea while Daedalus reaches toward him, making a familiar myth feel immediate rather than safely moralistic.",
    symbolism: "For me, the fall is not an argument against ambition. It is a warning that confidence without calibration becomes self-deception. The difficult question is how to reach higher while still respecting evidence, limits, and risk.",
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
    image: "/archive/washington.webp",
    imageWidth: 1800,
    imageHeight: 1054,
    connection: "I read history to see institutions and incentives meet events, not to collect heroic stories.",
    description: "Leutze transforms Washington's 1776 crossing into a monumental, theatrical image of collective resolve. Painted in 1851, its heroic scale and carefully arranged figures show how later generations construct a usable memory of the past.",
    symbolism: "For me, it symbolizes the power and danger of historical narrative. History guides action, but every celebrated image also asks who composed the story and what complexity was left outside the frame.",
  },
  {
    id: "david-cupid-psyche",
    room: "Art",
    title: "Cupid and Psyche (Love and Psyche)",
    artist: "Jacques-Louis David",
    year: "1817",
    medium: "Oil on canvas",
    collection: "Cleveland Museum of Art",
    sourceUrl: "https://www.clevelandart.org/art/1962.37",
    image: "/archive/david-cupid-psyche.webp",
    imageWidth: 1920,
    imageHeight: 1454,
    connection: "David turns an ideal love story into something psychologically uneasy; I like art that complicates the story it inherits.",
    description: "David shows Cupid slipping away at dawn while Psyche remains asleep. Instead of presenting the myth as pure romance, he gives Cupid an unsettling, self-aware expression and places ideal beauty beside physical awkwardness. The two butterflies, one above Psyche and one on the bed, quietly echo the soul and its transformation.",
    symbolism: "For me, the painting is about the distance between an ideal and the reality beneath it. Art matters when it does more than illustrate a beautiful idea: it exposes the tension, vanity, or contradiction that the polished version leaves out.",
  },
  {
    id: "david-telemachus-eucharis",
    room: "Quant Finance / Personal Work",
    title: "The Farewell of Telemachus and Eucharis",
    artist: "Jacques-Louis David",
    year: "1818",
    medium: "Oil on canvas",
    collection: "J. Paul Getty Museum",
    sourceUrl: "https://www.getty.edu/art/collection/object/103RJ0",
    image: "/archive/david-telemachus-eucharis.webp",
    imageWidth: 1920,
    imageHeight: 1639,
    connection: "The painting holds attachment and departure in the same frame; research also requires conviction without becoming unable to leave a failing idea.",
    description: "Telemachus prepares to leave Calypso's island while Eucharis clings to him in a final embrace. David compresses the scene into a close, nearly airless arrangement: her lowered face conveys grief, while his outward gaze and upright spear announce a duty that has already pulled him elsewhere.",
    symbolism: "For me, it represents disciplined separation. In markets, attachment to a thesis can feel personal, but evidence eventually demands a departure. The difficult part is not forming conviction; it is knowing when purpose has to outrank comfort.",
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
    image: "/archive/harmonia.webp",
    imageWidth: 1367,
    imageHeight: 1800,
    connection: "This room asks the question behind my insurance research: when a shock arrives, who carries it?",
    description: "Pierre stages a mythological death through urgent gestures, overlapping bodies, and a tightly compressed dramatic space. The scene makes consequence visible as something distributed across every figure rather than confined to one isolated event.",
    symbolism: "For me, it represents systemic risk. Research means tracing how a shock travels through people, institutions, incentives, and capital until the full pattern of consequence becomes legible.",
  },
  {
    id: "retzsch-chess-players",
    room: "Future",
    title: "The Chess Players",
    artist: "Moritz Retzsch",
    year: "1831",
    medium: "Oil on panel",
    collection: "Private collection",
    sourceUrl: "https://www.metmuseum.org/art/collection/search/354051",
    image: "/archive/retzsch-chess-players.webp",
    imageWidth: 800,
    imageHeight: 632,
    connection: "Chess compresses character into decisions: calculate deeply, stay calm, and keep looking when the position appears closed.",
    description: "Retzsch stages a chess game as a contest for a young man's soul. The devil sits opposite him with captured white pieces gathered nearby, while an angel watches from the center. Virtues and vices become pieces on a board, turning an intellectual game into a moral drama about temptation, consequence, and choice.",
    symbolism: "For me, the board represents any difficult future: the position is inherited, but the next move is still mine. I play chess because it rewards clear calculation without allowing certainty, and because composure matters most when the board looks worst.",
  },
  {
    id: "leonardo-last-supper",
    room: "Closing Room / Horizon",
    title: "The Last Supper",
    artist: "Leonardo da Vinci",
    year: "1495-1498",
    medium: "Tempera and oil on plaster",
    collection: "Museo del Cenacolo Vinciano, Milan",
    sourceUrl: "https://cenacolovinciano.org/en/museum/",
    image: "/archive/leonardo-last-supper.webp",
    imageWidth: 2560,
    imageHeight: 1343,
    connection: "I keep this at the exit because one shared table can hold loyalty, doubt, fear, and betrayal at once; people are never a single clean variable.",
    description: "Leonardo captures the instant after Christ announces that one of the twelve apostles will betray him. The disciples break into four groups of three, each reacting through a different gesture, expression, and line of sight, while the room's perspective converges on the still figure of Christ at the center.",
    symbolism: "For me, the mural is a study in judgment under incomplete information. Every person at the table hears the same sentence but reveals a different inner world. It is a reminder that models can organize evidence, while understanding people still requires attention to motive, character, and silence.",
  },
];

export const artworkById = Object.fromEntries(artworks.map((artwork) => [artwork.id, artwork])) as Record<string, Artwork>;
