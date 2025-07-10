import { Suspense } from "react";
import { db } from "@/lib/db";
import { TagsManagement } from "@/components/tags/tags-management";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">
            Manage your tags to organize and categorize your prompts
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tag Management</CardTitle>
          <CardDescription>
            Create, edit, and organize tags for your prompts. Tags help you categorize and find your prompts quickly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading tags...</div>}>
            <TagsManagement initialTags={tags} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}