// In-memory store - acts as the database for demo/local dev
// In production, replace this with Firebase Admin or Supabase

export type Tag = 'hot' | 'warm' | 'cold';

export interface SellerConfig {
  access_token: string;
  phone_number_id: string;
  business_account_id: string;
  auto_reply_enabled: boolean;
  connected_at: string;
}

export interface Lead {
  lead_id: string;
  user_id: string;
  customer_name: string;
  customer_number: string;
  message: string;
  reply: string;
  tags: Tag[];
  rule_matched: boolean;
  followed_up: boolean;
  created_at: string;
}

export interface FAQ {
  faq_id: string;
  user_id: string;
  name: string;
  keywords: string[];
  answer: string;
}

export interface Product {
  product_id: string;
  user_id: string;
  name: string;
  price: string;
  description: string;
}

export interface Message {
  id: string;
  customer_name: string;
  customer_number: string;
  message: string;
  reply: string;
  created_at: string;
  type: 'received' | 'sent';
  rule_matched: boolean;
}

// ---- SEEDED DEMO DATA ----

export const demoLeads: Lead[] = [
  { lead_id: '1', user_id: 'demo', customer_name: 'Hassan Ali', customer_number: '+923001234567', message: 'Price of shoes?', reply: 'Our shoes start at PKR 1500!', tags: ['hot'], rule_matched: true, followed_up: false, created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { lead_id: '2', user_id: 'demo', customer_name: 'Ayesha Fatima', customer_number: '+923339876543', message: 'Delivery time?', reply: 'We deliver within 2-4 business days.', tags: ['warm'], rule_matched: true, followed_up: false, created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { lead_id: '3', user_id: 'demo', customer_name: 'Ahmed Khan', customer_number: '+923123456789', message: 'What is your shop location?', reply: 'We are at DHA Phase 4, open 10am-8pm.', tags: ['hot'], rule_matched: true, followed_up: true, created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { lead_id: '4', user_id: 'demo', customer_name: 'Unknown', customer_number: '+447700900077', message: 'Can you ship internationally?', reply: "Sorry, please wait for a manual reply.", tags: ['cold'], rule_matched: false, followed_up: false, created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];

export const demoFAQs: FAQ[] = [
  { faq_id: '1', user_id: 'demo', name: 'Pricing Inquiry', keywords: ['price', 'cost', 'kitna', 'rate', 'qeemat'], answer: 'Our products start at PKR 1500! Visit our catalog for full pricing.' },
  { faq_id: '2', user_id: 'demo', name: 'Delivery Time', keywords: ['delivery', 'shipping', 'time', 'kab', 'days', 'deliver'], answer: 'We typically deliver within 2-4 business days nationwide via TCS or Leopards.' },
  { faq_id: '3', user_id: 'demo', name: 'Shop Location', keywords: ['location', 'address', 'shop', 'kahan', 'where', 'visit'], answer: 'We are located at DHA Phase 4, Lahore. Open 10 AM to 8 PM, all days.' },
  { faq_id: '4', user_id: 'demo', name: 'Payment Methods', keywords: ['payment', 'pay', 'easypaisa', 'jazzcash', 'card', 'bank'], answer: 'We accept Cash on Delivery, Easypaisa, JazzCash, and bank transfer.' },
  { faq_id: '5', user_id: 'demo', name: 'Return Policy', keywords: ['return', 'exchange', 'refund', 'wapas', 'واپس'], answer: 'We offer 7-day easy returns! Just message us with your order number.' },
];

export const demoProducts: Product[] = [
  { product_id: '1', user_id: 'demo', name: 'Running Sneakers Air 9', price: 'PKR 4,500', description: 'Lightweight runners available in sizes 7-12' },
  { product_id: '2', user_id: 'demo', name: 'Wireless Earbuds X Pro', price: 'PKR 2,200', description: '30hr battery, noise cancellation' },
  { product_id: '3', user_id: 'demo', name: 'Gaming Mouse RGB', price: 'PKR 1,800', description: '7200 DPI, 6 programmable buttons' },
  { product_id: '4', user_id: 'demo', name: 'Mechanical Keyboard TKL', price: 'PKR 7,500', description: 'Blue switches, RGB backlit, compact design' },
  { product_id: '5', user_id: 'demo', name: 'Phone Case iPhone 15', price: 'PKR 800', description: 'Shockproof, military grade protection' },
];

// Mutable in-memory store (resets on server restart - fine for demo)
export const store = {
  leads: [...demoLeads],
  faqs: [...demoFAQs],
  products: [...demoProducts],
  // Seller WhatsApp config - updated via Settings page
  sellerConfig: null as SellerConfig | null,
};
