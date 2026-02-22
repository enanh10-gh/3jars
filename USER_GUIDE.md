# 3Jars Money Manager - User Guide

## 🚀 Getting Started

### Running the App
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to: http://localhost:3000

## 👥 Profile Selection (Home Page)

When you first open the app, you'll see three colorful profile cards:
- **Kid 1** (Age 11) - Blue theme
- **Kid 2** (Age 7) - Green theme  
- **Kid 3** (Age 5) - Red theme

Click on any profile card to enter that child's dashboard.

## 💰 The Dashboard

### Understanding the Three Jars

Each child has three money jars with different purposes:

1. **SPEND JAR (Blue/Wallet Icon)**
   - For everyday purchases and wants
   - Money the child can use freely
   
2. **SAVE JAR (Green/Piggy Bank Icon)**
   - For long-term goals and savings
   - Earns monthly interest from the "Bank of Mom & Dad"
   
3. **GIVE JAR (Red/Heart Icon)**
   - For charitable donations and gifts
   - Teaching generosity and giving back

### Visual Features
- Each jar shows a liquid fill animation based on the balance
- The fill percentage shows how "full" each jar is (based on $1000 max)
- Hover over jars to see them animate
- Total balance displayed at the top

## 💸 Managing Money

### Adding Money
1. Click the green **"Add Money"** button
2. Enter amounts for one or more jars
3. Add an optional note (e.g., "Weekly allowance")
4. Click "Add Money" to confirm

**Tips:**
- You can add to multiple jars at once
- Leave jars blank if you don't want to add to them
- The total shows at the bottom of the modal

### Spending Money
1. Click the blue **"Spend Money"** button
2. Enter amounts to spend from each jar
3. Add a note about what was purchased
4. Click "Spend Money" to confirm

**Important:**
- You cannot spend more than the jar's balance
- Error messages will show if you try to overspend
- Check the current balance shown in each jar section

## 🎯 Parent Tools

### Accessing Parent Tools
1. Click the **"Parent Tools"** button at the bottom of the dashboard
2. Enter the parent password: `1234`
3. Click "Unlock" to access parent features

### Processing Monthly Interest

The "Bank of Mom & Dad" rewards saving with monthly interest:

**Interest Rules:**
- **Balance < $100**: Flat $5.00 bonus (encouraging initial savings)
- **Balance ≥ $100**: 10% interest rate (rewarding larger savings)

**How to Process Interest:**
1. Open Parent Tools (password: 1234)
2. Review the interest preview showing:
   - Current Save jar balance
   - Calculated interest amount
   - Whether flat bonus or percentage applies
3. Click **"Process Interest"** to add interest to the Save jar
4. A success message confirms the interest was added

### Interest Example:
- If Save balance = $85.75 → Receives $5.00 flat bonus
- If Save balance = $125.75 → Receives $12.58 (10% interest)

## 🎮 Gamification Features

### Visual Rewards
- Animated jar fills that wave and move
- Sparkle effects on hover
- Color-coded jars for easy identification
- Progress percentages to motivate saving

### Educational Goals
- **Spend Jar**: Learn budgeting and making choices
- **Save Jar**: Understand compound growth and patience
- **Give Jar**: Develop generosity and social responsibility

## 💡 Tips for Parents

### Teaching Moments
1. **Weekly Allowance**: Add money regularly to teach consistency
2. **Earning Opportunities**: Add money for chores completed
3. **Spending Decisions**: Review spend transactions together
4. **Saving Goals**: Set targets for the Save jar (coming in v1.1)
5. **Giving Choices**: Let kids choose charities for their Give jar

### Best Practices
- Process interest monthly on a consistent date
- Review balances together weekly
- Celebrate savings milestones
- Track charitable giving to show impact
- Use the note field to record what money was for

## 🔧 Technical Notes

### Current Limitations (v1.0)
- Data is stored in browser memory (refreshing resets balances)
- Profile selection persists in browser storage
- No real database connection yet (Supabase integration coming)
- Single parent password for all profiles

### Planned Features (v1.1)
- Persistent data storage with Supabase
- Individual savings goals with progress bars
- Transaction history view
- Charity log for Give jar
- Custom profile creation
- Enhanced security for parent tools
- Export reports

## 🎯 Quick Reference

### Key Actions
- **Switch Profiles**: Click "Back to Profiles" → Select new profile
- **Add Money**: Green button → Enter amounts → Confirm
- **Spend Money**: Blue button → Enter amounts → Confirm
- **Process Interest**: Parent Tools → Password: 1234 → Process Interest

### Password
- **Parent Tools Password**: `1234`

## 🌟 Educational Value

This app teaches children:
- **Financial Literacy**: Understanding income, expenses, and savings
- **Goal Setting**: Saving for specific items or achievements
- **Delayed Gratification**: Earning interest by not spending
- **Generosity**: Setting aside money for others
- **Math Skills**: Calculating percentages and managing balances
- **Responsibility**: Making spending decisions within limits

---

## Need Help?

- **Restart the app**: Run `npm run dev` again
- **Reset data**: Refresh the browser (F5)
- **Change profiles**: Use "Back to Profiles" button

Enjoy teaching your kids about money management with 3Jars! 🎉