"use client";

import { restoreVersion } from "@/app/actions/prompt.actions";
import type { PromptVersion } from "@/generated/prisma";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";

interface VersionHistorySidebarProps {
  versions: PromptVersion[];
  onRestore: (versionId: string) => void;
}

export const VersionHistorySidebar = ({
  versions,
  onRestore,
}: VersionHistorySidebarProps) => {
  const handleRestore = async (versionId: string) => {
    await restoreVersion(versionId);
    onRestore(versionId);
  };

  return (
    <div className="p-4 border-l">
      <h2 className="text-lg font-semibold mb-4">Version History</h2>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-4">
          {versions.map((version) => (
            <div key={version.id} className="p-2 rounded-md hover:bg-muted">
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  v{version.version}
                </span>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(version.createdAt), "PPpp")}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {version.changeMessage || "No change message"}
              </p>
              <Button
                variant="link"
                className="p-0 h-auto mt-1"
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