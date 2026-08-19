import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentDocs } from "@/components/docs/ComponentDocs";
import {
  getComponentBySlug,
  stellarComponents,
} from "@/data/components";

interface ComponentDocsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return stellarComponents.map((component) => ({
    slug: component.slug,
  }));
}

export async function generateMetadata({
  params,
}: ComponentDocsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    return {
      title: "Stellar-Forge Docs",
    };
  }

  return {
    title: `${component.name} — Stellar-Forge Docs`,
    description: component.shortDescription,
  };
}

export default async function ComponentDocsPage({
  params,
}: ComponentDocsPageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  return (
    <main className="min-w-0 flex-1">
      <ComponentDocs component={component} />
    </main>
  );
}