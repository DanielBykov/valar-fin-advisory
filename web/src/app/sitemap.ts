import type { MetadataRoute } from "next";

const SITE_URL = "https://valar.co.nz";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/mortgage-advice`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/first-home-buyers`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/financial-planning`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/wealth-management-plan`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/investment-property-analysis`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/small-business-loans`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services/business-advisory`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/book`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/subscribe`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
