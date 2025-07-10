"use client";

import { useEffect, useState } from "react";
import { getPromptVersions, restoreVersion } from "@/app/actions/prompt.actions";
import type { PromptVersion } from "@/generated/prisma";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";

interface VersionHistorySidebarProps {
  promptId: string;
}

export const VersionHistorySidebar = ({
  promptId,
}: VersionHistorySidebarProps) => {
  const [versions, setVersions] = useState<PromptVersion[]>([]);

  useEffect(() => {
    const fetchVersions = async () => {
      const fetchedVersions = await getPromptVersions(promptId);
      setVersions(fetchedVersions);
    };
    fetchVersions();
  }, [promptId]);

  const handleRestore = async (versionId: string) => {
    await restoreVersion(versionId);
  };

  return (
    <div className="p-4 border-l">
      <h2 className="text-lg font-semibold mb-4">Version History</h2>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-4">
          {versions.map((version) => (
            <div key={version.id} className="p-2 rounded-md hover:bg-muted">
              <p className="text-sm text-muted-foreground">
                {format(new Date(version.createdAt), "PPpp")}
              </p>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => handleRestore(version.id)}
              >
                Restore
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};