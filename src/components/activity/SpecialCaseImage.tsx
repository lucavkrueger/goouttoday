
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
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_Spree_Molecule_men_gesamtansicht.jpg?width=960");
      return;
    }
    
    // Neu: Boxhagener Platz Flohmarkt
    if (normalizedTitle === "boxhagener platz flohmarkt" || 
        (normalizedTitle.includes("boxhagener") && normalizedTitle.includes("flohmarkt")) ||
        normalizedTitle === "flohmarkt boxhagener platz" || 
        normalizedTitle === "boxhagener platz") {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/BoxhagenerPlatzFleamarket.jpg?width=960");
      return;
    }
    
    // Neu: Hufeisensiedlung
    if (normalizedTitle === "hufeisensiedlung" || 
        normalizedTitle === "hufeisensiedlung berlin" ||
        normalizedTitle.includes("hufeisen") && normalizedTitle.includes("siedlung")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_Hufeisensiedlung_UAV_04-2017.jpg?width=960");
      return;
    }
    
    // NEU: Karl-Marx-Allee mit neuem Bild
    if (normalizedTitle === "karl-marx-allee" || 
        normalizedTitle === "karl marx allee" ||
        normalizedTitle === "stalinallee" ||
        (normalizedTitle.includes("karl-marx") && normalizedTitle.includes("allee")) ||
        (normalizedTitle.includes("karl") && normalizedTitle.includes("marx") && normalizedTitle.includes("allee"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Karl-Marx-Allee_Berlin_4.jpg?width=960");
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
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/BERLIN,_Tempelhof_flughafen.JPG?width=960");
      return;
    }
    
    // NEU: Britzer Garten mit neuem Bild
    if (normalizedTitle === "britzer garten" || 
        normalizedTitle === "britzer park" ||
        normalizedTitle === "garten britz" ||
        (normalizedTitle.includes("britzer") && normalizedTitle.includes("garten")) ||
        (normalizedTitle.includes("britz") && normalizedTitle.includes("park"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Britzer_Garten,_Berlin-Neuk%C3%B6lln_(Britz),_Bild_1.jpg?width=960");
      return;
    }
    
    // NEU: Stasi Museum
    if (normalizedTitle === "stasi museum" || 
        normalizedTitle === "stasi-museum" || 
        normalizedTitle === "stasi museum berlin" ||
        (normalizedTitle.includes("stasi") && normalizedTitle.includes("museum"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_Stasi_Normannenstrasse_2005.jpg?width=960");
      return;
    }
    
    // NEU: Street Art Tour Kreuzberg
    if (normalizedTitle === "street art tour kreuzberg" || 
        normalizedTitle === "street art tour" ||
        normalizedTitle === "kreuzberg street art" ||
        (normalizedTitle.includes("street art") && normalizedTitle.includes("tour")) ||
        (normalizedTitle.includes("street art") && normalizedTitle.includes("kreuzberg"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_RAW-Gel%C3%A4nde_2020.jpg?width=960");
      return;
    }
    
    // NEU: Neue Nationalgalerie
    if (normalizedTitle === "neue nationalgalerie" || 
        normalizedTitle === "nationalgalerie" ||
        (normalizedTitle.includes("neue") && normalizedTitle.includes("nationalgalerie"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Neue_Nationalgalerie_Berlin.jpg?width=960");
      return;
    }
    
    // NEU: Literaturforum im Brecht-Haus
    if (normalizedTitle === "literaturforum im brecht-haus" || 
        normalizedTitle === "brecht-haus" ||
        normalizedTitle === "literaturforum" ||
        (normalizedTitle.includes("literatur") && normalizedTitle.includes("brecht")) ||
        (normalizedTitle.includes("lesung") && normalizedTitle.includes("brecht"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin,_Mitte,_Chausseestrasse_125,_Bertolt-Brecht-Haus.jpg?width=960");
      return;
    }
    
    // NEU: Labyrinth Kindermuseum
    if (normalizedTitle === "labyrinth kindermuseum" || 
        normalizedTitle === "labyrinth kindermuseum berlin" ||
        normalizedTitle === "kindermuseum labyrinth" ||
        (normalizedTitle.includes("labyrinth") && normalizedTitle.includes("kinder")) ||
        (normalizedTitle.includes("kindermuseum") && normalizedTitle.includes("berlin"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Labyrinth_Ausstellungshalle.jpg?width=960");
      return;
    }
    
    // NEU: Urban Nation Museum
    if (normalizedTitle === "urban nation" || 
        normalizedTitle === "urban nation museum" ||
        normalizedTitle === "urban nation museum for urban contemporary art" ||
        (normalizedTitle.includes("urban") && normalizedTitle.includes("nation")) ||
        (normalizedTitle.includes("street art") && normalizedTitle.includes("museum"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Urban_Nation_Museum_(Berlin)_-_Januar_2024_am_Abend.jpg?width=960");
      return;
    }
    
    // NEU: Legoland Discovery Centre Berlin
    if (normalizedTitle === "legoland discovery centre" || 
        normalizedTitle === "legoland discovery centre berlin" ||
        normalizedTitle === "legoland berlin" ||
        (normalizedTitle.includes("legoland") && normalizedTitle.includes("berlin")) ||
        (normalizedTitle.includes("lego") && normalizedTitle.includes("discovery"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Legoland_Berlin_-_panoramio_(2).jpg?width=960");
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
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Le_bunker_de_la_fondation_Boros_(Berlin)_(23504580538).jpg?width=960");
      return;
    }
    
    // NEU: Deutsches Historisches Museum
    if (normalizedTitle === "deutsches historisches museum" || 
        normalizedTitle === "historisches museum" ||
        normalizedTitle === "dhm" ||
        (normalizedTitle.includes("historisches") && normalizedTitle.includes("museum")) ||
        (normalizedTitle.includes("geschichts") && normalizedTitle.includes("museum"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Deutsches_Historisches_Museum_(Zeughaus),_Berlin,_1703_(1)_(40181061421).jpg?width=960");
      return;
    }
    
    // NEU: Kulturbrauerei
    if (normalizedTitle === "kulturbrauerei" || 
        normalizedTitle === "kulturbrauerei berlin" ||
        normalizedTitle === "kultur brauerei" ||
        (normalizedTitle.includes("kultur") && normalizedTitle.includes("brauerei"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin-Kulturbrauerei.jpg?width=960");
      return;
    }
    
    // NEU: Viktoria Park
    if (normalizedTitle === "viktoria park" || 
        normalizedTitle === "viktoriapark" ||
        normalizedTitle === "viktoria-park" ||
        (normalizedTitle.includes("viktoria") && normalizedTitle.includes("park")) ||
        (normalizedTitle.includes("wasserfall") && normalizedTitle.includes("kreuzberg"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Kreuzberg_Berlin_Viktoriapark_Wasserfall.jpg?width=960");
      return;
    }
    
    // NEU: Bergmannkiez
    if (normalizedTitle === "bergmannkiez" || 
        normalizedTitle === "bergmann kiez" ||
        normalizedTitle === "bergmannstraße" ||
        normalizedTitle === "bergmannstrasse" ||
        (normalizedTitle.includes("bergmann") && normalizedTitle.includes("kiez")) ||
        (normalizedTitle.includes("bergmann") && normalizedTitle.includes("straße"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Kreuzberg_Bergmannstra%C3%9Fe_Parklets.jpg?width=960");
      return;
    }
    
    // NEU: Hansaviertel
    if (normalizedTitle === "hansaviertel" || 
        normalizedTitle === "hansa viertel" ||
        normalizedTitle.includes("interbau") ||
        (normalizedTitle.includes("hansa") && normalizedTitle.includes("viertel")) ||
        (normalizedTitle.includes("interbau") && normalizedTitle.includes("1957"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Hansaviertel-Interbau-Berlin-Tiergarten-Schwedenhaus-Jaenecke-Samuelson.jpg?width=960");
      return;
    }
    
    // Neu hinzugefügt: Silent Green
    if (normalizedTitle === "silent green" || 
        normalizedTitle === "silent green berlin" ||
        (normalizedTitle.includes("silent") && normalizedTitle.includes("green")) ||
        normalizedTitle === "silent green kulturquartier") {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Krematorium_Wedding.jpg?width=960");
      return;
    }
    
    // Neu hinzugefügt: Deutsches Technikmuseum
    if (normalizedTitle === "deutsches technikmuseum" || 
        normalizedTitle === "technikmuseum" ||
        normalizedTitle === "technikmuseum berlin" ||
        (normalizedTitle.includes("technik") && normalizedTitle.includes("museum")) ||
        (normalizedTitle.includes("deutsches") && normalizedTitle.includes("technikmuseum"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Deutsches_technikmuseum_berlin_20080429.jpg?width=960");
      return;
    }
    
    // Neu hinzugefügt: Kunsthaus ACUD
    if (normalizedTitle === "kunsthaus acud" || 
        normalizedTitle === "acud" ||
        normalizedTitle === "acud kunsthaus" ||
        (normalizedTitle.includes("kunsthaus") && normalizedTitle.includes("acud"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin-ACUD_2.jpg?width=960");
      return;
    }

    // Meridian Spa - NEU
    if ((normalizedTitle === "meridian spa") || 
        (normalizedTitle === "meridian spa berlin") ||
        (normalizedTitle.includes("meridian") && normalizedTitle.includes("spa"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Flamingo_Spa_%26_Wellness.jpg?width=960");
      return;
    }
    
    // Brandenburger Tor - NEU aktualisiertes Bild
    if ((normalizedTitle === "brandenburger tor") ||
        (normalizedTitle === "brandenburg gate") ||
        (normalizedTitle.includes("besuch") && normalizedTitle.includes("brandenburger tor"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Brandenburger_Tor_abends.jpg?width=960");
      return;
    }
    
    // Reichstag/Reichstagsgebäude - NEU aktualisiertes Bild
    if ((normalizedTitle === "reichstag") ||
        (normalizedTitle === "reichstagsgebäude") ||
        (normalizedTitle.includes("besuch") && normalizedTitle.includes("reichstag")) ||
        (normalizedTitle.includes("bundestag"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Reichstagsgeb%C3%A4ude_-_Westansicht.jpg?width=960");
      return;
    }
    
    // Neue Nationalgalerie - NEU
    if ((normalizedTitle === "neue nationalgalerie") || 
        (normalizedTitle.includes("neue") && normalizedTitle.includes("nationalgalerie")) ||
        (normalizedTitle.includes("ausstellung") && normalizedTitle.includes("neue nationalgalerie"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Neue_Nationalgalerie_Berlin_-_von_oben.jpg?width=960");
      return;
    }
    
    // Street Art Tour Kreuzberg - NEU
    if ((normalizedTitle === "street art tour kreuzberg") || 
        (normalizedTitle.includes("street art") && normalizedTitle.includes("kreuzberg")) ||
        (normalizedTitle === "street art tour") || 
        (normalizedTitle.includes("street art") && normalizedTitle.includes("tour"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Streetart_Wrangelkiez_Berlin-Kreuzberg.jpg?width=960");
      return;
    }
    
    // Gendarmenmarkt - NEU
    if ((normalizedTitle === "gendarmenmarkt") || 
        (normalizedTitle.includes("gendarmenmarkt")) ||
        (normalizedTitle.includes("besuch") && normalizedTitle.includes("gendarmenmarkt"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Gendarmenmarkt_Berlin-Mitte.jpg?width=960");
      return;
    }
    
    // Berlinische Galerie - präzise Zuordnung mit neuem Bild
    if ((normalizedTitle === "berlinische galerie") || 
        (normalizedTitle.includes("berlinische galerie")) ||
        (normalizedTitle.includes("ausstellung") && normalizedTitle.includes("berlinische galerie"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/La_Berlinische_Galerie_(Berlin)_(36584925874).jpg?width=960");
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
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Philharmonie_Berlin.jpg?width=960");
      return;
    }
    
    // Tangoloft - PRÄZISE Zuordnung mit neuem Bild
    if ((normalizedTitle === "tangoloft") || 
        (normalizedTitle === "tangoloft berlin") ||
        (normalizedTitle.includes("tangoloft"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Tango_dance.jpg?width=960");
      return;
    }
    
    // Pergamonmuseum - Neue präzise Zuordnung
    if ((normalizedTitle === "pergamonmuseum") || 
        (normalizedTitle === "pergamon") ||
        (normalizedTitle.includes("pergamon") && normalizedTitle.includes("museum"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_-_Pergamonmuseum_-_Altar_01.jpg?width=960");
      return;
    }
    
    // Volksbühne - Neue präzise Zuordnung
    if ((normalizedTitle === "volksbühne") || 
        (normalizedTitle === "volksbühne berlin") ||
        (normalizedTitle === "volksbühne am rosa-luxemburg-platz") ||
        (normalizedTitle.includes("volksbühne"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Volksb%C3%BChne_am_Rosa-Luxemburg-Platz.jpg?width=960");
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
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Lindy_hop_dip.jpg?width=960");
      return;
    }
    
    // Spaziergang - ensure this gets the correct image and NOT tango image
    if ((normalizedTitle === "spaziergang") || 
        (normalizedTitle === "spaziergang im park") || 
        (normalizedTitle.includes("spaziergang") && normalizedTitle.includes("park")) || 
        (normalizedTitle.includes("spazieren gehen")) || 
        (normalizedTitle === "spazieren")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Humboldthain_Rosengarten.jpg?width=960");
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
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Volkspark_Hasenheide.jpg?width=960");
      return;
    }
    
    // Mauerpark Flohmarkt - wichtige Attraktion
    if ((normalizedTitle === "mauerpark flohmarkt") ||
        (normalizedTitle === "flohmarkt im mauerpark") ||
        (normalizedTitle.includes("mauerpark") && normalizedTitle.includes("flohmarkt"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin-Mauerpark-Flohmarkt_(1).jpg?width=960");
      return;
    }

    // Botanischer Garten
    if ((normalizedTitle === "botanischer garten") || 
        (normalizedTitle === "botanische gärten") ||
        (normalizedTitle.includes("botanischer garten berlin"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Gewaechshaus_Botanischer_Garten_Berlin.jpg?width=960");
      return;
    }

    // DDR Museum
    if ((normalizedTitle === "ddr museum") || 
        (normalizedTitle === "das ddr museum") ||
        (normalizedTitle.includes("ddr museum berlin"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_DDR-Museum_an_der_Spree_01.jpg?width=960");
      return;
    }

    // Strandbad Wannsee
    if ((normalizedTitle === "strandbad wannsee") || 
        (normalizedTitle === "wannsee") ||
        (normalizedTitle.includes("strandbad") && normalizedTitle.includes("wannsee"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Strandbad_wannsee.jpg?width=960");
      return;
    }

    // Berliner Zoo
    if ((normalizedTitle === "zoo berlin") || 
        (normalizedTitle === "berliner zoo") || 
        (normalizedTitle === "zoologischer garten") ||
        (normalizedTitle.includes("besuch") && normalizedTitle.includes("zoo"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_-_Tempodrom.jpg?width=960");
      return;
    }

    // Tiergarten
    if ((normalizedTitle === "tiergarten") || 
        (normalizedTitle === "großer tiergarten") ||
        (normalizedTitle.includes("spaziergang") && normalizedTitle.includes("tiergarten"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Path_in_Gro%C3%9Fer_Tiergarten_Berlin_2024-05-09_01.jpg?width=960");
      return;
    }
    
    // Fernsehturm
    if ((normalizedTitle === "fernsehturm") || 
        (normalizedTitle === "berliner fernsehturm") ||
        (normalizedTitle === "tv tower")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_-_view_from_Fernsehturm_to_Alexanderplatz.jpg?width=960");
      return;
    }
    
    // Badeschiff
    if ((normalizedTitle === "badeschiff") ||
        (normalizedTitle.includes("baden") && normalizedTitle.includes("badeschiff"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Germany_Spree_bad_kl1.jpg?width=960");
      return;
    }
    
    // Stasi-Museum
    if ((normalizedTitle === "stasi-museum") || 
        (normalizedTitle === "stasi museum") ||
        (normalizedTitle.includes("museum") && normalizedTitle.includes("stasi"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Sede_Stasi_Museum.JPG?width=960");
      return;
    }

    // Spandauer Zitadelle
    if ((normalizedTitle === "zitadelle spandau") || 
        (normalizedTitle === "spandauer zitadelle") ||
        (normalizedTitle.includes("zitadelle") && normalizedTitle.includes("spandau"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_Tierpark_Friedrichsfelde_12-2015_Schloss_img1.jpg?width=960");
      return;
    }
    
    // Neue Nationalgalerie
    if ((normalizedTitle === "neue nationalgalerie") || 
        (normalizedTitle === "nationalgalerie") ||
        (normalizedTitle.includes("neue") && normalizedTitle.includes("nationalgalerie"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Neue_Nationalgalerie_P7130065.JPG?width=960");
      return;
    }
    
    // Museum Island / Museumsinsel
    if ((normalizedTitle === "museumsinsel") || 
        (normalizedTitle === "museum island") ||
        (normalizedTitle.includes("museum") && normalizedTitle.includes("insel"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Museumsinsel_Berlin.jpg?width=960");
      return;
    }
    
    // Tempelhof - jetzt mit neuem Bild
    if ((normalizedTitle === "tempelhof") || 
        (normalizedTitle === "tempelhofer feld") || 
        (normalizedTitle === "flughafen tempelhof") ||
        (normalizedTitle.includes("tempelhof") && normalizedTitle.includes("feld"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/BERLIN,_Tempelhof_flughafen.JPG?width=960");
      return;
    }

    // Prenzlauer Berg
    if ((normalizedLocation === "prenzlauer berg") ||
        (normalizedTitle.includes("prenzlauer berg"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin-Prenzlauer_Berg_-_Kollwitzplatz_03.jpg?width=960");
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
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Mauerpark-karaoke-amphitheater-2011.jpg?width=960");
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
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Flamingo_Spa_%26_Wellness.jpg?width=960"); // NEU: Meridian Spa für Wellness
      return;
    }

    // Schloss Charlottenburg - neue präzise Zuordnung
    if ((normalizedTitle === "schloss charlottenburg") || 
        (normalizedTitle.includes("schloss charlottenburg")) ||
        (normalizedTitle.includes("schloss") && normalizedTitle.includes("charlottenburg")) ||
        (normalizedTitle.includes("charlottenburger schloss"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_-_Schloss-Charlottenburg.jpg?width=960"); // Neues Bild für Schloss Charlottenburg
      return;
    }
    
    // Berliner Dom - neue präzise Zuordnung
    if ((normalizedTitle === "berliner dom") || 
        (normalizedTitle.includes("berlin cathedral")) ||
        (normalizedTitle.includes("dom") && normalizedTitle.includes("berlin"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berliner_Dom_%26_Lustgarten.jpg?width=960"); // Neues Bild für Berliner Dom
      return;
    }
    
    // Berghain - neue präzise Zuordnung
    if ((normalizedTitle === "berghain") || 
        (normalizedTitle.includes("berghain")) ||
        (normalizedTitle.includes("club") && normalizedTitle.includes("berghain"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_Berghain.jpg?width=960"); // Neues Bild für Berghain
      return;
    }
    
    // NEU: Britzer Garten
    if ((normalizedTitle === "britzer garten") || 
        (normalizedTitle === "britzer park") ||
        (normalizedTitle.includes("britzer") && normalizedTitle.includes("garten"))) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Britzer_Garten,_Berlin-Neuk%C3%B6lln_(Britz),_Bild_1.jpg?width=960"); // Neues Bild für Britzer Garten
      return;
    }

    // Special matching for remaining popular activities that had uploaded photos
    if (normalizedTitle.includes("von oben") || normalizedTitle.includes("aussicht")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_-_view_from_Fernsehturm_to_Alexanderplatz.jpg?width=960"); // Fernsehturm as fallback for views
      return;
    }
    
    if (normalizedTitle.includes("museum") && !normalizedTitle.includes("ddr") && 
        !normalizedTitle.includes("stasi") && !normalizedTitle.includes("pergamon")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Museumsinsel_Berlin.jpg?width=960"); // Museum island for general museums
      return;
    }
    
    if (normalizedTitle.includes("park") && !normalizedTitle.includes("mauerpark") && !normalizedTitle.includes("spreepark")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Britzer_Garten,_Berlin-Neuk%C3%B6lln_(Britz),_Bild_1.jpg?width=960"); // NEU: Britzer Garten für parks
      return;
    }
    
    if ((normalizedTitle.includes("see") || normalizedTitle.includes("schwimmen") || normalizedTitle.includes("wasser") || 
        normalizedTitle.includes("sup") || normalizedTitle.includes("paddling")) && 
        !normalizedTitle.includes("landwehrkanal")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Strandbad_wannsee.jpg?width=960"); // Wannsee for water activities
      return;
    }
    
    if (normalizedTitle.includes("flohmarkt") && !normalizedTitle.includes("mauerpark")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin-Mauerpark-Flohmarkt_(1).jpg?width=960"); // Use Mauerpark Flohmarkt for other markets
      return;
    }
    
    if (normalizedTitle.includes("konzert") || normalizedTitle.includes("musik") || normalizedTitle.includes("oper") ||
        normalizedTitle.includes("jazz")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin,_Mitte,_In_den_Ministergaerten_4,_Saarlaendische_Landesvertretung.jpg?width=960"); // Use Jazz image for music/concert activities
      return;
    }
    
    // Add fallback for wellness category
    if (normalizedTitle.includes("wellness") || normalizedTitle.includes("entspannung") || 
        normalizedTitle.includes("massage") || normalizedTitle.includes("spa") || normalizedTitle.includes("thermen")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_-_Europa-Center.jpg?width=960"); // NEU: Thermen am Europa Center für Wellness
      return;
    }
    
    // Clubbing und Nachtleben mit Berghain als Bild
    if (normalizedTitle.includes("club") || normalizedTitle.includes("nachtleben") || 
        normalizedTitle.includes("party") || normalizedTitle.includes("techno")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_Berghain.jpg?width=960"); // Berghain für Nightlife
      return;
    }
    
    // Klettern und action activities
    if (normalizedTitle.includes("klettern") || normalizedTitle.includes("kletterpark") ||
        normalizedTitle.includes("action") || normalizedTitle.includes("abenteuer")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin_Volkspark_Jungfernheide.jpg?width=960"); // Kletterwald image
      return;
    }
    
    // Ball, dance and romantic activities
    if (normalizedTitle.includes("tanz") || normalizedTitle.includes("ball") ||
        normalizedTitle.includes("ballhaus") || normalizedTitle.includes("romantik")) {
      onImageFound("https://commons.wikimedia.org/wiki/Special:FilePath/Berlin,_Mitte,_Auguststrasse_24-25,_Claerchens_Ballhaus.jpg?width=960"); // Clärchens Ballhaus
      return;
    }
  }, [normalizedTitle, normalizedLocation, uniqueId, onImageFound]);

  return null;
};

export default SpecialCaseImage;
