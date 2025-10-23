# Database Migrations

## How to Run Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the contents of `add_line_colors_migration.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Run the migration
supabase db push

# Or apply the SQL directly
psql -h <your-db-host> -U postgres -d postgres -f database/add_line_colors_migration.sql
```

## Recent Migrations

### 2025-10-18 (Part 2): Add dimensions column
- **File:** `add_dimensions_migration.sql`
- **Purpose:** Adds `dimensions` JSONB column to `page_edits` table to store page-specific dimension settings
- **Required:** Yes - without this, dimension controls will fail
- **Run this SQL:**
```sql
ALTER TABLE public.page_edits
ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{"lineBoxHeight": 30.5, "lineSpacing": 23, "marginLeft": 40, "marginRight": -125, "marginTop": 93}'::jsonb;
```

### 2025-10-18 (Part 1): Add line_colors column
- **File:** `add_line_colors_migration.sql`
- **Purpose:** Adds `line_colors` JSONB column to `page_edits` table to store individual line colors
- **Required:** Yes - without this, line color saving will fail
- **Run this SQL:**
```sql
ALTER TABLE public.page_edits
ADD COLUMN IF NOT EXISTS line_colors JSONB DEFAULT '{}'::jsonb;
```

## Schema Updates

After running ALL migrations, the `page_edits` table will have:
- `line_colors` (JSONB): Stores line-specific colors as `{"0": "black", "1": "blue", ...}`
- `dimensions` (JSONB): Stores page-specific dimension settings as `{"lineBoxHeight": 30.5, "lineSpacing": 23, ...}`
