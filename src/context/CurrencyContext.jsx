import React, { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext(null);

export const COUNTRIES = [
  {
    countryCode: "US",
    countryName: "United States",
    flag: "🇺🇸",
    currencyCode: "USD",
    symbol: "$",
    label: "US · USD ($)",
    rate: 1,
    budgetRanges: ["< $2,000", "$2,000 - $5,000", "$5,000 - $10,000", "$10,000+"],
  },
  {
    countryCode: "IN",
    countryName: "India",
    flag: "🇮🇳",
    currencyCode: "INR",
    symbol: "₹",
    label: "IN · INR (₹)",
    rate: 86.5,
    budgetRanges: ["< ₹1,50,000", "₹1,50,000 - ₹4,00,000", "₹4,00,000 - ₹8,50,000", "₹8,50,000+"],
  },
  {
    countryCode: "GB",
    countryName: "United Kingdom",
    flag: "🇬🇧",
    currencyCode: "GBP",
    symbol: "£",
    label: "UK · GBP (£)",
    rate: 0.79,
    budgetRanges: ["< £1,600", "£1,600 - £4,000", "£4,000 - £8,000", "£8,000+"],
  },
  {
    countryCode: "EU",
    countryName: "European Union",
    flag: "🇪🇺",
    currencyCode: "EUR",
    symbol: "€",
    label: "EU · EUR (€)",
    rate: 0.92,
    budgetRanges: ["< €1,800", "€1,800 - €4,500", "€4,500 - €9,200", "€9,200+"],
  },
  {
    countryCode: "AE",
    countryName: "United Arab Emirates",
    flag: "🇦🇪",
    currencyCode: "AED",
    symbol: "AED",
    label: "AE · AED (د.إ)",
    rate: 3.67,
    budgetRanges: ["< AED 7,500", "AED 7,500 - AED 18,500", "AED 18,500 - AED 37,000", "AED 37,000+"],
  },
  {
    countryCode: "CA",
    countryName: "Canada",
    flag: "🇨🇦",
    currencyCode: "CAD",
    symbol: "C$",
    label: "CA · CAD (C$)",
    rate: 1.37,
    budgetRanges: ["< C$2,700", "C$2,700 - C$6,800", "C$6,800 - C$13,700", "C$13,700+"],
  },
  {
    countryCode: "AU",
    countryName: "Australia",
    flag: "🇦🇺",
    currencyCode: "AUD",
    symbol: "A$",
    label: "AU · AUD (A$)",
    rate: 1.54,
    budgetRanges: ["< A$3,000", "A$3,000 - A$7,700", "A$7,700 - A$15,400", "A$15,400+"],
  },
  {
    countryCode: "SG",
    countryName: "Singapore",
    flag: "🇸🇬",
    currencyCode: "SGD",
    symbol: "S$",
    label: "SG · SGD (S$)",
    rate: 1.34,
    budgetRanges: ["< S$2,600", "S$2,600 - S$6,700", "S$6,700 - S$13,400", "S$13,400+"],
  },
];

const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.currencyCode === "INR") || COUNTRIES[0];

// Bumped when the default changed from USD to INR: the old key held USD for every earlier visitor
// (the default itself used to be saved), so it must not override the new default.
const STORAGE_KEY = "pdc_selected_country_v2";
const OLD_STORAGE_KEY = "pdc_selected_country";

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState(() => {
    try {
      localStorage.removeItem(OLD_STORAGE_KEY);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = COUNTRIES.find((c) => c.countryCode === parsed.countryCode || c.currencyCode === parsed.currencyCode);
        if (match) return match;
      }
      return DEFAULT_COUNTRY;
    } catch {
      return DEFAULT_COUNTRY;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCountry));
    } catch {
      /* storage unavailable (private mode): the choice just won't persist */
    }
  }, [selectedCountry]);

  const selectCountryByCode = (countryCode) => {
    const found = COUNTRIES.find((c) => c.countryCode === countryCode || c.currencyCode === countryCode);
    if (found) {
      setSelectedCountry(found);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCountry,
        currentCurrency: {
          code: selectedCountry.currencyCode,
          symbol: selectedCountry.symbol,
          flag: selectedCountry.flag,
          rate: selectedCountry.rate,
        },
        countries: COUNTRIES,
        setSelectedCountry,
        selectCountryByCode,
        getBudgetRanges: () => selectedCountry.budgetRanges,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
