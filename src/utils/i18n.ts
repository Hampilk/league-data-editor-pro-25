type TranslationKey = string;

type TranslationMap = {
  [key: TranslationKey]: string;
};

const hu: TranslationMap = {
  // Prediction Components
  "predictions.title": "Mérkőzés Előrejelzések",
  "predictions.subtitle": "Statisztikán alapuló előrejelzések a mérkőzésekhez",
  "predictions.goalScoringTitle": "Gólszerzési Előrejelzés",
  "predictions.bothTeamsScore": "Mindkét csapat szerez gólt",
  "predictions.drawLikelihood": "Döntetlen esélye",
  "predictions.homeWin": "Hazai győzelem",
  "predictions.awayWin": "Vendég győzelem",
  "predictions.reversal": "Fordítás",
  "predictions.highValue": "Magas értékű fogadás",
  "predictions.confidence": "Megbízhatóság",
  "predictions.odds": "Szorzó",
  "predictions.htft": "Félidő/végeredmény",
  "predictions.previousMatches": "Korábbi mérkőzések",
  "predictions.buttonLabel": "Előrejelzés Generálása",
  "predictions.loading": "Előrejelzés betöltése...",
  "predictions.homeTeam": "Hazai csapat",
  "predictions.awayTeam": "Vendég csapat",
  "predictions.selectTeam": "Válassz csapatot",
  "predictions.noDataAvailable": "Nincs elérhető adat",
  "predictions.predictionModelInfo": "Előrejelzési modell információk",
  "predictions.howItWorks": "Hogyan működik az előrejelzési rendszer",
  "predictions.predictionDescription": "Az előrejelzési modell több tényezőt vesz figyelembe:",
  
  // Model description
  "predictions.model.historical": "Korábbi eredmények a két csapat között",
  "predictions.model.recentForm": "Legutóbbi forma (utolsó 5 mérkőzés)",
  "predictions.model.homeAdvantage": "Hazai pálya előny (1.2x szorzó a hazai csapatnak)",
  "predictions.model.averageGoals": "Átlagos szerzett és kapott gólok csapatonként",
  "predictions.model.leaguePosition": "Tabellán elfoglalt helyezés és relatív erősség",
  
  // Results
  "predictions.results.title": "Előrejelzési Eredmények",
  "predictions.results.predictedResult": "Várható eredmény",
  "predictions.results.confidence": "Megbízhatóság",
  "predictions.results.bothTeamsToScore": "Mindkét csapat szerez gólt",
  "predictions.results.totalGoals": "Összes gól",
  "predictions.results.over": "Több mint",
  "predictions.results.under": "Kevesebb mint",
  
  // HTFT options
  "htft.home_home": "Hazai - Hazai",
  "htft.home_draw": "Hazai - Döntetlen",
  "htft.home_away": "Hazai - Vendég",
  "htft.draw_home": "Döntetlen - Hazai",
  "htft.draw_draw": "Döntetlen - Döntetlen",
  "htft.draw_away": "Döntetlen - Vendég",
  "htft.away_home": "Vendég - Hazai",
  "htft.away_draw": "Vendég - Döntetlen",
  "htft.away_away": "Vendég - Vendég",
  
  // UI components
  "ui.loading": "Betöltés...",
  "ui.error": "Hiba történt",
  "ui.retry": "Újra",
  "ui.save": "Mentés",
  "ui.cancel": "Mégse",
  "ui.generate": "Generálás",
  "ui.back": "Vissza",
  "ui.next": "Tovább",
  "ui.viewAll": "Összes megtekintése",
  "ui.viewDetails": "Részletek",
  "ui.tab.overview": "Áttekintés",
  "ui.tab.details": "Részletek",
  "ui.tab.history": "Előzmények",
  "ui.tab.statistics": "Statisztikák",
};

const en: TranslationMap = {
  "ui.loading": "Loading...",
  "ui.error": "An error occurred",
  "ui.retry": "Retry",
  "ui.save": "Save",
  "ui.cancel": "Cancel",
  "ui.generate": "Generate",
  "ui.back": "Back",
  "ui.next": "Next",
  "ui.viewAll": "View All",
  "ui.viewDetails": "View Details",
  "ui.tab.overview": "Overview",
  "ui.tab.details": "Details",
  "ui.tab.history": "History",
  "ui.tab.statistics": "Statistics",
};

const translations = {
  hu,
  en,
};

type Language = 'en' | 'hu';

// Default language
let currentLanguage: Language = 'hu';

export const useTranslation = () => {
  const t = (key: TranslationKey): string => {
    const translationsForLang = translations[currentLanguage] || translations.en;
    return translationsForLang[key] || key;
  };

  const setLanguage = (lang: Language) => {
    currentLanguage = lang;
  };

  return {
    t,
    setLanguage,
    currentLanguage,
  };
};

export default useTranslation;
