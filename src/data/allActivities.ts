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
    image: "https://images.unsplash.com/photo-1560930950-5cc20e80e392?q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1564260975755-0fc2a9eeb864?q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1583425722128-4c2c7c37f8e9?q=80&w=1000",
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
    image: "https://images.unsplash.com/photo-1564986339599-57211c8d3d70?q=80&w=1000",
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
