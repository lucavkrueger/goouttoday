
import React from 'react';

interface SpecialCaseImageProps {
  title: string;
  normalizedTitle: string;
  normalizedLocation: string;
  uniqueId: string;
  onImageFound: (imageUrl: string) => void;
}

const SpecialCaseImage: React.FC<SpecialCaseImageProps> = ({
  title,
  normalizedTitle,
  normalizedLocation,
  uniqueId,
  onImageFound
}) => {
  React.useEffect(() => {
    // STRICT EXACT MATCHING to prevent image mismatches
    
    // Neu: Molecule Man
    if (normalizedTitle === "molecule man" || 
        normalizedTitle.includes("molecule man") ||
        normalizedTitle === "molecule") {
      onImageFound("images/c_6e36b9bc3b.webp");
      return;
    }
    
    // Neu: Boxhagener Platz Flohmarkt
    if (normalizedTitle === "boxhagener platz flohmarkt" || 
        (normalizedTitle.includes("boxhagener") && normalizedTitle.includes("flohmarkt")) ||
        normalizedTitle === "flohmarkt boxhagener platz" || 
        normalizedTitle === "boxhagener platz") {
      onImageFound("images/c_891efef88a.webp");
      return;
    }
    
    // Neu: Hufeisensiedlung
    if (normalizedTitle === "hufeisensiedlung" || 
        normalizedTitle === "hufeisensiedlung berlin" ||
        normalizedTitle.includes("hufeisen") && normalizedTitle.includes("siedlung")) {
      onImageFound("images/c_fef5d0c686.webp");
      return;
    }
    
    // NEU: Karl-Marx-Allee mit neuem Bild
    if (normalizedTitle === "karl-marx-allee" || 
        normalizedTitle === "karl marx allee" ||
        normalizedTitle === "stalinallee" ||
        (normalizedTitle.includes("karl-marx") && normalizedTitle.includes("allee")) ||
        (normalizedTitle.includes("karl") && normalizedTitle.includes("marx") && normalizedTitle.includes("allee"))) {
      onImageFound("images/c_7c48f5ebb0.webp");
      return;
    }
    
    // NEU: Flughafen Tempelhof mit neuem Bild
    if (normalizedTitle === "flughafen tempelhof" || 
        normalizedTitle === "tempelhof flughafen" ||
        normalizedTitle === "tempelhof airport" ||
        normalizedTitle === "tempelhof museum" ||
        normalizedTitle === "tempelhofer feld" ||
        normalizedTitle === "tempelhof" ||
        (normalizedTitle.includes("flughafen") && normalizedTitle.includes("tempelhof")) ||
        (normalizedTitle.includes("tempelhof") && normalizedTitle.includes("field"))) {
      onImageFound("images/c_01d9ce685a.webp");
      return;
    }
    
    // NEU: Britzer Garten mit neuem Bild
    if (normalizedTitle === "britzer garten" || 
        normalizedTitle === "britzer park" ||
        normalizedTitle === "garten britz" ||
        (normalizedTitle.includes("britzer") && normalizedTitle.includes("garten")) ||
        (normalizedTitle.includes("britz") && normalizedTitle.includes("park"))) {
      onImageFound("images/c_53bd78e319.webp");
      return;
    }
    
    // NEU: Stasi Museum
    if (normalizedTitle === "stasi museum" || 
        normalizedTitle === "stasi-museum" || 
        normalizedTitle === "stasi museum berlin" ||
        (normalizedTitle.includes("stasi") && normalizedTitle.includes("museum"))) {
      onImageFound("images/c_c1945d2276.webp");
      return;
    }
    
    // NEU: Street Art Tour Kreuzberg
    if (normalizedTitle === "street art tour kreuzberg" || 
        normalizedTitle === "street art tour" ||
        normalizedTitle === "kreuzberg street art" ||
        (normalizedTitle.includes("street art") && normalizedTitle.includes("tour")) ||
        (normalizedTitle.includes("street art") && normalizedTitle.includes("kreuzberg"))) {
      onImageFound("images/c_5a5f8acd76.webp");
      return;
    }
    
    // NEU: Neue Nationalgalerie
    if (normalizedTitle === "neue nationalgalerie" || 
        normalizedTitle === "nationalgalerie" ||
        (normalizedTitle.includes("neue") && normalizedTitle.includes("nationalgalerie"))) {
      onImageFound("images/c_55128b993d.webp");
      return;
    }
    
    // NEU: Literaturforum im Brecht-Haus
    if (normalizedTitle === "literaturforum im brecht-haus" || 
        normalizedTitle === "brecht-haus" ||
        normalizedTitle === "literaturforum" ||
        (normalizedTitle.includes("literatur") && normalizedTitle.includes("brecht")) ||
        (normalizedTitle.includes("lesung") && normalizedTitle.includes("brecht"))) {
      onImageFound("images/c_bb5375427a.webp");
      return;
    }
    
    // NEU: Labyrinth Kindermuseum
    if (normalizedTitle === "labyrinth kindermuseum" || 
        normalizedTitle === "labyrinth kindermuseum berlin" ||
        normalizedTitle === "kindermuseum labyrinth" ||
        (normalizedTitle.includes("labyrinth") && normalizedTitle.includes("kinder")) ||
        (normalizedTitle.includes("kindermuseum") && normalizedTitle.includes("berlin"))) {
      onImageFound("images/c_bcd3747737.webp");
      return;
    }
    
    // NEU: Urban Nation Museum
    if (normalizedTitle === "urban nation" || 
        normalizedTitle === "urban nation museum" ||
        normalizedTitle === "urban nation museum for urban contemporary art" ||
        (normalizedTitle.includes("urban") && normalizedTitle.includes("nation")) ||
        (normalizedTitle.includes("street art") && normalizedTitle.includes("museum"))) {
      onImageFound("images/c_8ca9fdbfad.webp");
      return;
    }
    
    // NEU: Legoland Discovery Centre Berlin
    if (normalizedTitle === "legoland discovery centre" || 
        normalizedTitle === "legoland discovery centre berlin" ||
        normalizedTitle === "legoland berlin" ||
        (normalizedTitle.includes("legoland") && normalizedTitle.includes("berlin")) ||
        (normalizedTitle.includes("lego") && normalizedTitle.includes("discovery"))) {
      onImageFound("images/c_f1f5d455ae.webp");
      return;
    }
    
    // NEU: Sammlung Boros
    if (normalizedTitle === "sammlung boros" || 
        normalizedTitle === "boros sammlung" ||
        normalizedTitle === "boros collection" ||
        normalizedTitle === "boros bunker" ||
        (normalizedTitle.includes("boros") && normalizedTitle.includes("sammlung")) ||
        (normalizedTitle.includes("boros") && normalizedTitle.includes("collection")) ||
        (normalizedTitle.includes("boros") && normalizedTitle.includes("bunker"))) {
      onImageFound("images/c_9eae14fc76.webp");
      return;
    }
    
    // NEU: Deutsches Historisches Museum
    if (normalizedTitle === "deutsches historisches museum" || 
        normalizedTitle === "historisches museum" ||
        normalizedTitle === "dhm" ||
        (normalizedTitle.includes("historisches") && normalizedTitle.includes("museum")) ||
        (normalizedTitle.includes("geschichts") && normalizedTitle.includes("museum"))) {
      onImageFound("images/c_09e1ec6158.webp");
      return;
    }
    
    // NEU: Kulturbrauerei
    if (normalizedTitle === "kulturbrauerei" || 
        normalizedTitle === "kulturbrauerei berlin" ||
        normalizedTitle === "kultur brauerei" ||
        (normalizedTitle.includes("kultur") && normalizedTitle.includes("brauerei"))) {
      onImageFound("images/c_e18629ed83.webp");
      return;
    }
    
    // NEU: Viktoria Park
    if (normalizedTitle === "viktoria park" || 
        normalizedTitle === "viktoriapark" ||
        normalizedTitle === "viktoria-park" ||
        (normalizedTitle.includes("viktoria") && normalizedTitle.includes("park")) ||
        (normalizedTitle.includes("wasserfall") && normalizedTitle.includes("kreuzberg"))) {
      onImageFound("images/c_493b08e861.webp");
      return;
    }
    
    // NEU: Bergmannkiez
    if (normalizedTitle === "bergmannkiez" || 
        normalizedTitle === "bergmann kiez" ||
        normalizedTitle === "bergmannstraße" ||
        normalizedTitle === "bergmannstrasse" ||
        (normalizedTitle.includes("bergmann") && normalizedTitle.includes("kiez")) ||
        (normalizedTitle.includes("bergmann") && normalizedTitle.includes("straße"))) {
      onImageFound("images/c_b7a73b8441.webp");
      return;
    }
    
    // NEU: Hansaviertel
    if (normalizedTitle === "hansaviertel" || 
        normalizedTitle === "hansa viertel" ||
        normalizedTitle.includes("interbau") ||
        (normalizedTitle.includes("hansa") && normalizedTitle.includes("viertel")) ||
        (normalizedTitle.includes("interbau") && normalizedTitle.includes("1957"))) {
      onImageFound("images/c_a185f233f6.webp");
      return;
    }
    
    // Neu hinzugefügt: Silent Green
    if (normalizedTitle === "silent green" || 
        normalizedTitle === "silent green berlin" ||
        (normalizedTitle.includes("silent") && normalizedTitle.includes("green")) ||
        normalizedTitle === "silent green kulturquartier") {
      onImageFound("images/c_6af8507b8b.webp");
      return;
    }
    
    // Neu hinzugefügt: Deutsches Technikmuseum
    if (normalizedTitle === "deutsches technikmuseum" || 
        normalizedTitle === "technikmuseum" ||
        normalizedTitle === "technikmuseum berlin" ||
        (normalizedTitle.includes("technik") && normalizedTitle.includes("museum")) ||
        (normalizedTitle.includes("deutsches") && normalizedTitle.includes("technikmuseum"))) {
      onImageFound("images/c_a127b75759.webp");
      return;
    }
    
    // Neu hinzugefügt: Kunsthaus ACUD
    if (normalizedTitle === "kunsthaus acud" || 
        normalizedTitle === "acud" ||
        normalizedTitle === "acud kunsthaus" ||
        (normalizedTitle.includes("kunsthaus") && normalizedTitle.includes("acud"))) {
      onImageFound("images/c_6ad6054ac3.webp");
      return;
    }

    // Meridian Spa - NEU
    if ((normalizedTitle === "meridian spa") || 
        (normalizedTitle === "meridian spa berlin") ||
        (normalizedTitle.includes("meridian") && normalizedTitle.includes("spa"))) {
      onImageFound("images/c_9324dbaa2c.webp");
      return;
    }
    
    // Brandenburger Tor - NEU aktualisiertes Bild
    if ((normalizedTitle === "brandenburger tor") ||
        (normalizedTitle === "brandenburg gate") ||
        (normalizedTitle.includes("besuch") && normalizedTitle.includes("brandenburger tor"))) {
      onImageFound("images/c_0cca45d2c1.webp");
      return;
    }
    
    // Reichstag/Reichstagsgebäude - NEU aktualisiertes Bild
    if ((normalizedTitle === "reichstag") ||
        (normalizedTitle === "reichstagsgebäude") ||
        (normalizedTitle.includes("besuch") && normalizedTitle.includes("reichstag")) ||
        (normalizedTitle.includes("bundestag"))) {
      onImageFound("images/c_ce136d7c37.webp");
      return;
    }
    
    // Neue Nationalgalerie - NEU
    if ((normalizedTitle === "neue nationalgalerie") || 
        (normalizedTitle.includes("neue") && normalizedTitle.includes("nationalgalerie")) ||
        (normalizedTitle.includes("ausstellung") && normalizedTitle.includes("neue nationalgalerie"))) {
      onImageFound("images/c_81ebd73a19.webp");
      return;
    }
    
    // Street Art Tour Kreuzberg - NEU
    if ((normalizedTitle === "street art tour kreuzberg") || 
        (normalizedTitle.includes("street art") && normalizedTitle.includes("kreuzberg")) ||
        (normalizedTitle === "street art tour") || 
        (normalizedTitle.includes("street art") && normalizedTitle.includes("tour"))) {
      onImageFound("images/c_4d7eea803e.webp");
      return;
    }
    
    // Gendarmenmarkt - NEU
    if ((normalizedTitle === "gendarmenmarkt") || 
        (normalizedTitle.includes("gendarmenmarkt")) ||
        (normalizedTitle.includes("besuch") && normalizedTitle.includes("gendarmenmarkt"))) {
      onImageFound("images/c_106c4cc912.webp");
      return;
    }
    
    // Berlinische Galerie - präzise Zuordnung mit neuem Bild
    if ((normalizedTitle === "berlinische galerie") || 
        (normalizedTitle.includes("berlinische galerie")) ||
        (normalizedTitle.includes("ausstellung") && normalizedTitle.includes("berlinische galerie"))) {
      onImageFound("images/c_f6b732dd05.webp");
      return;
    }
    
    // Philharmonie - präzise Zuordnung mit neuem Bild
    if ((normalizedTitle === "philharmonie") ||
        (normalizedTitle === "berliner philharmonie") ||
        (normalizedTitle.includes("philharmonie")) ||
        (normalizedTitle.includes("konzert") && normalizedTitle.includes("philharmonie")) ||
        (normalizedTitle.includes("konzert") && normalizedTitle.includes("berliner")) ||
        (normalizedTitle.includes("konzerthaus")) ||
        (normalizedTitle === "konzert in der philharmonie")) {
      onImageFound("images/c_3bd428543a.webp");
      return;
    }
    
    // Tangoloft - PRÄZISE Zuordnung mit neuem Bild
    if ((normalizedTitle === "tangoloft") || 
        (normalizedTitle === "tangoloft berlin") ||
        (normalizedTitle.includes("tangoloft"))) {
      onImageFound("images/c_6da4c02467.webp");
      return;
    }
    
    // Pergamonmuseum - Neue präzise Zuordnung
    if ((normalizedTitle === "pergamonmuseum") || 
        (normalizedTitle === "pergamon") ||
        (normalizedTitle.includes("pergamon") && normalizedTitle.includes("museum"))) {
      onImageFound("images/c_65c3e41121.webp");
      return;
    }
    
    // Volksbühne - Neue präzise Zuordnung
    if ((normalizedTitle === "volksbühne") || 
        (normalizedTitle === "volksbühne berlin") ||
        (normalizedTitle === "volksbühne am rosa-luxemburg-platz") ||
        (normalizedTitle.includes("volksbühne"))) {
      onImageFound("images/c_70afac3a63.webp");
      return;
    }
    
    // Swing-Tanzkurse/Frannz Club - Neue präzise Zuordnung 
    if ((normalizedTitle === "frannz club") || 
        (normalizedTitle === "swing") || 
        (normalizedTitle === "swing tanzkurs") ||
        (normalizedTitle === "swing-tanzkurs") ||
        (normalizedTitle === "swing-tanzkurse") ||
        (normalizedTitle.includes("swing") && normalizedTitle.includes("tanzkurs")) ||
        (normalizedTitle.includes("swing") && normalizedTitle.includes("frannz")) ||
        (normalizedTitle.includes("frannz") && normalizedTitle.includes("club"))) {
      onImageFound("images/c_ec432f6630.webp");
      return;
    }
    
    // Spaziergang - ensure this gets the correct image and NOT tango image
    if ((normalizedTitle === "spaziergang") || 
        (normalizedTitle === "spaziergang im park") || 
        (normalizedTitle.includes("spaziergang") && normalizedTitle.includes("park")) || 
        (normalizedTitle.includes("spazieren gehen")) || 
        (normalizedTitle === "spazieren")) {
      onImageFound("images/c_7036901024.webp");
      return;
    }
    
    // Tango - ONLY for dance/tango related activities but NOT Tangoloft
    if ((normalizedTitle === "tango") || 
        (normalizedTitle === "tango tanzen") || 
        (normalizedTitle === "tanzen") ||
        (normalizedTitle === "tanzkurs") ||
        ((normalizedTitle.includes("tango") || normalizedTitle.includes("tanzen")) && 
         !normalizedTitle.includes("tangoloft") && 
         !normalizedTitle.includes("swing"))) { // Ausschluss von Swing Tanzkursen
      onImageFound("images/c_0214a81b3a.webp");
      return;
    }
    
    // Mauerpark Flohmarkt - wichtige Attraktion
    if ((normalizedTitle === "mauerpark flohmarkt") ||
        (normalizedTitle === "flohmarkt im mauerpark") ||
        (normalizedTitle.includes("mauerpark") && normalizedTitle.includes("flohmarkt"))) {
      onImageFound("images/c_fe765c561f.webp");
      return;
    }

    // Botanischer Garten
    if ((normalizedTitle === "botanischer garten") || 
        (normalizedTitle === "botanische gärten") ||
        (normalizedTitle.includes("botanischer garten berlin"))) {
      onImageFound("images/c_fcd4849360.webp");
      return;
    }

    // DDR Museum
    if ((normalizedTitle === "ddr museum") || 
        (normalizedTitle === "das ddr museum") ||
        (normalizedTitle.includes("ddr museum berlin"))) {
      onImageFound("images/c_bfd758cf6a.webp");
      return;
    }

    // Strandbad Wannsee
    if ((normalizedTitle === "strandbad wannsee") || 
        (normalizedTitle === "wannsee") ||
        (normalizedTitle.includes("strandbad") && normalizedTitle.includes("wannsee"))) {
      onImageFound("images/c_05eea61f18.webp");
      return;
    }

    // Berliner Zoo
    if ((normalizedTitle === "zoo berlin") || 
        (normalizedTitle === "berliner zoo") || 
        (normalizedTitle === "zoologischer garten") ||
        (normalizedTitle.includes("besuch") && normalizedTitle.includes("zoo"))) {
      onImageFound("images/c_0556c7e7a0.webp");
      return;
    }

    // Tiergarten
    if ((normalizedTitle === "tiergarten") || 
        (normalizedTitle === "großer tiergarten") ||
        (normalizedTitle.includes("spaziergang") && normalizedTitle.includes("tiergarten"))) {
      onImageFound("images/c_a1f32230b1.webp");
      return;
    }
    
    // Fernsehturm
    if ((normalizedTitle === "fernsehturm") || 
        (normalizedTitle === "berliner fernsehturm") ||
        (normalizedTitle === "tv tower")) {
      onImageFound("images/c_7a96b5383c.webp");
      return;
    }
    
    // Badeschiff
    if ((normalizedTitle === "badeschiff") ||
        (normalizedTitle.includes("baden") && normalizedTitle.includes("badeschiff"))) {
      onImageFound("images/c_84e2a82550.webp");
      return;
    }
    
    // Stasi-Museum
    if ((normalizedTitle === "stasi-museum") || 
        (normalizedTitle === "stasi museum") ||
        (normalizedTitle.includes("museum") && normalizedTitle.includes("stasi"))) {
      onImageFound("images/c_6b615c2a8c.webp");
      return;
    }

    // Spandauer Zitadelle
    if ((normalizedTitle === "zitadelle spandau") || 
        (normalizedTitle === "spandauer zitadelle") ||
        (normalizedTitle.includes("zitadelle") && normalizedTitle.includes("spandau"))) {
      onImageFound("images/c_7ef9308305.webp");
      return;
    }
    
    // Neue Nationalgalerie
    if ((normalizedTitle === "neue nationalgalerie") || 
        (normalizedTitle === "nationalgalerie") ||
        (normalizedTitle.includes("neue") && normalizedTitle.includes("nationalgalerie"))) {
      onImageFound("images/c_7198ec3711.webp");
      return;
    }
    
    // Museum Island / Museumsinsel
    if ((normalizedTitle === "museumsinsel") || 
        (normalizedTitle === "museum island") ||
        (normalizedTitle.includes("museum") && normalizedTitle.includes("insel"))) {
      onImageFound("images/c_c959792457.webp");
      return;
    }
    
    // Tempelhof - jetzt mit neuem Bild
    if ((normalizedTitle === "tempelhof") || 
        (normalizedTitle === "tempelhofer feld") || 
        (normalizedTitle === "flughafen tempelhof") ||
        (normalizedTitle.includes("tempelhof") && normalizedTitle.includes("feld"))) {
      onImageFound("images/c_01d9ce685a.webp");
      return;
    }

    // Prenzlauer Berg
    if ((normalizedLocation === "prenzlauer berg") ||
        (normalizedTitle.includes("prenzlauer berg"))) {
      onImageFound("images/c_6f2c93fb59.webp");
      return;
    }
    
    // Philharmonie - enhanced precise matching
    if ((normalizedTitle === "philharmonie") ||
        (normalizedTitle === "berliner philharmonie") ||
        (normalizedTitle.includes("philharmonie")) ||
        (normalizedTitle.includes("konzert") && normalizedTitle.includes("philharmonie")) ||
        (normalizedTitle.includes("konzert") && normalizedTitle.includes("berliner")) ||
        (normalizedTitle.includes("konzerthaus")) ||
        (normalizedTitle === "konzert in der philharmonie")) {
      onImageFound("images/c_0c8e7162e3.webp");
      return;
    }

    // Wellness specific activities - ADDED FOR WELLNESS CATEGORY
    if ((normalizedTitle === "vabali spa") || 
        (normalizedTitle === "liquidrom") || 
        (normalizedTitle === "meridian spa") || 
        (normalizedTitle === "meridian spa berlin") ||
        (normalizedTitle.includes("spa") && normalizedTitle.includes("wellness")) ||
        (normalizedTitle.includes("sauna") && normalizedTitle.includes("berlin")) ||
        (normalizedTitle.includes("massage") && normalizedTitle.includes("wellness")) ||
        (normalizedTitle.includes("therme") && normalizedTitle.includes("berlin"))) {
      onImageFound("images/c_9324dbaa2c.webp"); // NEU: Meridian Spa für Wellness
      return;
    }

    // Schloss Charlottenburg - neue präzise Zuordnung
    if ((normalizedTitle === "schloss charlottenburg") || 
        (normalizedTitle.includes("schloss charlottenburg")) ||
        (normalizedTitle.includes("schloss") && normalizedTitle.includes("charlottenburg")) ||
        (normalizedTitle.includes("charlottenburger schloss"))) {
      onImageFound("images/c_c116a3e03d.webp"); // Neues Bild für Schloss Charlottenburg
      return;
    }
    
    // Berliner Dom - neue präzise Zuordnung
    if ((normalizedTitle === "berliner dom") || 
        (normalizedTitle.includes("berlin cathedral")) ||
        (normalizedTitle.includes("dom") && normalizedTitle.includes("berlin"))) {
      onImageFound("images/c_8afebb7e24.webp"); // Neues Bild für Berliner Dom
      return;
    }
    
    // Berghain - neue präzise Zuordnung
    if ((normalizedTitle === "berghain") || 
        (normalizedTitle.includes("berghain")) ||
        (normalizedTitle.includes("club") && normalizedTitle.includes("berghain"))) {
      onImageFound("images/c_c568ca5d85.webp"); // Neues Bild für Berghain
      return;
    }
    
    // NEU: Britzer Garten
    if ((normalizedTitle === "britzer garten") || 
        (normalizedTitle === "britzer park") ||
        (normalizedTitle.includes("britzer") && normalizedTitle.includes("garten"))) {
      onImageFound("images/c_53bd78e319.webp"); // Neues Bild für Britzer Garten
      return;
    }

    // Special matching for remaining popular activities that had uploaded photos
    if (normalizedTitle.includes("von oben") || normalizedTitle.includes("aussicht")) {
      onImageFound("images/c_7a96b5383c.webp"); // Fernsehturm as fallback for views
      return;
    }
    
    if (normalizedTitle.includes("museum") && !normalizedTitle.includes("ddr") && 
        !normalizedTitle.includes("stasi") && !normalizedTitle.includes("pergamon")) {
      onImageFound("images/c_c959792457.webp"); // Museum island for general museums
      return;
    }
    
    if (normalizedTitle.includes("park") && !normalizedTitle.includes("mauerpark") && !normalizedTitle.includes("spreepark")) {
      onImageFound("images/c_53bd78e319.webp"); // NEU: Britzer Garten für parks
      return;
    }
    
    if ((normalizedTitle.includes("see") || normalizedTitle.includes("schwimmen") || normalizedTitle.includes("wasser") || 
        normalizedTitle.includes("sup") || normalizedTitle.includes("paddling")) && 
        !normalizedTitle.includes("landwehrkanal")) {
      onImageFound("images/c_05eea61f18.webp"); // Wannsee for water activities
      return;
    }
    
    if (normalizedTitle.includes("flohmarkt") && !normalizedTitle.includes("mauerpark")) {
      onImageFound("images/c_fe765c561f.webp"); // Use Mauerpark Flohmarkt for other markets
      return;
    }
    
    if (normalizedTitle.includes("konzert") || normalizedTitle.includes("musik") || normalizedTitle.includes("oper") ||
        normalizedTitle.includes("jazz")) {
      onImageFound("images/c_4441e330ce.webp"); // Use Jazz image for music/concert activities
      return;
    }
    
    // Add fallback for wellness category
    if (normalizedTitle.includes("wellness") || normalizedTitle.includes("entspannung") || 
        normalizedTitle.includes("massage") || normalizedTitle.includes("spa") || normalizedTitle.includes("thermen")) {
      onImageFound("images/c_23d9fc7cfb.webp"); // NEU: Thermen am Europa Center für Wellness
      return;
    }
    
    // Clubbing und Nachtleben mit Berghain als Bild
    if (normalizedTitle.includes("club") || normalizedTitle.includes("nachtleben") || 
        normalizedTitle.includes("party") || normalizedTitle.includes("techno")) {
      onImageFound("images/c_c568ca5d85.webp"); // Berghain für Nightlife
      return;
    }
    
    // Klettern und action activities
    if (normalizedTitle.includes("klettern") || normalizedTitle.includes("kletterpark") ||
        normalizedTitle.includes("action") || normalizedTitle.includes("abenteuer")) {
      onImageFound("images/c_ea211e5c52.webp"); // Kletterwald image
      return;
    }
    
    // Ball, dance and romantic activities
    if (normalizedTitle.includes("tanz") || normalizedTitle.includes("ball") ||
        normalizedTitle.includes("ballhaus") || normalizedTitle.includes("romantik")) {
      onImageFound("images/c_d4c1919433.webp"); // Clärchens Ballhaus
      return;
    }
  }, [normalizedTitle, normalizedLocation, uniqueId, onImageFound]);

  return null;
};

export default SpecialCaseImage;
