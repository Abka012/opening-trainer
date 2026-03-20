# Chess Opening Trainer

A modern web application for building, organizing, and practicing your chess opening repertoire with spaced repetition.

## Features

- **Interactive Chessboard** - Visual board with drag-and-drop moves and keyboard navigation
- **Opening Database** - Browse 200+ ECO-coded chess openings
- **Repertoire Management** - Create, edit, and organize your personal opening lines
- **Practice Mode** - Train your repertoire with move validation and hints
- **Spaced Repetition** - SM-2 algorithm for optimal learning retention
- **Authentication** - User accounts with Supabase (email/password)
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Chess**: chess.js + react-chessboard
- **State**: Zustand + TanStack Query
- **Database**: Supabase (PostgreSQL)
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Supabase project

### Environment Setup

1. Clone the repository
2. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run this SQL in the SQL Editor:

```sql
CREATE TABLE openings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'New Opening',
  eco TEXT DEFAULT '',
  color TEXT CHECK (color IN ('white', 'black')) DEFAULT 'white',
  moves JSONB DEFAULT '[]',
  variations JSONB DEFAULT '[]',
  notes TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  practice_stats JSONB DEFAULT '{"attempts":0,"correct":0,"lastAttempt":null,"dueForReview":null}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_studied TIMESTAMPTZ
);

ALTER TABLE openings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their openings" 
  ON openings FOR ALL 
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER openings_updated_at
  BEFORE UPDATE ON openings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

3. Enable Email authentication in Supabase Dashboard → Authentication → Providers

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run test:e2e` | Run Playwright E2E tests |

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Authentication pages
│   ├── api/                # API routes
│   └── ...                 # Main pages
├── components/             # React components
│   ├── chess/              # Chess-specific components
│   ├── repertoire/          # Repertoire management
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utilities and business logic
│   ├── queries/            # TanStack Query hooks
│   ├── store/              # Zustand stores
│   ├── supabase/           # Supabase client utilities
│   ├── chess-utils.ts      # Chess logic
│   └── eco-data.ts         # ECO opening database
├── providers/              # React context providers
├── tests/                  # Unit tests
└── e2e/                    # Playwright E2E tests
```

## Keyboard Navigation

The chessboard supports keyboard navigation:

| Key | Action |
|-----|--------|
| `←` / `→` | Navigate to previous/next move |
| `↑` / `↓` | Move selection up/down on board |
| `Enter` / `Space` | Confirm move |
| `Home` / `End` | Jump to first/last move |
| `Escape` | Deselect piece |

## Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run tests with UI
npm run test:ui
```


