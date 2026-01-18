import { Helmet } from "react-helmet-async";

interface OfficeLocation {
  name: string;
  streetAddress: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
  countryCode: string;
  telephone: string;
  email: string;
  latitude: number;
  longitude: number;
  openingHours: string[];
}

const officeLocations: OfficeLocation[] = [
  {
    name: "ALSAMOS Headquarters",
    streetAddress: "Innovation Center, Mirzo Ulugbek District",
    city: "Tashkent",
    region: "Tashkent",
    postalCode: "100000",
    country: "Uzbekistan",
    countryCode: "UZ",
    telephone: "+998933007709",
    email: "alsamos.company@gmail.com",
    latitude: 41.2995,
    longitude: 69.2401,
    openingHours: ["Mo-Fr 09:00-18:00"],
  },
  {
    name: "ALSAMOS Silicon Valley",
    streetAddress: "123 Innovation Drive",
    city: "San Francisco",
    region: "California",
    postalCode: "94105",
    country: "United States",
    countryCode: "US",
    telephone: "+14155551234",
    email: "sf@alsamos.com",
    latitude: 37.7749,
    longitude: -122.4194,
    openingHours: ["Mo-Fr 09:00-18:00"],
  },
  {
    name: "ALSAMOS London",
    streetAddress: "1 Canada Square, Canary Wharf",
    city: "London",
    region: "England",
    postalCode: "E14 5AB",
    country: "United Kingdom",
    countryCode: "GB",
    telephone: "+442071234567",
    email: "london@alsamos.com",
    latitude: 51.5049,
    longitude: -0.0195,
    openingHours: ["Mo-Fr 09:00-18:00"],
  },
  {
    name: "ALSAMOS Dubai",
    streetAddress: "Dubai Internet City",
    city: "Dubai",
    region: "Dubai",
    postalCode: "00000",
    country: "United Arab Emirates",
    countryCode: "AE",
    telephone: "+97141234567",
    email: "dubai@alsamos.com",
    latitude: 25.0657,
    longitude: 55.1713,
    openingHours: ["Su-Th 09:00-18:00"],
  },
  {
    name: "ALSAMOS Singapore",
    streetAddress: "1 Raffles Place",
    city: "Singapore",
    region: "Central Region",
    postalCode: "048616",
    country: "Singapore",
    countryCode: "SG",
    telephone: "+6561234567",
    email: "singapore@alsamos.com",
    latitude: 1.2847,
    longitude: 103.8514,
    openingHours: ["Mo-Fr 09:00-18:00"],
  },
  {
    name: "ALSAMOS Tokyo",
    streetAddress: "Roppongi Hills Mori Tower",
    city: "Tokyo",
    region: "Tokyo",
    postalCode: "106-6108",
    country: "Japan",
    countryCode: "JP",
    telephone: "+81312345678",
    email: "tokyo@alsamos.com",
    latitude: 35.6600,
    longitude: 139.7294,
    openingHours: ["Mo-Fr 09:00-18:00"],
  },
];

/**
 * LocalBusiness Schema component for enhanced local SEO
 * Includes all ALSAMOS global office locations
 */
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Corporation",
    "@id": "https://alsamos.com/#organization",
    name: "ALSAMOS Corporation",
    alternateName: ["ALSAMOS", "Alsamos Corp", "ALSAMOS Global"],
    url: "https://alsamos.com",
    logo: {
      "@type": "ImageObject",
      url: "https://alsamos.com/logo.png",
      width: 512,
      height: 512,
    },
    image: "https://alsamos.com/og-image.png",
    description: "ALSAMOS is a multinational innovation corporation operating across 100+ industries worldwide, building the future of technology, healthcare, education, and beyond.",
    foundingDate: "2020",
    founder: {
      "@type": "Person",
      name: "Samandar Alimov",
      jobTitle: "Founder & CEO",
      url: "https://alsamos.com/about",
    },
    slogan: "Make It Real",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 1000,
      maxValue: 5000,
    },
    areaServed: "Worldwide",
    knowsAbout: [
      "Artificial Intelligence",
      "Technology",
      "Healthcare Innovation",
      "Education Technology",
      "Automotive",
      "Aerospace",
      "Robotics",
      "Finance Technology",
      "Consumer Electronics",
    ],
    knowsLanguage: ["en", "uz", "ru"],
    sameAs: [
      "https://www.linkedin.com/in/alsamos/",
      "https://instagram.com/alsamosofficial",
      "https://youtube.com/alsamos",
      "https://x.com/AlsamosOfficial",
      "https://facebook.com/AlsamosOfficial",
      "https://t.me/alsamos",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+998933007709",
        email: "support@alsamos.com",
        availableLanguage: ["English", "Uzbek", "Russian"],
        areaServed: "Worldwide",
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "alsamos.company@gmail.com",
        availableLanguage: ["English", "Uzbek", "Russian"],
      },
      {
        "@type": "ContactPoint",
        contactType: "investor relations",
        email: "investors@alsamos.com",
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "human resources",
        email: "careers@alsamos.com",
        availableLanguage: ["English", "Uzbek", "Russian"],
      },
    ],
    address: officeLocations.map(office => ({
      "@type": "PostalAddress",
      name: office.name,
      streetAddress: office.streetAddress,
      addressLocality: office.city,
      addressRegion: office.region,
      postalCode: office.postalCode,
      addressCountry: office.countryCode,
    })),
    location: officeLocations.map(office => ({
      "@type": "Place",
      name: office.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: office.streetAddress,
        addressLocality: office.city,
        addressRegion: office.region,
        postalCode: office.postalCode,
        addressCountry: office.countryCode,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: office.latitude,
        longitude: office.longitude,
      },
      telephone: office.telephone,
      email: office.email,
      openingHoursSpecification: office.openingHours.map(hours => {
        const [days, time] = hours.split(' ');
        const [opens, closes] = time.split('-');
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: days,
          opens: opens,
          closes: closes,
        };
      }),
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default LocalBusinessSchema;
