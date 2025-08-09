-- Create user_settings table
create table if not exists user_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  notification_settings jsonb not null default '{
    "emailNotifications": true,
    "costAlerts": true,
    "serviceDownAlerts": true,
    "costThreshold": 1000
  }',
  display_settings jsonb not null default '{
    "theme": "system",
    "currency": "USD",
    "language": "es"
  }',
  billing_settings jsonb not null default '{
    "billingCycle": "monthly",
    "taxRate": 16
  }',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint user_settings_user_id_key unique (user_id)
);

-- Create RLS policies for user_settings
create policy "Users can view their own settings"
  on user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on user_settings for update
  using (auth.uid() = user_id);

-- Enable RLS on user_settings
alter table user_settings enable row level security;
