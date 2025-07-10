# **AI Prompt Manager Technical Specification**

## **1\. Executive Summary**

The AI Prompt Manager is a web-based application designed to help AI developers and prompt engineers organize, manage, and optimize their prompt library. The system provides a comprehensive solution for storing prompts with rich text editing, version control, advanced search capabilities, and intelligent organization through folders and tags.

### **Key Technical Decisions**

* **Frontend**: Next.js 14+ App Router for server-side rendering and optimal performance  
* **Backend**: Server Actions instead of traditional REST APIs for seamless client-server communication  
* **Database**: Supabase (PostgreSQL) for robust data storage with full-text search capabilities  
* **Authentication**: NextAuth.js (Auth.js) for flexible, open-source authentication  
* **Deployment**: Vercel for automatic scaling and global edge distribution

### **High-level Architecture**

mermaid

```
graph TB
    subgraph "Client Layer"
        UI[Next.js App Router<br/>React 18+]
        STATE[Zustand Store]
        CACHE[React Query Cache]
    end
    
    subgraph "Edge Layer"
        MW[Next.js Middleware]
        CDN[Vercel Edge Network]
    end
    
    subgraph "Application Layer"
        SA[Server Actions]
        API[API Routes]
    end
    
    subgraph "Data Layer"
        PRISMA[Prisma ORM]
        PG[(Supabase PostgreSQL)]
    end
    
    subgraph "External Services"
        AUTH[NextAuth.js]
        VERCEL[Vercel Platform]
    end
    
    UI --> STATE
    UI --> CACHE
    UI --> MW
    MW --> AUTH
    MW --> SA
    
    CACHE --> SA
    SA --> PRISMA
    PRISMA --> PG
    
    AUTH --> API
    API --> PRISMA
    
    UI --> CDN
    CDN --> VERCEL
```

## **2\. System Architecture**

### **2.1 Architecture Overview**

The system follows a modern, serverless architecture optimized for developer experience and performance:

**Frontend Architecture**

* Next.js App Router with React Server Components for optimal performance  
* Zustand for lightweight client-side state management  
* React Query for server state synchronization and caching  
* Progressive enhancement with JavaScript optional for core features

**Backend Architecture**

* Server Actions for type-safe server mutations  
* Edge middleware for authentication and request routing  
* API routes for authentication endpoints  
* Database-first design with Prisma ORM

**Data Flow**

1. User requests hit Vercel Edge Network  
2. Middleware validates authentication via NextAuth.js  
3. Server Components fetch data directly from database  
4. Client Components hydrate with cached data  
5. Mutations occur through Server Actions  
6. Real-time updates via React Query invalidation

### **2.2 Technology Stack**

**Frontend Technologies**

* **Framework**: Next.js 14+ (App Router)  
* **UI Library**: React 18+  
* **State Management**: Zustand 4+  
* **Data Fetching**: TanStack Query (React Query) v5  
* **Styling**: TailwindCSS 3.4+  
* **Animation**: Framer Motion 11+  
* **Rich Text Editor**: CodeMirror 6  
* **Drag & Drop**: @dnd-kit/sortable  
* **Icons**: Lucide React  
* **Forms**: React Hook Form \+ Zod  
* **Date Handling**: date-fns

**Backend Technologies**

* **Runtime**: Node.js 20+ (Vercel)  
* **API Layer**: Next.js Server Actions & API Routes  
* **ORM**: Prisma 5+  
* **Validation**: Zod  
* **Error Tracking**: Sentry  
* **Logging**: Pino

**Database & Storage**

* **Primary Database**: Supabase (PostgreSQL 15+)  
* **Caching**: React Query in-memory cache  
* **File Storage**: Vercel Blob (for future attachments)  
* **Search**: PostgreSQL Full-Text Search with GIN indexes

**Third-party Services**

* **Authentication**: NextAuth.js (Auth.js)  
* **Hosting**: Vercel  
* **Monitoring**: Vercel Analytics  
* **Error Tracking**: Sentry

## **3\. Feature Specifications**

### **3.1 Authentication & User Management**

**User Stories**

* As a user, I can sign up with email/password or social providers  
* As a user, I can reset my password via email  
* As a user, I can manage my profile and preferences  
* As a user, I can see my usage statistics and limits

**Technical Requirements**

* NextAuth.js integration with Next.js middleware  
* User data synchronization via Prisma adapter  
* Profile data stored in PostgreSQL for app-specific metadata  
* Session management through database sessions

**Implementation Approach**

typescript

```ts
// middleware.ts
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
})
```

**User Flow**

1. User clicks "Sign In" -> Redirected to NextAuth.js sign-in page  
2. User chooses provider and enters credentials  
3. On success -> User session created in database  
4. User redirected to dashboard  
5. Profile preferences saved via Server Action

**API Endpoints** (Server Actions)

* `updateUserProfile(data: UserProfileInput): Promise<UserProfile>`  
* `updateUserPreferences(preferences: UserPreferences): Promise<void>`  
* `getUserStats(): Promise<UserStatistics>`

**Data Models**

prisma

```
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  
  prompts       Prompt[]
  folders       Folder[]
  tags          Tag[]
  templates     Template[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

**Error Handling**

* NextAuth.js errors handled on the sign-in page  
* Network errors trigger retry with exponential backoff  
* Database errors logged to Sentry

**Performance Considerations**

* User profiles cached in React Query for 5 minutes  
* Session managed by NextAuth.js with database strategy  
* Minimal database queries through careful data modeling

### **3.2 Prompt Organization**

**User Stories**

* As a user, I can create nested folders to organize prompts  
* As a user, I can drag and drop prompts between folders  
* As a user, I can create smart collections with rules  
* As a user, I can tag prompts for multi-dimensional organization

**Technical Requirements**

* Recursive folder structure with PostgreSQL CTEs  
* Optimistic UI updates for drag-and-drop operations  
* Many-to-many relationships for prompt-tag associations  
* Smart collection rule engine with dynamic queries

**Implementation Approach**

typescript

```ts
// Recursive folder query
const getFolderTree = async (userId: string) => {
  return prisma.$queryRaw`
    WITH RECURSIVE folder_tree AS (
      SELECT * FROM folders 
      WHERE user_id = ${userId} AND parent_id IS NULL
      
      UNION ALL
      
      SELECT f.* FROM folders f
      INNER JOIN folder_tree ft ON f.parent_id = ft.id
    )
    SELECT * FROM folder_tree
    ORDER BY parent_id, position
  `;
};

// Drag and drop handler
async function moveItem(itemId: string, targetFolderId: string, position: number) {
  // Optimistic update
  updateCache(itemId, { folderId: targetFolderId, position });
  
  try {
    await movePromptServerAction(itemId, targetFolderId, position);
  } catch (error) {
    // Revert on failure
    revertCache(itemId);
    throw error;
  }
}
```

**User Flow**

1. User creates folder via modal dialog  
2. Folder appears in sidebar with animation  
3. User drags prompt to folder  
4. UI updates optimistically  
5. Server Action persists change  
6. On error, UI reverts with error toast

**Data Models**

prisma

```
model Folder {
  id        String   @id @default(cuid())
  name      String
  color     String?
  icon      String?
  userId    String
  parentId  String?
  position  Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id])
  parent    Folder?  @relation("FolderHierarchy", fields: [parentId], references: [id])
  children  Folder[] @relation("FolderHierarchy")
  prompts   Prompt[]
  
  @@index([userId, parentId])
}

model SmartCollection {
  id        String   @id @default(cuid())
  name      String
  userId    String
  rules     Json     // Rule engine configuration
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
}
```

**Error Handling**

* Cascade delete protection with confirmation dialog  
* Circular reference prevention in folder moves  
* Maximum nesting depth of 10 levels  
* Optimistic updates with automatic rollback

### **3.3 Search & Filtering**

**User Stories**

* As a user, I can search prompts by title, content, or tags  
* As a user, I can filter by platform, date range, and author  
* As a user, I can see search suggestions as I type  
* As a user, I can save frequent searches

**Technical Requirements**

* PostgreSQL full-text search with GIN indexes  
* Real-time search with debouncing  
* Faceted search with count aggregations  
* Search result ranking by relevance

**Implementation Approach**

typescript

```ts
// Database indexes
CREATE INDEX prompt_search_idx ON prompts 
USING GIN (to_tsvector('english', title || ' ' || content));

// Server Action for search
export async function searchPrompts(query: SearchQuery) {
  const { text, filters, page = 1, limit = 20 } = query;
  
  const results = await prisma.$queryRaw`
    SELECT 
      p.*,
      ts_rank(to_tsvector('english', p.title || ' ' || p.content), 
              plainto_tsquery('english', ${text})) AS rank
    FROM prompts p
    WHERE 
      to_tsvector('english', p.title || ' ' || p.content) @@ 
      plainto_tsquery('english', ${text})
      ${filters.platform ? Prisma.sql`AND p.platform = ${filters.platform}` : Prisma.empty}
    ORDER BY rank DESC
    LIMIT ${limit} OFFSET ${(page - 1) * limit}
  `;
  
  return results;
}
```

**User Flow**

1. User types in search box  
2. Debounced search triggers after 300ms  
3. Loading skeleton appears  
4. Results render with highlighting  
5. Filters update result count in real-time  
6. Click result to view/edit prompt

**Data Models**

prisma

```
model SearchHistory {
  id        String   @id @default(cuid())
  userId    String
  query     String
  filters   Json?
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id])
  
  @@index([userId, createdAt])
}
```

**Performance Considerations**

* GIN indexes for full-text search performance  
* Search results cached for 60 seconds  
* Pagination with cursor-based navigation  
* Query suggestion from popular searches

### **3.4 Prompt Creation & Editing**

**User Stories**

* As a user, I can create prompts with rich text formatting  
* As a user, I can use variables in my prompts  
* As a user, I can see version history and restore old versions  
* As a user, I can preview prompts before saving

**Technical Requirements**

* CodeMirror 6 for syntax highlighting and editing  
* Real-time Markdown/XML parsing and preview  
* Automatic version creation on save  
* Diff algorithm for version comparison

**Implementation Approach**

typescript

```ts
// Rich text editor setup
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";

const editorConfig = {
  extensions: [
    markdown(),
    syntaxHighlighting(),
    variableDetection(),
    autoSave({ delay: 2000 })
  ]
};

// Version control
export async function savePromptVersion(
  promptId: string, 
  content: string,
  userId: string
) {
  const lastVersion = await getLastVersion(promptId);
  
  if (hasSignificantChanges(lastVersion?.content, content)) {
    await prisma.promptVersion.create({
      data: {
        promptId,
        content,
        versionNumber: (lastVersion?.versionNumber || 0) + 1,
        createdBy: userId,
        changeSummary: generateChangeSummary(lastVersion?.content, content)
      }
    });
  }
}
```

**User Flow**

1. User clicks "New Prompt"  
2. Editor opens with template  
3. User types with syntax highlighting  
4. Preview updates in real-time  
5. Auto-save triggers every 2 seconds  
6. Version created on significant changes

**Data Models**

prisma

```
model Prompt {
  id          String   @id @default(cuid())
  title       String
  content     String   @db.Text
  description String?
  platform    Platform @default(GENERAL)
  userId      String
  folderId    String?
  isTemplate  Boolean  @default(false)
  isPublic    Boolean  @default(false)
  variables   Json?    // Template variables
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id])
  folder      Folder?  @relation(fields: [folderId], references: [id])
  versions    PromptVersion[]
