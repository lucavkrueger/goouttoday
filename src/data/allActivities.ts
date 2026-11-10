export interface Activity {
  id: number;
  title: string;
  description: string;
  location: string;
  address: string;
  image: string;
  category: string;
  distance?: number;
  price: string;
  duration: string;
  date?: string;
  link: string;
  ticketLink?: string;
}

// Sample activities for random suggestions
export const randomActivities: Activity[] = [
  {
    id: 1,
    title: "Spaziergang im Tiergarten",
    description: "Genießen Sie einen entspannten Spaziergang durch Berlins größten und ältesten Park.",
    location: "Berlin",
    address: "Straße des 17. Juni, 10785 Berlin",
    image: "images/u_3e7ea87565.webp",
    category: "Natur",
    price: "Kostenlos",
    duration: "1-2 Stunden",
    link: "/activity/1"
  },
  {
    id: 2,
    title: "Besuch des Deutschen Museums",
    description: "Entdecken Sie Deutschlands größtes naturwissenschaftlich-technisches Museum.",
    location: "München",
    address: "Museumsinsel 1, 80538 München",
    image: "images/u_79873e3187.webp",
    category: "Kultur",
    price: "15€",
    duration: "3-4 Stunden",
    link: "/activity/2"
  },
  {
    id: 3,
    title: "Hafenrundfahrt",
    description: "Erleben Sie den Hamburger Hafen vom Wasser aus.",
    location: "Hamburg",
    address: "St. Pauli-Landungsbrücken, 20359 Hamburg",
    image: "images/r_c8af731439.webp",
    category: "Sightseeing",
    price: "25€",
    duration: "1-2 Stunden",
    link: "/activity/3"
  },
  {
    id: 4,
    title: "Kletterkurs für Anfänger",
    description: "Lernen Sie die Grundlagen des Kletterns in einer sicheren Umgebung.",
    location: "Köln",
    address: "Kletterhalle, 50667 Köln",
    image: "images/u_9b2e2b855f.webp",
    category: "Sport",
    price: "35€",
    duration: "2 Stunden",
    link: "/activity/4"
  },
  {
    id: 5,
    title: "Weinprobe im Rheingau",
    description: "Probieren Sie ausgewählte Weine der Region bei einer geführten Weinprobe.",
    location: "Frankfurt",
    address: "Weingut, 65347 Rheingau",
    image: "images/u_3fb30bcc63.webp",
    category: "Essen & Trinken",
    price: "40€",
    duration: "2-3 Stunden",
    link: "/activity/5"
  }
];

// Personalized activities based on user interests
export const personalizedActivitiesList: Activity[] = [
  {
    id: 101,
    title: "Kunstworkshop",
    description: "Entdecken Sie Ihre kreative Seite in einem geführten Kunstworkshop.",
    location: "Berlin",
    address: "Künstleratelier, 10997 Berlin",
    image: "images/u_4a48700b10.webp",
    category: "Kultur",
    price: "30€",
    duration: "3 Stunden",
    link: "/activity/101"
  },
  {
    id: 102,
    title: "Outdoor Yoga im Park",
    description: "Entspannen Sie bei einer Yoga-Session unter freiem Himmel.",
    location: "München",
    address: "Englischer Garten, 80538 München",
    image: "images/u_806d6e6a8d.webp",
    category: "Sport",
    price: "12€",
    duration: "1 Stunde",
    link: "/activity/102"
  },
  {
    id: 103,
    title: "Street Food Festival",
    description: "Genießen Sie internationale Köstlichkeiten beim jährlichen Street Food Festival.",
    location: "Hamburg",
    address: "Messehallen, 20357 Hamburg",
    image: "images/u_a34feaabda.webp",
    category: "Essen & Trinken",
    price: "Eintritt frei, Speisen ab 5€",
    duration: "Den ganzen Tag",
    date: "2025-06-15",
    link: "/activity/103"
  },
  {
    id: 104,
    title: "Historische Stadtführung",
    description: "Erfahren Sie mehr über die Geschichte der Stadt bei einer geführten Tour.",
    location: "Köln",
    address: "Kölner Dom, 50667 Köln",
    image: "images/c_b823ad226d.webp",
    category: "Sightseeing",
    price: "15€",
    duration: "2 Stunden",
    link: "/activity/104"
  },
  {
    id: 105,
    title: "Botanischer Garten",
    description: "Entdecken Sie exotische Pflanzen im botanischen Garten.",
    location: "Frankfurt",
    address: "Siesmayerstraße 72, 60323 Frankfurt am Main",
    image: "images/c_0aaababe5a.webp",
    category: "Natur",
    price: "8€",
    duration: "1-3 Stunden",
    link: "/activity/105"
  }
];

import { berlinActivities } from './citiesActivities';
import { muenchenActivities } from './citiesActivities';
import { hamburgActivities } from './citiesActivities';
import { koelnActivities } from './citiesActivities';

// Combining all activities from different cities
export const allCitiesActivities = [
  ...berlinActivities,
  ...muenchenActivities,
  ...hamburgActivities,
  ...koelnActivities
];
