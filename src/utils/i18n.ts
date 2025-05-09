
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
  "predictions.results.successRate": "Sikerességi arány",
  
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
  
  // Prediction history
  "predictions.noHistoryYet": "Még nincs előrejelzés történet",
  "predictions.makeFirstPrediction": "Készítsd el az első előrejelzésed a bal oldali eszközzel",
  "predictions.totalPredictions": "Összes előrejelzés",
  "predictions.successfulPredictions": "Sikeres előrejelzések",
  "predictions.highConfidence": "Magas megbízhatóság",
  "predictions.patternPerformance": "Minta teljesítmény",
  "predictions.usedTimes": "Használat",
  "predictions.avgConfidence": "Átlagos megbízhatóság",
  "predictions.recentPredictions": "Legutóbbi előrejelzések",
  "predictions.hit": "Talált",
  "predictions.miss": "Téves",
  "predictions.successful": "sikeres",
  
  // Pattern types
  "predictions.patternTypes.both_teams_score": "Mindkét csapat szerez gólt",
  "predictions.patternTypes.draw": "Döntetlen",
  "predictions.patternTypes.ht_ft_reversal": "Félidő/végeredmény fordulás",
  "predictions.patternTypes.specific_score": "Pontos eredmény",
  
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
  // Prediction Components
  "predictions.title": "Match Predictions",
  "predictions.subtitle": "Statistics-based predictions for matches",
  "predictions.goalScoringTitle": "Goal Scoring Prediction",
  "predictions.bothTeamsScore": "Both teams score",
  "predictions.drawLikelihood": "Draw likelihood",
  "predictions.homeWin": "Home win",
  "predictions.awayWin": "Away win",
  "predictions.reversal": "Reversal",
  "predictions.highValue": "High value bet",
  "predictions.confidence": "Confidence",
  "predictions.odds": "Odds",
  "predictions.htft": "Half-time/Full-time",
  "predictions.previousMatches": "Previous matches",
  "predictions.buttonLabel": "Generate Prediction",
  "predictions.loading": "Loading prediction...",
  "predictions.homeTeam": "Home team",
  "predictions.awayTeam": "Away team",
  "predictions.selectTeam": "Select team",
  "predictions.noDataAvailable": "No data available",
  "predictions.predictionModelInfo": "Prediction model information",
  "predictions.howItWorks": "How the prediction system works",
  "predictions.predictionDescription": "The prediction model takes several factors into account:",
  
  // Model description
  "predictions.model.historical": "Previous results between the two teams",
  "predictions.model.recentForm": "Recent form (last 5 matches)",
  "predictions.model.homeAdvantage": "Home advantage (1.2x multiplier for home team)",
  "predictions.model.averageGoals": "Average goals scored and conceded by each team",
  "predictions.model.leaguePosition": "League table position and relative strength",
  
  // Results
  "predictions.results.title": "Prediction Results",
  "predictions.results.predictedResult": "Predicted result",
  "predictions.results.confidence": "Confidence",
  "predictions.results.bothTeamsToScore": "Both teams to score",
  "predictions.results.totalGoals": "Total goals",
  "predictions.results.over": "Over",
  "predictions.results.under": "Under",
  "predictions.results.successRate": "Success rate",
  
  // HTFT options
  "htft.home_home": "Home - Home",
  "htft.home_draw": "Home - Draw",
  "htft.home_away": "Home - Away",
  "htft.draw_home": "Draw - Home",
  "htft.draw_draw": "Draw - Draw",
  "htft.draw_away": "Draw - Away",
  "htft.away_home": "Away - Home",
  "htft.away_draw": "Away - Draw",
  "htft.away_away": "Away - Away",
  
  // Prediction history
  "predictions.noHistoryYet": "No prediction history yet",
  "predictions.makeFirstPrediction": "Make your first prediction using the tool on the left",
  "predictions.totalPredictions": "Total predictions",
  "predictions.successfulPredictions": "Successful predictions",
  "predictions.highConfidence": "High confidence",
  "predictions.patternPerformance": "Pattern performance",
  "predictions.usedTimes": "Used times",
  "predictions.avgConfidence": "Average confidence",
  "predictions.recentPredictions": "Recent predictions",
  "predictions.hit": "Hit",
  "predictions.miss": "Miss",
  "predictions.successful": "successful",
  
  // Pattern types
  "predictions.patternTypes.both_teams_score": "Both teams score",
  "predictions.patternTypes.draw": "Draw",
  "predictions.patternTypes.ht_ft_reversal": "HT/FT reversal",
  "predictions.patternTypes.specific_score": "Specific score",
  
  // UI components
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
