export const COUNTRIES = [
  { code: 'PK', flag: '🇵🇰', name: 'Pakistan',      currency: 'PKR', symbol: 'PKR ', rates: { starter: 2500,  pro: 7000  } },
  { code: 'IN', flag: '🇮🇳', name: 'India',         currency: 'INR', symbol: '₹',   rates: { starter: 750,   pro: 2100  } },
  { code: 'US', flag: '🇺🇸', name: 'United States', currency: 'USD', symbol: '$',   rates: { starter: 9,     pro: 25    } },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom',currency: 'GBP', symbol: '£',   rates: { starter: 7,     pro: 20    } },
  { code: 'CA', flag: '🇨🇦', name: 'Canada',        currency: 'CAD', symbol: 'CA$', rates: { starter: 12,    pro: 33    } },
  { code: 'AE', flag: '🇦🇪', name: 'UAE',           currency: 'AED', symbol: 'AED ',rates: { starter: 33,    pro: 92    } },
  { code: 'SA', flag: '🇸🇦', name: 'Saudi Arabia',  currency: 'SAR', symbol: 'SAR ',rates: { starter: 34,    pro: 94    } },
  { code: 'BD', flag: '🇧🇩', name: 'Bangladesh',    currency: 'BDT', symbol: '৳',   rates: { starter: 1000,  pro: 2800  } },
  { code: 'AU', flag: '🇦🇺', name: 'Australia',     currency: 'AUD', symbol: 'A$',  rates: { starter: 14,    pro: 38    } },
  { code: 'DE', flag: '🇩🇪', name: 'Germany',       currency: 'EUR', symbol: '€',   rates: { starter: 9,     pro: 23    } },
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria',       currency: 'NGN', symbol: '₦',   rates: { starter: 14000, pro: 38000 } },
  { code: 'BR', flag: '🇧🇷', name: 'Brazil',        currency: 'BRL', symbol: 'R$',  rates: { starter: 45,    pro: 125   } },
];

export type Country = typeof COUNTRIES[0];
