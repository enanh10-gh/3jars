### Prompt 1: The Project Architecture (Phase 2)

> "Based on the PRD from prd.md file, let’s define the technical foundation. I want to use **Next.js (App Router)**, **Tailwind CSS**, and **Supabase**.
> 1. Please suggest a clean folder structure for this project.
> 2. Design a **PostgreSQL database schema** that includes tables for `profiles` (the kids), `jars` (linked to profiles), and `transactions` (linked to jars).
> 3. The `transactions` table should include a `type` (deposit/withdrawal), `jar_type` (spend/save/give), `amount`, `note`, and `is_charity_log` (boolean).
> 
> 
> Show me the SQL and the file tree.

---

### Prompt 2: The Walking Skeleton (Phase 3)

> "Let's initialize the project.
> 1. Create the Next.js boilerplate with Tailwind and Lucide-React for icons.
> 2. Set up a global state or basic Supabase client configuration to handle the 'Active Profile.'
> 3. Create a **Profile Selection** landing page with three large, colorful buttons/cards for the kids (names: [Kid 1], [Kid 2], [Kid 3]).
> 4. Ensure that clicking a profile sets a 'currentKid' state and redirects to a `/dashboard` route."
> 
> 

---

### Prompt 3: The Gamified Dashboard (Phase 4a)

> "Now, build the `/dashboard` page.
> 1. At the top, show the selected child's name and a 'Back to Profiles' button.
> 2. Create three large 'Jar' components side-by-side. Each should display the Jar Name (Spend, Save, Give), a fun icon, and the current balance in a large font.
> 3. Below the jars, add two big buttons: 'Add Money' and 'Spend Money.'
> 4. Use a bright, gamified color palette (e.g., Green for Save, Blue for Spend, Heart-Red for Give)."
> 
> 

---

### Prompt 4: Logic & The Interest Engine (Phase 4b)

> "Let’s implement the logic for adding money and interest.
> 1. Create a modal for 'Add Money' that lets me manually input amounts for all three jars at once.
> 2. Create a 'Parent Tools' section (password protected or just hidden) with a button: **'Process Monthly Interest'**.
> 3. **Logic:** When clicked, it should check each child's 'Save' jar balance.
> * If balance < $100, add a transaction of +$5.
> * If balance >= $100, add a transaction of 10% of the current balance.
> 
> 
> 4. Ensure these interest payments are logged in the transaction history as 'Monthly Interest Reward.'"