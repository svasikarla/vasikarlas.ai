// Shared, non-secret constants for the live NL→SQL demo.
// Kept out of the 'use server' action file so they can be imported by the
// client widget too (a 'use server' module may only export async functions).

/* A small, realistic SaaS / e-commerce analytics schema — the only schema the
   model is allowed to query. Nothing is executed; we only generate SQL text. */
export const DEMO_SCHEMA = `customers(id, name, email, country, plan, created_at)
orders(id, customer_id, status, total_cents, created_at)
order_items(id, order_id, product_id, quantity, unit_price_cents)
products(id, name, category, price_cents, active)
subscriptions(id, customer_id, plan, mrr_cents, started_at, canceled_at)`;

export const DEMO_EXAMPLES = [
  'Top 5 customers by total revenue',
  'Monthly recurring revenue by plan',
  'Products that have never been ordered',
  'Churned subscriptions in the last 90 days',
];
