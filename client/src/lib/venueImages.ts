interface VenueImage {
  src: string;
  alt: string;
}

export function getVenueImages(venueName: string): VenueImage[] {
  // Normalize venue name to match folder structure
  const normalizedName = venueName.toLowerCase().trim();
  const images: VenueImage[] = [];
  
  // Map of normalized venue names to their folder names
  const venueNameToFolder: { [key: string]: string } = {
    // Exact matches from the database
    "Roman Gathering Hall": "roman wedding hall",
    "Unique Wdding Hall": "unique wedding hall",
    "Galaxy Event Hall": "galaxy wedding hall",
    "Al-Madina Marriage Hall": "al madina wedding hall",
    "Rehman Banquet Hall": "Rehman hall",
    "Sunehri Mahal Wedding Hall": "sunehri wedding hall",
    "Gulzar Banquet Hall": "gulzar banquet hall",
    "Zarqa Banquet Hall": "zarqa banquet hall",
    "Marbella Cave": "marella cave hall",
    "Sabrina Gulbahar Banquet Hall": "sabrina wedding hall",
    "Pearl Continental Hotel Peshawar": "pearl continental hotel peshawar",
    "monal marquee peshawar": "monal marque",
    "Royal Club Wedding Hall": "Royal Club Wedding hall",
    "Majestic Elegance Banquet Hall": "Majestic Elegance Banquet Hall",
    "Premier Luxury Banquet Hall": "Premier Luxury Banquet Hall",
    "Regal Elite Banquet Hall": "Elite Royale Wedding Palace",
    "Royal Excellency Marquee": "Elite Royale Wedding Palace",

    // Partial matches and variations
    "al noor banquet": "Al noor banquet hall",
    "basant banquet": "Basant Banquet Hall",
    "casa loma banquet": "Casa loma banquet hall",
    "crown regency banquet": "Crown Regency Banquet Hall",
    "dream marriage": "Dream marrige hall",
    "elite royale wedding palace": "Elite Royale Wedding Palace",
    "feroz banquet": "Feroz Banqut hall",
    "grand imperial marquee": "Grand Imperial Marquee",
    "gulshan banquet": "Gulshan Banquet Hall",
    "imperial grand banquet": "Imperial Grand Banquet Hall",
    "majestic elegance banquet": "Majestic Elegance Banquet Hall",
    "peshawar services club": "Peshawar Service club",
    "premier luxury banquet": "Premier Luxury Banquet Hall",
    "rehman banquet": "Rehman hall",
    "royal club wedding": "Royal Club Wedding hall",
    "royal excellency": "Elite Royale Wedding Palace",
    "regal elite": "Elite Royale Wedding Palace",
    "sajjad banquet": "Sajjad Banquet Hall",
    "al rehman": "al Rehman hall",
    "al-madina": "al madina wedding hall",
    "galaxy": "galaxy wedding hall",
    "gulzar": "gulzar banquet hall",
    "haleem banquet": "haleem banquet hall",
    "jasmine banquet": "jasmine banquet hall",
    "marbella": "marella cave hall",
    "monal": "monal marque",
    "pearl continental": "pearl continental hotel peshawar",
    "roman": "roman wedding hall",
    "sabrina": "sabrina wedding hall",
    "shalimar": "shalimar banquet",
    "sunehri": "sunehri wedding hall",
    "unique": "unique wedding hall",
    "zarqa": "zarqa banquet hall"
  };

  // Find the matching folder name
  let folderName = "";
  const normalizedSearchName = normalizedName.replace(/\s+/g, ' ').trim();
  
  // First try exact match
  if (venueNameToFolder[venueName]) {
    folderName = venueNameToFolder[venueName];
  } else {
    // Then try normalized match
    for (const [key, value] of Object.entries(venueNameToFolder)) {
      const normalizedKey = key.toLowerCase().replace(/\s+/g, ' ').trim();
      if (normalizedSearchName.includes(normalizedKey) || normalizedKey.includes(normalizedSearchName)) {
        folderName = value;
        break;
      }
    }
  }

  if (!folderName) {
    console.warn(`No matching folder found for venue: ${venueName} (normalized: ${normalizedSearchName})`);
    return [];
  }

  try {
    // Use URL-friendly path and encode the folder name
    const basePath = `/hall pictures data/${encodeURIComponent(folderName)}`;
    
    // Map of venue folders to their image file patterns
    const imagePatterns: { [key: string]: string[] } = {
      "Al noor banquet hall": ["a1.jpeg", "a2.jpeg", "a3.jpeg", "a4.jpeg", "a5.jpeg"],
      "Basant Banquet Hall": ["b1.jpeg", "b2.jpeg", "b3.jpeg", "b4.jpeg", "b5.jpeg"],
      "Casa loma banquet hall": ["cas1.jpeg", "cas2.jpeg", "cas3.jpeg", "cas4.jpeg", "cas5.jpeg"],
      "Crown Regency Banquet Hall": ["c1.jpeg", "c2.jpeg", "c3.jpeg", "c4.jpeg", "c5.jpeg"],
      "Dream marrige hall": ["dre1.jpeg", "dre2.jpeg", "dre3.jpeg", "dre4.jpeg", "dre5.jpeg"],
      "Elite Royale Wedding Palace": ["el1.jpeg", "el2.jpeg", "el3.jpeg", "el4.jpeg", "el5.jpeg"],
      "Feroz Banqut hall": ["f1.jpeg", "f2.jpeg", "f3.jpeg", "f4.jpeg", "f5.jpeg"],
      "Grand Imperial Marquee": ["gr1.jpeg", "gr2.jpeg", "gr3.jpeg", "gr4.jpeg", "gr5 main.jpeg"],
      "Gulshan Banquet Hall": ["g1.jpeg", "g2.jpeg", "g3.jpeg", "g4.jpeg", "g5.jpeg"],
      "Imperial Grand Banquet Hall": ["i1.jpeg", "i2.jpeg", "i3.jpeg", "i4.jpeg", "i5.jpeg"],
      "Majestic Elegance Banquet Hall": ["ma1.jpeg", "ma2.jpeg", "ma3.jpeg", "ma4.jpeg", "ma5.jpeg", "ma6.jpeg", "ma7.jpeg"],
      "Peshawar Service club": ["p1.jpeg", "p2.jpeg", "p3.jpeg", "p4.jpeg", "p5.jpeg"],
      "Premier Luxury Banquet Hall": ["pr1 main.jpeg", "pr2.jpeg", "p3.jpeg", "p4.jpeg", "p5.jpeg", "p6.jpeg"],
      "Rehman hall": ["h1.jpg", "h2.jpg", "h3.jpg", "h4.jpg", "h5.jpg"],
      "Royal Club Wedding hall": ["r1.jpeg", "r2.jpeg", "r3.jpeg", "r4.jpeg", "r5.jpeg", "r6.jpeg"],
      "Sajjad Banquet Hall": ["s1.jpeg", "s2.jpeg", "s3.jpeg", "s4.jpeg", "s5.jpeg"],
      "al Rehman hall": ["ar1.jpeg", "ar2.jpeg", "ar3.jpeg", "ar4.jpeg", "ar5.jpeg"],
      "al madina wedding hall": ["al 1.jpg", "al 2.jpg", "al 3.jpg", "al 4.jpg", "al 5 .jpg"],
      "galaxy wedding hall": ["gal 1.jpg", "gal 2.jpg", "gal 3.jpg", "gal 4.jpg", "gal 5.jpg", "gal 6.jpg", "gal 7.jpg", "galxy 8.jpg"],
      "gulzar banquet hall": ["gu1.jpg", "gul2.jpg", "gul3.jpg", "gul4.jpg", "gul5.jpg"],
      "haleem banquet hall": ["h1.jpg", "h2.jpg", "h3.jpg", "h4.jpg"],
      "jasmine banquet hall": ["j1.jpeg", "j2.jpeg", "j3.jpeg", "j4.jpeg", "j5.jpeg"],
      "marella cave hall": [
        "WhatsApp Image 2025-02-22 at 11.34.49_0a5060a5.jpg",
        "WhatsApp Image 2025-02-22 at 11.34.50_a5bb603b.jpg",
        "WhatsApp Image 2025-02-22 at 11.34.51_a518fed5.jpg",
        "WhatsApp Image 2025-02-22 at 11.34.51_aca36b6c.jpg",
        "WhatsApp Image 2025-02-22 at 11.34.52_a2819188.jpg",
        "WhatsApp Image 2025-02-22 at 11.34.52_de919bda.jpg",
        "WhatsApp Image 2025-02-22 at 11.34.53_942ee3e2.jpg",
        "WhatsApp Image 2025-02-22 at 11.34.53_fc4ff370.jpg"
      ],
      "monal marque": ["monal 1.jpg", "monal 2.jpg", "monal 3.jpg", "mnal 4.jpg", "monal 5.jpg", "monal 6.jpg", "monal 7 .jpg", "monal 8.jpg"],
      "pearl continental hotel peshawar": ["p1.jpeg", "p2.jpeg", "p3.jpeg", "p4.jpeg", "p5.jpeg"],
      "roman wedding hall": ["roman 1.jpg", "roma 2.jpg", "roman 3.jpg", "roman 4.jpg", "roman 5.jpg", "roman 6.jpg"],
      "sabrina wedding hall": [
        "WhatsApp Image 2025-02-22 at 11.41.53_4f279aaf.jpg",
        "WhatsApp Image 2025-02-22 at 11.41.54_2544fa57.jpg",
        "WhatsApp Image 2025-02-22 at 11.41.54_812a6e9e.jpg",
        "WhatsApp Image 2025-02-22 at 11.41.55_1ad4be5d.jpg",
        "WhatsApp Image 2025-02-22 at 11.41.55_e1ab0e24.jpg",
        "WhatsApp Image 2025-02-22 at 11.41.56_85bbebf3.jpg",
        "WhatsApp Image 2025-02-22 at 11.41.56_ed28b8b5.jpg",
        "WhatsApp Image 2025-02-22 at 11.41.57_2ac010a2.jpg",
        "WhatsApp Image 2025-02-22 at 11.41.57_9d9f3143.jpg"
      ],
      "shalimar banquet": ["sh1.jpeg", "sh2.jpeg", "sh3.jpeg", "sh4.jpeg", "sh5.jpeg", "sh6.jpeg", "sh7 main.jpeg"],
      "sunehri wedding hall": ["sun 1.jpg", "sun 2.jpg", "sun3.jpg", "sun4.jpg", "sun5.jpg"],
      "unique wedding hall": ["uni 1.jpg", "uni 2.jpg", "uni 3.jpg", "uni 4.jpg", "uni 5.jpg"],
      "zarqa banquet hall": ["zarq1.jpg", "zar3.jpg", "zrq4.jpg", "zarq5.jpg", "WhatsApp Image 2025-02-22 at 20.47.42_ae2e5166.jpg"]
    };

    // Get the image patterns for this venue
    const patterns = imagePatterns[folderName] || [];
    
    if (patterns.length === 0) {
      console.warn(`No image patterns found for venue: ${folderName}`);
      return [];
    }

    // Create image objects with the correct file names
    return patterns.map(filename => ({
      src: `${basePath}/${filename}`,
      alt: `${venueName} - ${filename.split('.')[0]}`
    }));

  } catch (error) {
    console.error(`Error creating image paths for venue ${venueName}:`, error);
    return [];
  }
}

export function getVenueCoverImage(venueName: string): string {
  const images = getVenueImages(venueName);
  return images.length > 0 ? images[0].src : '/default-venue.jpg';
}
