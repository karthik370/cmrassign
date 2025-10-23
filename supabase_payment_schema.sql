-- Add payment columns to users table (run this in Supabase SQL Editor)

-- 1. Add payment status columns to auth.users metadata
-- (Supabase stores this in user metadata, but we'll track in a separate table)

-- 2. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, success, failed
  payment_gateway VARCHAR(20) DEFAULT 'paytm',
  transaction_id VARCHAR(255) UNIQUE,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  payment_method VARCHAR(50),
  payment_response JSONB, -- Store full Paytm response
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT FALSE,
  payment_status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, paid, expired
  amount_paid DECIMAL(10, 2),
  paid_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL for lifetime access
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update payments
CREATE POLICY "Service role can insert payments"
  ON public.payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update payments"
  ON public.payments FOR UPDATE
  USING (true);

-- Only service role can insert/update subscriptions
CREATE POLICY "Service role can insert subscriptions"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update subscriptions"
  ON public.user_subscriptions FOR UPDATE
  USING (true);

-- 7. Create function to automatically create subscription on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, is_active, payment_status)
  VALUES (NEW.id, FALSE, 'unpaid');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to run on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Create function to check if user has paid
CREATE OR REPLACE FUNCTION public.check_user_has_access(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  SELECT is_active INTO has_access
  FROM public.user_subscriptions
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(has_access, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.payments TO authenticated;
GRANT SELECT ON public.user_subscriptions TO authenticated;
GRANT ALL ON public.payments TO service_role;
GRANT ALL ON public.user_subscriptions TO service_role;
