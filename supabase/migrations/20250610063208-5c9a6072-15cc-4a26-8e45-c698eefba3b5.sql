
-- Add payment method columns to products table
ALTER TABLE products 
ADD COLUMN pix_automatic boolean NOT NULL DEFAULT false,
ADD COLUMN recurring_card boolean NOT NULL DEFAULT false;
