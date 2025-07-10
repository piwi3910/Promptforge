## **Features (MVP)**

### **Authentication & User Management**

Provides secure user registration with email verification, password reset functionality, and comprehensive profile management. Integrates with NextAuth.js for authentication services while maintaining user preferences and settings in the database.

#### **Tech Involved**

* NextAuth.js (Auth.js)  
* Next.js App Router with middleware  
* Prisma ORM with PostgreSQL  
* Server Actions for profile updates

#### **Main Requirements**

* User session management via database adapter  
* User metadata storage in PostgreSQL  
* Session management across Server Components  
* Profile data synchronization with OAuth providers  
* Role-based access control preparation

### **Prompt Organization**

Enables users to organize prompts using a flexible folder/tag hierarchy with drag-and-drop functionality, smart collections, and multi-dimensional categorization. Supports nested folder structures and rule-based automatic organization.

#### **Tech Involved**

* PostgreSQL with recursive CTEs for folder hierarchy  
* React DnD Kit for drag-and-drop  
* Server Actions for CRUD operations  
* Prisma with relation queries

#### **Main Requirements**

* Recursive folder structure with infinite nesting  
* Many-to-many prompt-tag relationships  
* Smart collection rule engine  
* Optimistic UI updates for drag-and-drop  
* Efficient tree traversal queries  
* Cascade delete for folder hierarchies

### **Search & Filtering**

Provides comprehensive full-text search across all prompts with advanced filtering capabilities by platform, date, tags, and author. Includes search within results and faceted search options.

#### **Tech Involved**

* PostgreSQL full-text search with GIN indexes  
* Prisma raw queries for search  
* React Query for search result caching  
* Server Actions for search API

#### **Main Requirements**

* GIN indexes on searchable columns  
* Search result ranking and relevance  
* Real-time search suggestions  
* Filter state management  
* Pagination for large result sets  
* Search history tracking

### **Prompt Creation & Editing**

Features a rich text editor with Markdown/XML support, syntax highlighting, live preview, and template variable system. Includes comprehensive version control with revision history and comparison tools.

#### **Tech Involved**

* CodeMirror 6 or Monaco Editor  
* Unified/Remark for Markdown processing  
* Server Actions for saving  
* PostgreSQL JSONB for version storage

#### **Main Requirements**

* Real-time syntax highlighting  
* Template variable parsing and validation  
* Debounced auto-save functionality  
* Version diff algorithm  
* Preview rendering pipeline  
* Concurrent editing conflict resolution

### **Templates & Snippets**

Provides pre-built prompt templates organized by category and a custom snippet library for reusable prompt components. Supports template inheritance and variable substitution.

#### **Tech Involved**

* PostgreSQL for template storage  
* React components for template gallery  
* Server Actions for template CRUD  
* Template engine for variable substitution

#### **Main Requirements**

* Template categorization system  
* Template versioning  
* Snippet insertion UI  
* Variable validation in templates  
* Template sharing permissions  
* Usage analytics for popular templates

## **System Diagram**

mermaid

```
graph TB
    subgraph "Client Layer"
        UI[Next.js App Router]
        MW[Middleware]
    end
    
    subgraph "Authentication"
        AUTH[NextAuth.js Service]
    end
    
    subgraph "Application Layer"
        SA[Server Actions]
        API[API Routes]
    end
    
    subgraph "Data Layer"
        PRISMA[Prisma ORM]
        PG[(PostgreSQL/Supabase)]
        CACHE[React Query Cache]
    end
    
    subgraph "External Services"
        VERCEL[Vercel CDN]
    end
    
    UI --> MW
    MW --> AUTH
    MW --> SA
    UI --> CACHE
    
    SA --> PRISMA
    API --> PRISMA
    PRISMA --> PG
    
    AUTH --> API
    API --> PG
    
    UI --> VERCEL
    CACHE --> SA
    
    PG -.-> |Full-text Search| PG
    PG -.-> |Recursive CTEs| PG
    PG -.-> |JSONB Storage| PG
