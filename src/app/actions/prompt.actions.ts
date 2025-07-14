"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getPromptsByFolder(folderId?: string) {
  const user = await requireAuth();

  const prompts = await db.prompt.findMany({
    where: {
      userId: user.id,
      folderId: folderId || null,
    },
    include: {
      tags: true,
      likes: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  // Add computed fields for easier frontend consumption
  const promptsWithLikeData = prompts.map(prompt => ({
    ...prompt,
    likeCount: prompt._count.likes,
    isLikedByUser: prompt.likes.some((like: { userId: string }) => like.userId === user.id),
  }));

  return promptsWithLikeData;
}

export async function getAllPrompts() {
  const user = await requireAuth();

  const prompts = await db.prompt.findMany({
    where: {
      userId: user.id,
    },
    include: {
      tags: true,
      likes: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Add computed fields for easier frontend consumption
  const promptsWithLikeData = prompts.map(prompt => ({
    ...prompt,
    likeCount: prompt._count.likes,
    isLikedByUser: prompt.likes.some((like: { userId: string }) => like.userId === user.id),
  }));

  return promptsWithLikeData;
}

export async function renamePrompt(id: string, title: string) {
  const user = await requireAuth();

  const updatedPrompt = await db.prompt.update({
    where: { id, userId: user.id },
    data: { title },
  });

  revalidatePath(`/prompts`);
  return updatedPrompt;
}

export async function deletePrompt(id: string) {
  const user = await requireAuth();

  await db.prompt.delete({
    where: { id, userId: user.id },
  });

  revalidatePath(`/prompts`);
}

interface CreatePromptParams {
  title: string;
  description?: string;
  content?: string;
  folderId?: string;
  tags?: string[];
}

export async function createPrompt({
  title,
  description,
  content,
  folderId,
  tags,
}: CreatePromptParams) {
  console.log("SERVER ACTION: createPrompt called with:", { title, description, content, folderId, tags });
  
  try {
    const user = await requireAuth();
    console.log("SERVER ACTION: User authenticated:", user.id);

    const lastPrompt = await db.prompt.findFirst({
      where: { userId: user.id, folderId },
      orderBy: { order: "desc" },
    });

    const newOrder = lastPrompt ? lastPrompt.order! + 1 : 0;
    console.log("SERVER ACTION: Creating prompt with order:", newOrder);

    const newPrompt = await db.prompt.create({
      data: {
        title,
        description,
        content,
        userId: user.id,
        folderId,
        order: newOrder,
        tags: {
          connectOrCreate: tags?.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        versions: {
          create: {
            content: content || "",
            version: "1.0",
            changeMessage: "Initial version",
          },
        },
      },
    });

    console.log("SERVER ACTION: Prompt created successfully:", newPrompt);
    revalidatePath(`/prompts`);
    if (folderId) {
      revalidatePath(`/prompts/folders/${folderId}`);
    }

    return newPrompt;
  } catch (error) {
    console.error("SERVER ACTION: Error in createPrompt:", error);
    throw error;
  }
}

export async function getPromptById(id: string) {
  const user = await requireAuth();

  const prompt = await db.prompt.findUnique({
    where: { id, userId: user.id },
    include: {
      tags: true,
      versions: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return prompt;
}

interface UpdatePromptParams {
  title?: string;
  content?: string;
  tags?: string[];
  description?: string;
}

export async function updatePrompt(
  id: string,
  { title, content, tags, description }: UpdatePromptParams
) {
  const user = await requireAuth();

  const existingPrompt = await db.prompt.findUnique({
    where: { id, userId: user.id },
  });

  if (!existingPrompt) {
    throw new Error("Prompt not found");
  }

  const updatedPrompt = await db.prompt.update({
    where: { id, userId: user.id },
    data: {
      title,
      description,
      content,
      tags: tags
        ? {
            set: [],
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          }
        : undefined,
    },
  });

  if (content && content !== existingPrompt.content) {
    await db.promptVersion.create({
      data: {
        content: existingPrompt.content || "",
        promptId: id,
      },
    });
  }

  revalidatePath(`/prompts/${id}`);
  return updatedPrompt;
}

interface CreatePromptVersionParams {
  promptId: string;
  content: string;
  changeMessage?: string;
  versionType: 'minor' | 'major';
}

export async function createPromptVersion({
  promptId,
  content,
  changeMessage,
  versionType,
}: CreatePromptVersionParams) {
  const user = await requireAuth();

  const prompt = await db.prompt.findUnique({
    where: { id: promptId, userId: user.id },
    include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  if (!prompt) {
    throw new Error("Prompt not found");
  }

  const lastVersion = prompt.versions[0];
  let newVersionNumber: string;

  if (lastVersion && lastVersion.version) {
    const [major, minor] = lastVersion.version.split('.').map(Number);
    if (versionType === 'major') {
      newVersionNumber = `${major + 1}.0`;
    } else {
      newVersionNumber = `${major}.${minor + 1}`;
    }
  } else {
    newVersionNumber = '1.0';
  }

  const newVersion = await db.promptVersion.create({
    data: {
      promptId,
      content,
      changeMessage,
      version: newVersionNumber,
    },
  });

  // Also update the main prompt content
  await db.prompt.update({
    where: { id: promptId },
    data: { content },
  });

  revalidatePath(`/prompts/${promptId}`);
  return newVersion;
}

export async function getPromptVersions(promptId: string) {
  const user = await requireAuth();

  const versions = await db.promptVersion.findMany({
    where: {
      prompt: {
        id: promptId,
        userId: user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return versions;
}

export async function restoreVersion(versionId: string) {
  const user = await requireAuth();

  const version = await db.promptVersion.findUnique({
    where: { id: versionId },
    include: { prompt: true },
  });

  if (!version || version.prompt.userId !== user.id) {
    throw new Error("Version not found");
  }

  const updatedPrompt = await db.prompt.update({
    where: { id: version.promptId },
    data: { content: version.content },
  });

  revalidatePath(`/prompts/${version.promptId}`);
  return updatedPrompt;
}

export async function movePrompt(id: string, folderId: string | null, order: number) {
  const user = await requireAuth();

  await db.prompt.update({
    where: { id, userId: user.id },
    data: { folderId, order },
  });

  revalidatePath(`/prompts`);
  if (folderId) {
    revalidatePath(`/prompts/folders/${folderId}`);
  }
}

export async function searchPrompts(query: string) {
  const user = await requireAuth();

  const prompts = await db.prompt.findMany({
    where: {
      userId: user.id,
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          tags: {
            some: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
    include: {
      tags: true,
    },
  });

  return prompts;
}

// Like/Unlike functionality
export async function likePrompt(promptId: string) {
  const user = await requireAuth();

  try {
    // Check if the user has already liked this prompt
    const existingLike = await db.promptLike.findUnique({
      where: {
        promptId_userId: {
          promptId,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      throw new Error("You have already liked this prompt");
    }

    // Create the like
    const like = await db.promptLike.create({
      data: {
        promptId,
        userId: user.id,
      },
    });

    revalidatePath("/prompts");
    return like;
  } catch (error) {
    console.error("Error liking prompt:", error);
    throw error;
  }
}

export async function unlikePrompt(promptId: string) {
  const user = await requireAuth();

  try {
    // Find and delete the like
    const deletedLike = await db.promptLike.delete({
      where: {
        promptId_userId: {
          promptId,
          userId: user.id,
        },
      },
    });

    revalidatePath("/prompts");
    return deletedLike;
  } catch (error) {
    console.error("Error unliking prompt:", error);
    throw error;
  }
}

export async function togglePromptLike(promptId: string) {
  const user = await requireAuth();

  try {
    // Check if the user has already liked this prompt
    const existingLike = await db.promptLike.findUnique({
      where: {
        promptId_userId: {
          promptId,
          userId: user.id,
        },
      },
    });

    if (existingLike) {
      // Unlike the prompt
      await db.promptLike.delete({
        where: {
          promptId_userId: {
            promptId,
            userId: user.id,
          },
        },
      });
      revalidatePath("/prompts");
      return { liked: false };
    } else {
      // Like the prompt
      await db.promptLike.create({
        data: {
          promptId,
          userId: user.id,
        },
      });
      revalidatePath("/prompts");
      return { liked: true };
    }
  } catch (error) {
    console.error("Error toggling prompt like:", error);
    throw error;
  }
}

export async function getPromptLikes(promptId: string) {
  try {
    const likes = await db.promptLike.findMany({
      where: {
        promptId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return likes;
  } catch (error) {
    console.error("Error fetching prompt likes:", error);
    throw error;
  }
}