import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/data/categories";
import { CategoryPage } from "@/components/CategoryPage";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getCategory(id)) notFound();
  return <CategoryPage id={id} />;
}
