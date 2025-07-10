import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

const defaultTags = [
  // AI Platforms
  {
    name: 'ChatGPT',
    description: 'Prompts optimized for OpenAI\'s ChatGPT models'
  },
  {
    name: 'Claude',
    description: 'Prompts designed for Anthropic\'s Claude AI assistant'
  },
  {
    name: 'Midjourney',
    description: 'Image generation prompts for Midjourney AI'
  },
  {
    name: 'Stable Diffusion',
    description: 'Text-to-image prompts for Stable Diffusion models'
  },
  {
    name: 'Gemini',
    description: 'Prompts for Google\'s Gemini AI models'
  },

  // Prompt Engineering Techniques
  {
    name: 'Few-Shot',
    description: 'Prompts using few-shot learning with examples'
  },
  {
    name: 'Chain-of-Thought',
    description: 'Step-by-step reasoning prompts for complex problems'
  },
  {
    name: 'Role-Playing',
    description: 'Prompts that assign specific roles or personas to AI'
  },
  {
    name: 'System Prompt',
    description: 'Initial system-level instructions and configurations'
  },
  {
    name: 'Template',
    description: 'Reusable prompt structures with variables'
  },

  // Content Types
  {
    name: 'Code Generation',
    description: 'Programming and development-related prompts'
  },
  {
    name: 'Writing & Copy',
    description: 'Content creation, copywriting, and editing prompts'
  },
  {
    name: 'Data Analysis',
    description: 'Prompts for analyzing and interpreting data'
  },
  {
    name: 'Creative Content',
    description: 'Art, storytelling, and creative writing prompts'
  },
  {
    name: 'Research & Summarization',
    description: 'Information gathering and summarization tasks'
  },

  // Professional Categories
  {
    name: 'Marketing',
    description: 'Business marketing and promotional content prompts'
  },
  {
    name: 'Education',
    description: 'Teaching, learning, and educational content prompts'
  },
  {
    name: 'Technical Documentation',
    description: 'Technical writing and documentation prompts'
  },

  // Output Formats
  {
    name: 'Structured Data',
    description: 'Prompts requiring JSON, YAML, or structured responses'
  },
  {
    name: 'Long-Form',
    description: 'Detailed articles, reports, and comprehensive content'
  },
  {
    name: 'Quick Reference',
    description: 'Short, concise answers and quick information'
  },

  // Use Cases
  {
    name: 'Debugging',
    description: 'Problem-solving and troubleshooting prompts'
  },
  {
    name: 'Brainstorming',
    description: 'Idea generation and creative thinking exercises'
  },
  {
    name: 'Productivity',
    description: 'Task management and workflow optimization prompts'
  }
]

async function main() {
  console.log('🌱 Seeding default tags...')

  for (const tag of defaultTags) {
    try {
      await prisma.tag.upsert({
        where: { name: tag.name },
        update: {
          description: tag.description
        },
        create: {
          name: tag.name,
          description: tag.description
        }
      })
      console.log(`✅ Created/updated tag: ${tag.name}`)
    } catch (error) {
      console.error(`❌ Error creating tag ${tag.name}:`, error)
    }
  }

  console.log(`🎉 Successfully seeded ${defaultTags.length} default tags`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })