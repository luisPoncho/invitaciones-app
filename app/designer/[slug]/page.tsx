import DesignerPageClient from "@/components/designer/DesignerPageClient";

interface EditDesignerPageProps {
  params: { slug: string };
}

export default function EditDesignerPage({ params }: EditDesignerPageProps) {
  return <DesignerPageClient editSlug={params.slug} />;
}
