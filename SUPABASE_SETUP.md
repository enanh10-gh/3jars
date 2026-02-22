# Supabase Setup Instructions for 3Jars

## Prerequisites
You need a Supabase account. Sign up for free at https://supabase.com

## Step 1: Create a New Supabase Project

1. Go to https://app.supabase.com
2. Click "New project"
3. Name your project (e.g., "3jars")
4. Set a strong database password (save this!)
5. Select a region closest to you
6. Click "Create new project"

## Step 2: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run** to create all tables, triggers, and functions

## Step 3: Add Sample Data (Optional)

1. Still in SQL Editor, create a new query
2. Copy and paste the contents of `supabase/seed.sql`
3. Click **Run** to add sample profiles and transactions

## Step 4: Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co) 
   - **anon/public key** (a long string starting with "eyJ...")

## Step 5: Configure Your Local Environment

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Example:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 6: Restart Your Development Server

1. Stop the dev server (Ctrl+C)
2. Run `npm run dev` again
3. Visit http://localhost:3000

## Troubleshooting

### Error: "Invalid supabaseUrl"
- Make sure your NEXT_PUBLIC_SUPABASE_URL starts with https:// and has no trailing slash
- Verify you've saved the `.env.local` file
- Restart the development server after changing environment variables

### Error: "No profiles found"
- Run the seed.sql file to create sample profiles
- Check the Supabase dashboard → Table Editor to verify data exists

### Authentication Issues
- Make sure Row Level Security (RLS) is disabled for testing
- To disable RLS: Go to Authentication → Policies → Disable RLS on all tables

## Security Note

For production:
1. Enable Row Level Security (RLS)
2. Add proper authentication
3. Create policies for data access
4. Never expose database passwords or service keys

## Database Schema Overview

The app creates:
- **profiles** table: Stores children's profiles
- **jars** table: Three jars per child (spend, save, give)
- **transactions** table: All money movements
- **Triggers**: Automatically create jars and update balances
- **Views**: profile_overview for easy data access

## Test Your Setup

After configuration, you should see:
1. Three sample profiles on the home page (Emma, Liam, Sophia)
2. Each child has jar balances from sample transactions
3. Transaction history shows past activity
4. Parent tools can process interest

## Next Steps

Once working:
1. Add your real children's profiles
2. Delete the sample data if desired
3. Start tracking allowances and savings!

---

Need help? Check the Supabase docs: https://supabase.com/docs