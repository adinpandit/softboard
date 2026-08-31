# Softboard — Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** MVP Planning  
**Product Type:** Collaborative visual workspace / digital softboard  
**Primary Platform:** Web  
**Target Stack:** Next.js, TypeScript, PostgreSQL/Supabase, React Flow, Tailwind CSS

---

## 1. Product Overview

Softboard is an online visual workspace where users can create free-form softboards and organize information spatially.

Users can place **sticky notes, pages, images/photos, and links** on a board, freely move and resize them, and connect related items using **threads**.

The long-term vision is to turn Softboard into a collaborative knowledge workspace that combines the flexibility of a whiteboard with the organization of a knowledge-management tool.

Future versions may include real-time collaboration, AI-powered board organization, semantic search, automatic connections, summarization, and an AI assistant that can answer questions using the contents of a board.

---

## 2. Problem Statement

Traditional productivity tools separate information into rigid structures:

- Notes live in note-taking applications.
- Images live in galleries or file storage.
- Documents live in document management systems.
- Links are saved separately.
- Relationships between pieces of information are difficult to visualize.

Users often need a space where information can be arranged spatially and relationships can be represented visually.

Softboard solves this by allowing users to:

1. Create an unrestricted visual workspace.
2. Place different types of content on the same board.
3. Organize content spatially.
4. Explicitly connect related pieces of information.
5. Eventually collaborate and interact with the board using AI.

---

## 3. Product Vision

> **Softboard is a visual knowledge workspace where information is not only stored, but spatially organized and connected.**

The product should eventually allow a user to go from:

**Collect → Organize → Connect → Understand → Collaborate**

---

## 4. Goals

### 4.1 MVP Goals

The MVP should allow an authenticated user to:

- Create an account.
- Log in and log out.
- Create multiple softboards.
- Open a softboard canvas.
- Add sticky notes.
- Add pages.
- Upload images/photos.
- Add links.
- Move and resize board items.
- Delete board items.
- Zoom and pan around the canvas.
- Create connections/threads between items.
- Persist board state.
- Rename and delete boards.

### 4.2 Post-MVP Goals

The product should eventually support:

- Board sharing.
- Viewer/editor permissions.
- Real-time collaboration.
- Multiple users editing the same board.
- Presence and cursor indicators.
- Board search.
- Version history.
- Undo/redo.
- AI-powered organization.
- AI-generated connections.
- Board summarization.
- Ask-your-board RAG assistant.
- Automatic grouping of related content.

---

## 5. Non-Goals for MVP

The following should **not** be implemented in the initial MVP:

- Real-time multiplayer editing.
- AI assistant.
- AI-generated threads.
- Complex document editing.
- Advanced drawing tools.
- Video editing.
- Mobile applications.
- Advanced billing/subscriptions.
- Enterprise administration.
- Complex version control.
- Full offline support.

These can be added after the core board experience is stable.

---

# 6. Target Users

## 6.1 Students

Use cases:

- Study notes.
- Research.
- Project planning.
- Connecting concepts.
- Collecting reference images and links.

Example:

```text
Machine Learning
       |
       +------> Neural Networks
       |
       +------> PyTorch
       |
       +------> Research Paper
       |
       +------> Project Idea
```

## 6.2 Developers

Use cases:

- Software architecture.
- Project planning.
- Research.
- API documentation.
- System diagrams.
- Collecting technical resources.

## 6.3 Researchers

Use cases:

- Research papers.
- Images.
- Notes.
- References.
- Concept relationships.

## 6.4 Teams

Post-MVP use cases:

- Brainstorming.
- Product planning.
- Architecture discussions.
- Research collaboration.
- Project planning.

---

# 7. Core User Stories

### Authentication

- As a user, I want to create an account so that my boards are private to me.
- As a user, I want to log in so that I can access my boards.
- As a user, I want to log out securely.

### Boards

- As a user, I want to create a board so that I can organize a topic/project.
- As a user, I want to rename a board.
- As a user, I want to delete a board.
- As a user, I want to see all my boards from a dashboard.

### Canvas

- As a user, I want to pan around the board.
- As a user, I want to zoom in and out.
- As a user, I want to freely position items.
- As a user, I want to resize items.
- As a user, I want to select and delete items.

### Content

- As a user, I want to create sticky notes.
- As a user, I want to create pages.
- As a user, I want to upload images.
- As a user, I want to save links.
- As a user, I want all content to persist after refreshing the page.

### Threads

- As a user, I want to connect two items.
- As a user, I want to see relationships visually.
- As a user, I want to label connections.
- As a user, I want to remove connections.

---

# 8. MVP Feature Requirements

## 8.1 Authentication

### Requirements

- Email/password registration.
- Email/password login.
- Logout.
- Session persistence.
- Protected application routes.

### Acceptance Criteria

- Unauthenticated users cannot access private boards.
- Authenticated users can access their dashboard.
- User sessions persist across page refreshes.
- Logout invalidates the active session.

### Suggested Technology

**Supabase Auth**

---

# 9. Board Management

Users should have a dashboard containing their boards.

### Dashboard

Example:

```text
+------------------------------------------------+
| Softboard                              Profile |
+------------------------------------------------+

My Boards

+----------------------+  +----------------------+
| AI Project           |  | Startup Ideas        |
| 12 items             |  | 27 items             |
| Updated 2h ago       |  | Updated yesterday    |
+----------------------+  +----------------------+

              + Create Softboard
```

### Board Requirements

Each board must have:

- Unique ID.
- Owner.
- Title.
- Optional description.
- Creation timestamp.
- Last updated timestamp.

### Board Operations

- Create.
- Read.
- Update.
- Delete.

---

# 10. Softboard Canvas

The canvas is the core product experience.

### Required Features

- Infinite or large workspace.
- Pan.
- Zoom.
- Item dragging.
- Item selection.
- Multi-selection where practical.
- Item resizing.
- Delete.
- Position persistence.
- Layer/z-index management.

### Canvas Model

The canvas should not be treated as the database.

The database stores structured board state:

```text
Board
 |
 +-- Items
 |    |
 |    +-- Note
 |    +-- Page
 |    +-- Image
 |    +-- Link
 |
 +-- Threads
```

The frontend renders this state visually.

### Suggested Technology

**React Flow** for the initial canvas implementation.

---

# 11. Board Items

All visual content should share a common `board_items` abstraction.

## 11.1 Common Item Properties

```text
id
board_id
type
x
y
width
height
rotation
z_index
created_at
updated_at
```

### Supported MVP Types

```text
note
page
image
link
```

---

# 12. Sticky Notes

Users can create small text-based notes.

### Features

- Create note.
- Edit note.
- Change note color.
- Move note.
- Resize note.
- Delete note.

### Example

```text
+--------------------------+
| Project Idea             |
|                          |
| Build an AI resume       |
| matching platform.       |
+--------------------------+
```

### Data

```json
{
  "type": "note",
  "content": "Build an AI resume matching platform.",
  "background": "yellow"
}
```

---

# 13. Pages

Pages provide a richer content format than sticky notes.

### Features

- Create page.
- Add title.
- Add rich text/content.
- Edit page.
- Move page.
- Resize page.
- Delete page.

Example:

```text
+--------------------------------+
| Architecture                  |
+--------------------------------+
|                                |
| The system will contain:      |
|                                |
| 1. FastAPI                     |
| 2. PostgreSQL                  |
| 3. Qdrant                      |
| 4. LangGraph                   |
|                                |
+--------------------------------+
```

The initial implementation can use a simple text editor. A rich-text editor can be introduced later.

---

# 14. Images / Photos

Users should be able to upload images and place them on the board.

### Features

- Upload image.
- Store image securely.
- Display image on board.
- Move image.
- Resize image.
- Delete image.

### Storage

Recommended:

**Supabase Storage** for MVP.

Future alternatives:

- Amazon S3.
- Cloudflare R2.
- MinIO.

---

# 15. Links

Users can add external URLs to the board.

Example:

```text
+-------------------------------+
| 🔗 LangGraph Documentation    |
|                               |
| Documentation and guides      |
+-------------------------------+
```

### Features

- Add URL.
- Optional title.
- Display URL preview where possible.
- Move link.
- Resize link card.
- Delete link.

Future versions can automatically fetch:

- Page title.
- Description.
- Website icon.
- Preview image.

---

# 16. Threads / Connections

Threads allow users to represent relationships between board items.

### Basic Interaction

1. User selects an item.
2. User activates "Connect".
3. User selects another item.
4. A thread is created.

Example:

```text
+--------------+
| LangGraph    |
+------+-------+
       |
       | uses
       ↓
+--------------+
| Agent System |
+--------------+
```

### Thread Properties

```text
id
board_id
source_item_id
target_item_id
label
created_at
updated_at
```

### MVP Features

- Create connection.
- Delete connection.
- Render connection.
- Optional connection label.
- Arrow direction.

### Future Features

- Bidirectional connections.
- Different line styles.
- Connection colors.
- Relationship types.
- AI-generated relationships.

---

# 17. Board Navigation

Users should be able to:

- Zoom in.
- Zoom out.
- Fit board to screen.
- Pan.
- Navigate large boards efficiently.

### Optional Controls

```text
+-------------------+
| +                 |
| -                 |
| ⛶ Fit             |
| ⌂ Home            |
+-------------------+
```

---

# 18. Board Toolbar

A persistent or contextual toolbar should provide quick access to content creation.

Example:

```text
+------------------------------------------------+
| Select | Note | Page | Image | Link | Connect |
+------------------------------------------------+
```

### Toolbar Actions

- Select.
- Add note.
- Add page.
- Upload image.
- Add link.
- Create thread.
- Delete selected item.

---

# 19. Board Persistence

Every important board modification should eventually be persisted.

Persist:

- Item creation.
- Item deletion.
- Item movement.
- Item resizing.
- Item content changes.
- Thread creation.
- Thread deletion.

### Important Requirement

The user must be able to:

1. Modify the board.
2. Refresh the page.
3. Return to the same board state.

---

# 20. Database Design

Recommended relational structure:

```text
users
  |
  +---- boards
          |
          +---- board_items
          |       |
          |       +---- notes
          |       +---- pages
          |       +---- images
          |       +---- links
          |
          +---- threads
```

## 20.1 boards

```text
boards
------
id
owner_id
title
description
created_at
updated_at
```

## 20.2 board_items

```text
board_items
-----------
id
board_id
type
x
y
width
height
rotation
z_index
created_at
updated_at
```

## 20.3 notes

```text
notes
-----
id
item_id
content
background
```

## 20.4 pages

```text
pages
-----
id
item_id
title
content
```

## 20.5 images

```text
images
------
id
item_id
storage_path
width
height
```

## 20.6 links

```text
links
-----
id
item_id
url
title
description
```

## 20.7 threads

```text
threads
-------
id
board_id
source_item_id
target_item_id
label
created_at
updated_at
```

---

# 21. Security Requirements

### Authentication

- All private boards require authentication.
- Sessions must be securely managed.
- Passwords must never be stored directly by the application.

### Authorization

Users can only access boards they own.

For future sharing:

```text
owner
editor
viewer
```

### Database Security

If using Supabase:

- Enable Row Level Security.
- Users can only read their own boards.
- Users can only modify boards they have permission to edit.
- Storage access must follow board ownership/permissions.

---

# 22. Frontend Architecture

Suggested structure:

```text
frontend/
|
├── app/
│   ├── login/
│   ├── signup/
│   ├── dashboard/
│   └── boards/
│       └── [boardId]/
|
├── components/
│   ├── board/
│   │   ├── BoardCanvas
│   │   ├── BoardToolbar
│   │   ├── BoardHeader
│   │   └── BoardControls
│   |
│   ├── items/
│   │   ├── NoteNode
│   │   ├── PageNode
│   │   ├── ImageNode
│   │   └── LinkNode
│   |
│   └── ui/
|
├── lib/
│   ├── supabase/
│   ├── api/
│   └── utils/
|
├── hooks/
|
├── types/
|
└── stores/
```

---

# 23. Backend / Data Architecture

For the MVP, Supabase can provide:

```text
                 Next.js
                    |
       +------------+-------------+
       |            |             |
       ↓            ↓             ↓
     Auth       PostgreSQL     Storage
       |            |             |
       ↓            ↓             ↓
    Users        Boards        Images
                 Items
                Threads
```

A dedicated FastAPI backend can be introduced later if the application requires more complex server-side logic.

---

# 24. Recommended Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Flow

## Backend / Infrastructure

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

## Deployment

- Vercel
- Supabase

## Future

- FastAPI
- Redis
- WebSockets
- Vector database
- LLM APIs

---

# 25. MVP User Flow

```text
Landing Page
     |
     ↓
Sign Up / Login
     |
     ↓
Dashboard
     |
     ↓
Create Softboard
     |
     ↓
Board Canvas
     |
     +------ Add Note
     |
     +------ Add Page
     |
     +------ Upload Image
     |
     +------ Add Link
     |
     +------ Connect Items
     |
     ↓
Auto-save / Persist
```

---

# 26. Post-MVP: Board Sharing

Users should eventually be able to share boards.

### Roles

| Role | View | Edit | Delete Board | Manage Members |
|---|---:|---:|---:|---:|
| Owner | Yes | Yes | Yes | Yes |
| Editor | Yes | Yes | No | No |
| Viewer | Yes | No | No | No |

### Additional Table

```text
board_members
-------------
id
board_id
user_id
role
created_at
```

---

# 27. Post-MVP: Real-Time Collaboration

Multiple users should eventually be able to edit a board simultaneously.

Example:

```text
User A                         User B

moves note                     edits page
    |                               |
    +----------- Realtime ----------+
                    |
                    ↓
               Board State
                    |
             +------+------+
             ↓             ↓
          User A         User B
```

### Features

- Real-time item movement.
- Real-time content editing.
- Real-time thread creation.
- Presence.
- User cursors.
- "User is editing..." indicators.

### Initial Technology

Supabase Realtime.

### Advanced Option

WebSockets with a dedicated backend.

---

# 28. Post-MVP: AI Features

AI should be introduced only after the core board experience is reliable.

## 28.1 Ask the Board

Users can ask questions about board content.

Example:

```text
User:
How are we planning to implement vector search?

AI:
The board indicates that the system will use
Qdrant for vector storage and retrieval...
```

Potential architecture:

```text
Board Items
     |
     ↓
Text Extraction
     |
     ↓
Embeddings
     |
     ↓
Vector Database
     |
     ↓
Retriever
     |
     ↓
LLM
     |
     ↓
Board Assistant
```

---

## 28.2 Board Summarization

User selects multiple items:

```text
12 items selected

        ↓

       AI

        ↓

"These items describe a RAG-based
resume matching architecture..."
```

---

## 28.3 Automatic Organization

AI could analyze board content and suggest groups:

```text
AI Project

├── Ideas
├── Architecture
├── Research
├── Tasks
└── Resources
```

The user should approve changes before AI rearranges the board.

---

## 28.4 Automatic Threads

AI can detect relationships:

```text
Qdrant
   |
   +---- used for ----> Vector Search
                              |
                              +---- part of ----> RAG
```

The user should be able to review and accept/reject suggested connections.

---

# 29. Search

Future search should operate at two levels.

### Keyword Search

Search:

- Board titles.
- Notes.
- Page content.
- Link titles.
- Metadata.

### Semantic Search

Eventually use embeddings to find conceptually related content.

Example:

```text
Search:
"How does our retrieval system work?"

Results:
- RAG architecture note
- Qdrant page
- Embeddings note
- Retrieval research paper
```

---

# 30. Performance Requirements

The application should remain responsive when a board contains a significant number of items.

### MVP Target

The board should handle approximately:

- 100+ items comfortably.
- 50+ connections comfortably.

### Future Target

Optimize for:

- 500+ items.
- 1,000+ connections.

Potential optimizations:

- Lazy loading.
- Virtualization.
- Debounced persistence.
- Batched database updates.
- Client-side state management.
- Optimistic updates.

---

# 31. State Management

The frontend should maintain board state separately from persistent database state.

Example:

```text
Database State
      ↓
Initial Load
      ↓
Client Board State
      ↓
User Interaction
      ↓
Optimistic UI Update
      ↓
Persistence
```

Potential state management options:

- React state for simple MVP.
- Zustand for larger client-side board state.

---

# 32. Error Handling

The application should gracefully handle:

- Failed login.
- Failed board creation.
- Failed image upload.
- Failed database writes.
- Network interruption.
- Invalid URLs.
- Missing board.
- Unauthorized access.

For failed persistence:

```text
Saving...

Saved ✓

or

Unable to save
Retry
```

---

# 33. Accessibility

The application should support:

- Keyboard navigation where practical.
- Visible focus states.
- Accessible buttons.
- Meaningful labels.
- Sufficient contrast.
- Keyboard shortcuts for common actions.

Potential shortcuts:

```text
N → New Note
P → New Page
I → Upload Image
L → Add Link
Delete → Delete selected
Ctrl/Cmd + Z → Undo
Ctrl/Cmd + Shift + Z → Redo
```

---

# 34. Analytics

Post-MVP analytics can measure:

- User registrations.
- Boards created.
- Active users.
- Items created per board.
- Most-used item types.
- Average board size.
- Board retention.
- Collaboration usage.
- AI feature usage.

Avoid collecting unnecessary personal information.

---

# 35. Success Metrics

### MVP

The MVP is successful if users can:

1. Sign up.
2. Create a board.
3. Add multiple item types.
4. Move and arrange them.
5. Connect items.
6. Refresh the page without losing state.

### Product Metrics

Potential metrics:

- Weekly active users.
- Boards created per active user.
- Average items per board.
- Percentage of boards containing threads.
- Board return rate.
- Average session duration.
- Number of shared boards.
- Collaboration sessions.
- AI feature adoption.

---

# 36. Development Roadmap

## Phase 1 — Foundation

### Week 1

- Initialize Next.js project.
- Configure TypeScript.
- Configure Tailwind.
- Configure Supabase.
- Implement authentication.
- Create database schema.
- Create dashboard.
- Implement board CRUD.

### Deliverable

Authenticated users can create and manage boards.

---

## Phase 2 — Canvas

### Week 2

- Implement React Flow.
- Add canvas navigation.
- Add zoom/pan.
- Add node selection.
- Add drag functionality.
- Persist item positions.

### Deliverable

A functional visual canvas.

---

## Phase 3 — Content

### Week 3

Implement:

- Sticky notes.
- Pages.
- Images.
- Links.
- Resize.
- Delete.
- Persistence.

### Deliverable

Users can build useful boards.

---

## Phase 4 — Threads

### Week 4

Implement:

- Item connections.
- Arrow rendering.
- Connection labels.
- Thread deletion.
- Persistence.

### Deliverable

Core Softboard MVP is complete.

---

## Phase 5 — Sharing

### Week 5

Implement:

- Public/private boards.
- Board invitations.
- Viewer permissions.
- Editor permissions.
- Member management.

---

## Phase 6 — Realtime

### Week 6

Implement:

- Real-time item changes.
- Real-time content changes.
- Presence.
- Cursor indicators.

---

## Phase 7 — AI

### Weeks 7–8

Implement:

- Board text extraction.
- Embeddings.
- Vector search.
- Ask-the-board assistant.
- Board summarization.
- Related-item suggestions.
- AI-generated threads.

---

# 37. MVP Definition of Done

The MVP is considered complete when:

### Authentication

- [ ] User can sign up.
- [ ] User can log in.
- [ ] User can log out.
- [ ] Protected routes work.

### Boards

- [ ] User can create a board.
- [ ] User can rename a board.
- [ ] User can delete a board.
- [ ] Dashboard lists boards.

### Canvas

- [ ] Canvas loads correctly.
- [ ] User can pan.
- [ ] User can zoom.
- [ ] User can select items.
- [ ] User can move items.
- [ ] User can resize items.

### Content

- [ ] User can create notes.
- [ ] User can create pages.
- [ ] User can upload images.
- [ ] User can add links.
- [ ] User can delete items.
- [ ] Item state persists.

### Threads

- [ ] User can connect two items.
- [ ] Threads render correctly.
- [ ] Threads can be labeled.
- [ ] Threads persist.
- [ ] Threads can be deleted.

### Reliability

- [ ] Refreshing a board does not lose data.
- [ ] Unauthorized users cannot access private boards.
- [ ] Database errors are handled.
- [ ] Image upload errors are handled.

---

# 38. Future Product Direction

The long-term product can evolve from a simple softboard into a **visual knowledge operating system**.

Potential architecture:

```text
                         SOFTBOARD
                             |
          +------------------+------------------+
          |                  |                  |
       Content          Connections        Collaboration
          |                  |                  |
     Notes/Pages         Threads            Realtime
     Images/Links       Knowledge Graph     Presence
          |                  |                  |
          +------------------+------------------+
                             |
                             ↓
                         AI Layer
                             |
       +---------------------+---------------------+
       |                     |                     |
   Ask Board            Summarize             Organize
       |                     |                     |
       +---------------------+---------------------+
                             |
                             ↓
                     Semantic Knowledge
```

The key differentiator should remain:

> **Information is represented as connected objects on a visual canvas, rather than isolated documents or notes.**

---

# 39. Product Principles

1. **Visual first** — The board should feel spatial, not like a traditional document editor.
2. **Low friction** — Adding content should require minimal interaction.
3. **Flexible organization** — Users should not be forced into rigid folder structures.
4. **Connections matter** — Relationships between items are first-class data.
5. **Persistence is reliable** — Users should never worry about losing board state.
6. **Collaboration comes after the core experience** — Build a strong single-user board before adding multiplayer complexity.
7. **AI should augment the board** — AI should understand and assist with existing board content rather than becoming the product itself.

---

# 40. Final MVP Architecture

```text
                       ┌───────────────┐
                       │    Next.js    │
                       │  TypeScript   │
                       └───────┬───────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ↓              ↓              ↓
             React Flow     Supabase       Storage
                │             Auth             │
                │              │               │
                ↓              ↓               ↓
          Board Canvas       Users           Images
                │
                ↓
          Board State
                │
       ┌────────┴────────┐
       ↓                 ↓
  Board Items          Threads
       │                 │
  ┌────┼────┐            │
  ↓    ↓    ↓            ↓
Note Page Image        Relations
       │
       ↓
      Link

                  PostgreSQL
                       ↑
                       │
                 Persistent State
```

---

# 41. Summary

Softboard's MVP should focus on one core experience:

> **Create a board → place different types of information → arrange them freely → connect related information → save everything reliably.**

Once this experience works well, the product can expand into:

- Collaborative boards.
- Real-time editing.
- Knowledge graphs.
- Semantic search.
- RAG.
- AI organization.
- AI-generated connections.
- An AI assistant that understands the entire board.

This creates a strong foundation for both a useful product and a technically substantial portfolio project.
