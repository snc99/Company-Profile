// EditAboutPage.tsx
import EditFormAbout from "@/components/custom-ui/EditFormAbout";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditAboutPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params; 

  const aboutData = await prisma.about.findUnique({
    where: { id },
  });


  if (!aboutData) {
    notFound(); 
  }

  return (
    <div className="w-full">
      <div>
        <EditFormAbout
          initialDescription={aboutData.description}
          id={aboutData.id}
        />
      </div>
    </div>
  );
}
