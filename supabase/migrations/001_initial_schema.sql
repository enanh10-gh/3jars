-- Create profiles table for children
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    age INTEGER,
    avatar_color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create jar types enum
CREATE TYPE jar_type AS ENUM ('spend', 'save', 'give');

-- Create jars table (3 jars per profile)
CREATE TABLE jars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type jar_type NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00 CHECK (balance >= 0),
    goal_amount DECIMAL(10, 2) DEFAULT NULL,
    goal_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, type)
);

-- Create transaction types enum
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'interest');

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jar_id UUID NOT NULL REFERENCES jars(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    jar_type jar_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    note TEXT,
    is_charity_log BOOLEAN DEFAULT FALSE,
    charity_recipient TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_jars_profile_id ON jars(profile_id);
CREATE INDEX idx_transactions_jar_id ON transactions(jar_id);
CREATE INDEX idx_transactions_profile_id ON transactions(profile_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_charity ON transactions(is_charity_log) WHERE is_charity_log = TRUE;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Apply updated_at trigger to jars
CREATE TRIGGER update_jars_updated_at
    BEFORE UPDATE ON jars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function to automatically create 3 jars when a profile is created
CREATE OR REPLACE FUNCTION create_jars_for_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO jars (profile_id, type) VALUES
        (NEW.id, 'spend'),
        (NEW.id, 'save'),
        (NEW.id, 'give');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create jars after profile insertion
CREATE TRIGGER create_jars_after_profile_insert
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_jars_for_profile();

-- Function to update jar balance after transaction
CREATE OR REPLACE FUNCTION update_jar_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'deposit' OR NEW.type = 'interest' THEN
            UPDATE jars 
            SET balance = balance + NEW.amount 
            WHERE id = NEW.jar_id;
        ELSIF NEW.type = 'withdrawal' THEN
            UPDATE jars 
            SET balance = balance - NEW.amount 
            WHERE id = NEW.jar_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.type = 'deposit' OR OLD.type = 'interest' THEN
            UPDATE jars 
            SET balance = balance - OLD.amount 
            WHERE id = OLD.jar_id;
        ELSIF OLD.type = 'withdrawal' THEN
            UPDATE jars 
            SET balance = balance + OLD.amount 
            WHERE id = OLD.jar_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update jar balance after transaction changes
CREATE TRIGGER update_balance_after_transaction
    AFTER INSERT OR DELETE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_jar_balance();

-- Row Level Security (RLS) - Optional but recommended
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jars ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create view for easy profile overview
CREATE VIEW profile_overview AS
SELECT 
    p.id,
    p.name,
    p.age,
    p.avatar_color,
    MAX(CASE WHEN j.type = 'spend' THEN j.balance END) as spend_balance,
    MAX(CASE WHEN j.type = 'save' THEN j.balance END) as save_balance,
    MAX(CASE WHEN j.type = 'give' THEN j.balance END) as give_balance,
    MAX(CASE WHEN j.type = 'save' THEN j.goal_amount END) as save_goal,
    p.created_at,
    p.updated_at
FROM profiles p
LEFT JOIN jars j ON p.id = j.profile_id
GROUP BY p.id, p.name, p.age, p.avatar_color, p.created_at, p.updated_at;