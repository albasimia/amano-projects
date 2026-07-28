import { getCollection, type CollectionEntry } from "astro:content";

export type CompanyEntry = CollectionEntry<"companies">;

export async function getCompanies(): Promise<CompanyEntry[]> {
  const companies = await getCollection("companies");
  const slugs = new Set<string>();

  for (const company of companies) {
    if (slugs.has(company.data.slug)) {
      throw new Error(`Company slug「${company.data.slug}」が重複しています`);
    }
    slugs.add(company.data.slug);
  }

  return companies.sort((a, b) => a.data.order - b.data.order);
}
