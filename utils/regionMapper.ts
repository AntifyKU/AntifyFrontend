/**
 * Mapping of Thai provinces to their respective regions based on the 6-region classification.
 */
export const THAI_REGIONS: Record<string, string> = {
  // Northern Thailand
  "Chiang Mai": "North",
  "Chiang Rai": "North",
  "Nan": "North",
  "Phayao": "North",
  "Phrae": "North",
  "Mae Hong Son": "North",
  "Lampang": "North",
  "Lamphun": "North",
  "Uttaradit": "North",

  // Northeast Thailand (Isan)
  "Amnat Charoen": "Northeast",
  "Buri Ram": "Northeast",
  "Chaiyaphum": "Northeast",
  "Kalasin": "Northeast",
  "Khon Kaen": "Northeast",
  "Loei": "Northeast",
  "Maha Sarakham": "Northeast",
  "Mukdahan": "Northeast",
  "Nakhon Phanom": "Northeast",
  "Nakhon Ratchasima": "Northeast",
  "Nong Bua Lamphu": "Northeast",
  "Nong Khai": "Northeast",
  "Roi Et": "Northeast",
  "Sakon Nakhon": "Northeast",
  "Si Sa Ket": "Northeast",
  "Surin": "Northeast",
  "Ubon Ratchathani": "Northeast",
  "Udon Thani": "Northeast",
  "Yasothon": "Northeast",
  "Bueng Kan": "Northeast",

  // Central Thailand
  "Ang Thong": "Central",
  "Phra Nakhon Si Ayutthaya": "Central",
  "Bangkok": "Central",
  "Chai Nat": "Central",
  "Kamphaeng Phet": "Central",
  "Lopburi": "Central",
  "Nakhon Nayok": "Central",
  "Nakhon Pathom": "Central",
  "Nakhon Sawan": "Central",
  "Nonthaburi": "Central",
  "Pathum Thani": "Central",
  "Phetchabun": "Central",
  "Phichit": "Central",
  "Phitsanulok": "Central",
  "Samut Prakan": "Central",
  "Samut Sakhon": "Central",
  "Samut Songkhram": "Central",
  "Saraburi": "Central",
  "Sing Buri": "Central",
  "Sukhothai": "Central",
  "Suphan Buri": "Central",
  "Uthai Thani": "Central",

  // Eastern Thailand
  "Chachoengsao": "East",
  "Chanthaburi": "East",
  "Chonburi": "East",
  "Prachinburi": "East",
  "Rayong": "East",
  "Sa Kaeo": "East",
  "Trat": "East",

  // Western Thailand
  "Kanchanaburi": "West",
  "Phetchaburi": "West",
  "Prachuap Khiri Khan": "West",
  "Ratchaburi": "West",
  "Tak": "West",

  // Southern Thailand
  "Chumphon": "South",
  "Krabi": "South",
  "Nakhon Si Thammarat": "South",
  "Narathiwat": "South",
  "Pattani": "South",
  "Phang Nga": "South",
  "Phatthalung": "South",
  "Phuket": "South",
  "Ranong": "South",
  "Satun": "South",
  "Songkhla": "South",
  "Surat Thani": "South",
  "Trang": "South",
  "Yala": "South",
};

/**
 * Groups a list of provinces by their respective regions.
 */
export function groupByRegion(provinces: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {
    "Central": [],
    "North": [],
    "Northeast": [],
    "East": [],
    "West": [],
    "South": [],
    "Other": [],
  };

  provinces.forEach((province) => {
    const region = THAI_REGIONS[province] || "Other";
    grouped[region].push(province);
  });

  // Remove empty regions
  Object.keys(grouped).forEach((key) => {
    if (grouped[key].length === 0) {
      delete grouped[key];
    }
  });

  return grouped;
}
