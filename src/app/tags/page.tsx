import { Suspense } from "react";
import { db } from "@/lib/db";
import { TagsManagement } from "@/components/tags/tags-management";
import { Card, CardContent } from "@/components/ui/card";

async function getTagsData() {
  const tags = await db.tag.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          prompts: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return tags;
}

export default async function TagsPage() {
  const tags = await getTagsData();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <Suspense fallback={<div>Loading tags...</div>}>
            <TagsManagement initialTags={tags} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}