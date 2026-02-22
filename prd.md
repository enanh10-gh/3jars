
# Product Requirements Document (PRD)

**Project Name:** Three Jars (3Jars)

**Role:** Senior Full-Stack Architect

**Objective:** Build a gamified web app for a parent to manage the "Three Jar" money system for three children (ages 11, 7, and 5).

## 1. User Roles & Experience

* **Admin Access:** Single-parent entry point.
* **Profile Switcher:** A simple, visual "Profile Select" screen to switch between the three children's dashboards.
* **Gamified UI:** Use "Jar" icons, progress bars, and high-contrast, fun colors suitable for kids.

## 2. Core Features

* **The Three Jars:** Every child has three distinct balances: **Spend**, **Save**, and **Give**. As the jar fills up, the child can visually see it fill up in the jar.
* **Manual Transaction Entry:** Parent inputs a total amount per child and manually assigns portions to each jar (e.g., Earned : Add  to Spend,  to Save,  to Give).
* **Ledger/History:** A simple list view for each child showing all past additions and subtractions with notes (e.g., "Chore: Mowing lawn," "Spent: Toy car").
* **Charity Log:** A specific history view within the **Give** jar to record where donations went.
* **Goal Tracking (v1.1):** Ability to set a target amount for the **Save** jar with a visual progress bar.

## 3. The "Bank of Mom & Dad" Logic (Interest Engine)

The app must calculate a monthly "Interest Payment" for the **Save** jar based on the following logic:

* **If Balance < $100: Flat bonus of $5.00.
* **If Balance >100 or =100: Percentage bonus of 10%.
* *Requirement:* A "Process Monthly Interest" button for the parent to trigger these rewards manually once a month.

## 4. Technical Stack (Suggested)

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS (for rapid, responsive UI)
* **Database:** Supabase (PostgreSQL) for easy profile and transaction management.
* **Icons:** Lucide-react or FontAwesome for the gamified "Jar" visuals.