-- Seed data for 3Jars app
-- This creates sample profiles and initial transactions

-- Insert sample profiles (jars will be created automatically via trigger)
INSERT INTO profiles (name, age, avatar_color) VALUES
  ('Emma', 11, '#3B82F6'),
  ('Liam', 7, '#10B981'),
  ('Sophia', 5, '#EF4444');

-- Wait for triggers to create jars, then add some initial transactions
-- We'll use a DO block to handle this properly
DO $$
DECLARE
  emma_id UUID;
  liam_id UUID;
  sophia_id UUID;
  emma_spend_jar UUID;
  emma_save_jar UUID;
  emma_give_jar UUID;
  liam_spend_jar UUID;
  liam_save_jar UUID;
  liam_give_jar UUID;
  sophia_spend_jar UUID;
  sophia_save_jar UUID;
  sophia_give_jar UUID;
BEGIN
  -- Get profile IDs
  SELECT id INTO emma_id FROM profiles WHERE name = 'Emma' LIMIT 1;
  SELECT id INTO liam_id FROM profiles WHERE name = 'Liam' LIMIT 1;
  SELECT id INTO sophia_id FROM profiles WHERE name = 'Sophia' LIMIT 1;
  
  -- Get jar IDs for Emma
  SELECT id INTO emma_spend_jar FROM jars WHERE profile_id = emma_id AND type = 'spend';
  SELECT id INTO emma_save_jar FROM jars WHERE profile_id = emma_id AND type = 'save';
  SELECT id INTO emma_give_jar FROM jars WHERE profile_id = emma_id AND type = 'give';
  
  -- Get jar IDs for Liam
  SELECT id INTO liam_spend_jar FROM jars WHERE profile_id = liam_id AND type = 'spend';
  SELECT id INTO liam_save_jar FROM jars WHERE profile_id = liam_id AND type = 'save';
  SELECT id INTO liam_give_jar FROM jars WHERE profile_id = liam_id AND type = 'give';
  
  -- Get jar IDs for Sophia
  SELECT id INTO sophia_spend_jar FROM jars WHERE profile_id = sophia_id AND type = 'spend';
  SELECT id INTO sophia_save_jar FROM jars WHERE profile_id = sophia_id AND type = 'save';
  SELECT id INTO sophia_give_jar FROM jars WHERE profile_id = sophia_id AND type = 'give';
  
  -- Add initial transactions for Emma
  INSERT INTO transactions (jar_id, profile_id, type, jar_type, amount, note, created_at) VALUES
    (emma_spend_jar, emma_id, 'deposit', 'spend', 20.00, 'Weekly allowance', NOW() - INTERVAL '14 days'),
    (emma_save_jar, emma_id, 'deposit', 'save', 50.00, 'Birthday money from Grandma', NOW() - INTERVAL '30 days'),
    (emma_give_jar, emma_id, 'deposit', 'give', 10.00, 'For charity', NOW() - INTERVAL '21 days'),
    (emma_spend_jar, emma_id, 'withdrawal', 'spend', 5.50, 'Bought ice cream', NOW() - INTERVAL '7 days'),
    (emma_save_jar, emma_id, 'deposit', 'save', 25.00, 'Saved from chores', NOW() - INTERVAL '10 days'),
    (emma_save_jar, emma_id, 'interest', 'save', 5.00, 'Monthly Interest Reward - January 2024 (Flat $5 bonus)', NOW() - INTERVAL '5 days'),
    (emma_spend_jar, emma_id, 'deposit', 'spend', 15.00, 'Weekly allowance', NOW() - INTERVAL '2 days');
  
  -- Add initial transactions for Liam
  INSERT INTO transactions (jar_id, profile_id, type, jar_type, amount, note, created_at) VALUES
    (liam_spend_jar, liam_id, 'deposit', 'spend', 15.00, 'Weekly allowance', NOW() - INTERVAL '14 days'),
    (liam_save_jar, liam_id, 'deposit', 'save', 100.00, 'Christmas money', NOW() - INTERVAL '45 days'),
    (liam_give_jar, liam_id, 'deposit', 'give', 5.00, 'For sharing', NOW() - INTERVAL '20 days'),
    (liam_spend_jar, liam_id, 'withdrawal', 'spend', 8.00, 'Bought toy car', NOW() - INTERVAL '6 days'),
    (liam_save_jar, liam_id, 'deposit', 'save', 20.00, 'Tooth fairy', NOW() - INTERVAL '8 days'),
    (liam_save_jar, liam_id, 'interest', 'save', 12.00, 'Monthly Interest Reward - January 2024 (10% interest)', NOW() - INTERVAL '5 days');
  
  -- Add initial transactions for Sophia
  INSERT INTO transactions (jar_id, profile_id, type, jar_type, amount, note, created_at) VALUES
    (sophia_spend_jar, sophia_id, 'deposit', 'spend', 10.00, 'Weekly allowance', NOW() - INTERVAL '14 days'),
    (sophia_save_jar, sophia_id, 'deposit', 'save', 30.00, 'Birthday money', NOW() - INTERVAL '60 days'),
    (sophia_give_jar, sophia_id, 'deposit', 'give', 3.00, 'For helping', NOW() - INTERVAL '25 days'),
    (sophia_spend_jar, sophia_id, 'withdrawal', 'spend', 2.50, 'Bought stickers', NOW() - INTERVAL '3 days'),
    (sophia_save_jar, sophia_id, 'deposit', 'save', 10.00, 'Good behavior reward', NOW() - INTERVAL '15 days');
  
  -- Set some savings goals
  UPDATE jars SET 
    goal_amount = 200.00, 
    goal_description = 'New bicycle' 
  WHERE profile_id = emma_id AND type = 'save';
  
  UPDATE jars SET 
    goal_amount = 150.00, 
    goal_description = 'Video game' 
  WHERE profile_id = liam_id AND type = 'save';
  
  UPDATE jars SET 
    goal_amount = 50.00, 
    goal_description = 'Dollhouse' 
  WHERE profile_id = sophia_id AND type = 'save';
  
END $$;