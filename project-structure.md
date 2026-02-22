# 3Jars Project Structure

## Complete File Tree

```
3jars/
├── app/                                  # Next.js App Router
│   ├── layout.tsx                        # Root layout with providers
│   ├── page.tsx                          # Profile selection (landing page)
│   ├── globals.css                       # Global styles
│   ├── dashboard/
│   │   └── page.tsx                      # Child dashboard with jars
│   ├── admin/
│   │   └── page.tsx                      # Parent tools & interest processing
│   └── api/
│       └── interest/
│           └── route.ts                  # Monthly interest calculation API
│
├── components/
│   ├── ui/
│   │   ├── jar.tsx                       # Visual jar component with fill animation
│   │   ├── modal.tsx                     # Reusable modal component
│   │   ├── button.tsx                    # Styled button component
│   │   └── progress-bar.tsx              # Goal progress visualization
│   ├── profile-card.tsx                  # Kid profile selection card
│   ├── profile-switcher.tsx              # Quick profile switcher
│   ├── transaction-modal.tsx             # Add/spend money modal
│   ├── transaction-history.tsx           # Transaction ledger view
│   └── charity-log.tsx                   # Give jar charity tracking
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Supabase client configuration
│   │   ├── types.ts                      # TypeScript types from DB
│   │   └── queries.ts                    # Database query functions
│   ├── utils.ts                          # Utility functions
│   ├── constants.ts                      # App constants (colors, limits)
│   └── interest-calculator.ts            # Interest calculation logic
│
├── hooks/
│   ├── useProfile.ts                     # Current profile state management
│   ├── useTransactions.ts                # Transaction CRUD operations
│   ├── useJars.ts                        # Jar balance management
│   └── useAuth.ts                        # Parent authentication (optional)
│
├── context/
│   └── profile-context.tsx               # Global profile state provider
│
├── public/
│   ├── jar-icons/                        # Custom jar SVGs
│   └── avatars/                          # Kid avatar images
│
├── styles/
│   └── globals.css                       # Tailwind directives
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql        # Database schema
│   ├── seed.sql                          # Sample data (optional)
│   └── config.toml                       # Supabase local config
│
├── types/
│   └── index.ts                          # Global TypeScript types
│
├── .env.local                            # Environment variables
├── next.config.js                        # Next.js configuration
├── tailwind.config.ts                    # Tailwind configuration
├── tsconfig.json                         # TypeScript configuration
├── package.json                          # Dependencies
└── README.md                             # Project documentation
```

## Database Schema Summary

### Tables:
1. **profiles** - Children profiles
   - id, name, age, avatar_color, timestamps

2. **jars** - Three jars per child
   - id, profile_id, type (spend/save/give), balance, goal_amount, goal_description

3. **transactions** - All money movements
   - id, jar_id, profile_id, type (deposit/withdrawal/interest), amount, note, is_charity_log, charity_recipient

### Key Features:
- Automatic jar creation on profile insert
- Balance auto-calculation via triggers
- Charity tracking for Give jar
- Interest transaction type for monthly rewards
- Profile overview view for easy data access

### Interest Logic:
- Balance < $100: Flat $5 bonus
- Balance >= $100: 10% interest
- Tracked as 'interest' transaction type