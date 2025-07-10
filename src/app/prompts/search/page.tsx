"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchPrompts } from "@/app/actions/prompt.actions";
import type { Prompt, Tag } from "@/generated/prisma";
import { PromptList } from "@/components/prompts/prompt-list";

type PromptWithTags = Prompt & { tags: Tag[] };

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [prompts, setPrompts] = useState<PromptWithTags[]>([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const fetchedPrompts = await searchPrompts(query);
      setPrompts(fetchedPrompts as PromptWithTags[]);
    };
    fetchPrompts();
  }, [query]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">
        {'Search Results for "'}
        {query}
        {'"'}
      </h1>
      <PromptList prompts={prompts} />
    </div>
  );
}