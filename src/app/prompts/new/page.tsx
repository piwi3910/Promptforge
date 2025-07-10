"use client";

import { useRouter } from "next/navigation";
import { PromptEditor } from "@/components/prompts/prompt-editor";

export default function NewPrompt() {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Create New Prompt</h1>
        <button
          onClick={() => router.push("/prompts")}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Prompts
        </button>
      </div>
      <PromptEditor />
    </div>
  );
}