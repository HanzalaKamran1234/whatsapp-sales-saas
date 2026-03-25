// Types for the application
export type Tag = 'hot' | 'warm' | 'cold';

export interface SellerConfig {
  access_token: string;
  phone_number_id: string;
  business_account_id: string;
  auto_reply_enabled: boolean;
  connected_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  customer_name?: string;
  customer_number: string;
  message: string;
  reply: string;
  tags?: Tag[];
  rule_matched: boolean;
  followed_up: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  user_id: string;
  keywords: string[];
  answer: string;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  price: string;
  description: string;
  created_at: string;
}

