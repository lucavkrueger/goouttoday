import type { Activity } from "@/data/allActivities";

/**
 * Zentrale, strenge Prüfung: passt eine Aktivität zu den gewählten Interessen?
 *
 * Eine Aktivität passt, wenn
 *  1. ihre Kategorie zu einem gewählten Interesse gehört, oder
 *  2. ein Schlüsselwort des Interesses als Wort im Titel vorkommt.
 *
 * Schlüsselwörter werden wortweise verglichen (nicht als beliebiger Textteil),
 * damit z. B. "Spa" nicht in "Spaziergang" gefunden wird.
 *  - "wort"  : Wort ist gleich, endet darauf (Volks-park) oder beginnt damit (Kunst-haus)
 *  - "=wort" : nur exakt dieses Wort
 *  - "zwei wörter" : muss genau so im Titel stehen
 */

type InterestRule = { categories: string[]; keywords: string[] };

const RULES: Record<string, InterestRule> = {
  Kunst: { categories: ["Kunst"], keywords: ["kunst", "galerie", "ausstellung", "street art"] },
  Musik: { categories: ["Musik"], keywords: ["musik", "konzert", "jazz", "oper", "philharmonie", "=chor", "karaoke"] },
  Gastronomie: { categories: ["Gastronomie", "Essen & Trinken"], keywords: ["restaurant", "café", "cafe", "essen", "markthalle", "food", "brunch", "currywurst", "imbiss", "=curry", "street food"] },
  Sport: { categories: ["Sport"], keywords: ["sport", "bouldern", "klettern", "kletterwald", "yoga", "schwimmen", "=sup", "volleyball", "beachvolleyball", "laufen", "joggen", "fitness", "kajak", "paddeln"] },
  Natur: { categories: ["Natur"], keywords: ["park", "garten", "wald", "natur", "insel", "heide"] },
  Museum: { categories: ["Museum", "Museen"], keywords: ["museum"] },
  Theater: { categories: ["Theater"], keywords: ["theater", "bühne", "volksbühne", "oper"] },
  Kultur: { categories: ["Kultur"], keywords: ["kultur", "kulturbrauerei", "literatur"] },
  Tanzen: { categories: ["Tanzen"], keywords: ["tanz", "tanzen", "tango", "swing", "ballhaus", "salsa"] },
  Lostplaces: { categories: ["Lostplaces"], keywords: ["=lost", "lostplace", "teufelsberg", "spreepark", "verlassen", "abhörstation"] },
  Skateparks: { categories: [], keywords: ["skate", "skatepark", "skaten"] },
  Kneipe: { categories: [], keywords: ["kneipe", "=pub", "bier", "biergarten"] },
  "Am Wasser": { categories: ["See"], keywords: ["see", "spree", "kanal", "ufer", "=boot", "bootsverleih", "bootstour", "strand", "strandbad", "badeschiff", "wasser"] },
  See: { categories: ["See"], keywords: ["see", "strandbad"] },
  Geschichte: { categories: ["Geschichte"], keywords: ["geschichte", "historisch", "gedenkstätte", "=mauer", "berliner mauer", "mauerweg", "denkmal", "checkpoint", "stasi", "=ddr", "tränenpalast", "topographie"] },
  Shopping: { categories: ["Shopping", "Märkte"], keywords: ["shopping", "markt", "kadewe", "kaufhaus", "bikini"] },
  Familie: { categories: ["Familie"], keywords: ["kinder", "kindermuseum", "familie", "=zoo", "tierpark", "legoland", "labyrinth", "=fez"] },
  Kurse: { categories: [], keywords: ["kurs", "workshop"] },
  Architektur: { categories: ["Architektur"], keywords: ["architektur", "siedlung", "schloss", "bauhaus", "palast", "=dom", "allee", "hansaviertel"] },
  Fotografie: { categories: ["Fotografie"], keywords: ["foto", "fotografie", "fotomuseum"] },
  Wellness: { categories: ["Wellness"], keywords: ["wellness", "=spa", "therme", "thermen", "sauna", "vabali", "liquidrom", "massage"] },
  Handwerk: { categories: [], keywords: ["handwerk", "werkstatt", "töpfern", "töpferkurs"] },
  Festivals: { categories: [], keywords: ["festival", "=fest"] },
  Technologie: { categories: [], keywords: ["technik", "technikmuseum", "technologie"] },
  Nachhaltigkeit: { categories: ["Nachhaltigkeit"], keywords: ["nachhaltig", "nachhaltigkeit", "=öko", "=bio"] },
  Stadtführung: { categories: ["Sehenswürdigkeiten", "Sightseeing"], keywords: ["tour", "führung", "stadtführung", "rundgang"] },
  Hinterhöfe: { categories: [], keywords: ["hinterhof", "hinterhöfe", "=höfe"] },
  Ausstellungen: { categories: [], keywords: ["ausstellung", "galerie", "sammlung"] },
  Bars: { categories: [], keywords: ["=bar", "cocktailbar", "cocktail", "rooftop"] },
  Cafés: { categories: [], keywords: ["café", "cafe", "kaffee"] },
  Restaurants: { categories: [], keywords: ["restaurant"] },
  Parks: { categories: [], keywords: ["park"] },
  Gärten: { categories: [], keywords: ["garten", "gärten"] },
  Aussichtspunkte: { categories: [], keywords: ["aussicht", "fernsehturm", "panorama", "panoramapunkt", "=berg", "teufelsberg", "kuppel", "dachterrasse"] },
  Fahrradtouren: { categories: [], keywords: ["fahrrad", "radtour", "fahrradtour", "radfahren"] },
  Wandern: { categories: [], keywords: ["wandern", "wanderung", "wald"] },
  Spielplätze: { categories: [], keywords: ["spielplatz", "spielplätze"] },
  Flohmärkte: { categories: [], keywords: ["flohmarkt", "trödel", "trödelmarkt"] },
  Galerien: { categories: [], keywords: ["galerie"] },
  Ufer: { categories: [], keywords: ["ufer", "spree", "kanal", "landwehrkanal"] },
  Kino: { categories: [], keywords: ["kino", "film", "freiluftkino"] },
  Konzerte: { categories: [], keywords: ["konzert", "philharmonie", "jazz"] },
  Comedy: { categories: [], keywords: ["comedy", "kabarett"] },
  "Street Art": { categories: [], keywords: ["street art", "streetart", "graffiti", "mural", "urban nation", "east side gallery"] },
  Bibliotheken: { categories: [], keywords: ["bibliothek"] },
  Buchläden: { categories: [], keywords: ["buchladen", "buchhandlung", "literatur", "literaturforum"] },
  "Historische Stätten": { categories: ["Geschichte"], keywords: ["historisch", "gedenkstätte", "denkmal", "schloss", "=tor", "checkpoint"] },
};

const words = (text: string): string[] =>
  text.toLowerCase().split(/[^a-zäöüß0-9]+/i).filter(Boolean);

// Zusammengesetzte Wörter, die trotz passender Endung nicht gemeint sind
const FALSE_FRIENDS: Record<string, string[]> = {
  garten: ["biergarten"],
  park: ["parkplatz", "parkhaus"],
  wald: ["kletterwald"],
};

const keywordMatches = (titleLower: string, titleWords: string[], keyword: string): boolean => {
  const kw = keyword.toLowerCase();
  const blocked = FALSE_FRIENDS[kw] || [];
  titleWords = titleWords.filter((w) => !blocked.includes(w));
  if (kw.startsWith("=")) return titleWords.includes(kw.slice(1));
  if (kw.includes(" ")) return titleLower.includes(kw);
  return titleWords.some(
    (w) => w === kw || (kw.length >= 3 && w.endsWith(kw)) || (kw.length >= 4 && w.startsWith(kw))
  );
};

export const matchesInterests = (activity: Activity | undefined | null, interests: string[] | undefined): boolean => {
  if (!activity || !interests || interests.length === 0) return false;
  const category = (activity.category || "").trim();
  const titleLower = (activity.title || "").toLowerCase();
  const titleWords = words(titleLower);

  return interests.some((interest) => {
    const rule = RULES[interest];
    // Kategorie exakt gleich dem Interesse oder in der Regel hinterlegt
    if (category === interest) return true;
    if (!rule) return keywordMatches(titleLower, titleWords, interest);
    if (rule.categories.includes(category)) return true;
    return rule.keywords.some((kw) => keywordMatches(titleLower, titleWords, kw));
  });
};

export const filterByInterestsStrict = (activities: Activity[], interests: string[] | undefined): Activity[] =>
  !interests || interests.length === 0 ? activities : activities.filter((a) => matchesInterests(a, interests));
