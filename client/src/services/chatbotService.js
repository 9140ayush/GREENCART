export const SYSTEM_PROMPT = `
You are GreenCart AI, a smart, friendly shopping assistant for GreenCart —
a fresh grocery and vegetables e-commerce platform.

YOUR PERSONALITY:
- Warm, helpful, concise
- Use 1-2 relevant food emojis per message (🥦 🍅 🥕 🛒 etc.)
- Keep responses SHORT (2-4 lines max) unless listing products
- Never say you cannot help — always guide the customer forward

YOU CAN HELP WITH:
1. PRODUCT SEARCH & SUGGESTIONS
   - When customer asks for a product (e.g. "apples", "organic vegetables"),
     reply with: name, estimated price range, freshness tip, and say
     "Added to your search! 🛒" with a suggestion to visit All Products page.
   - Suggest 2-3 related items the customer might also like.
   - Example: "fresh apples" → suggest pears, oranges, apple juice.

2. CART HELP
   - If customer says "view my cart" or "my cart", reply:
     "You can view your cart by clicking the 🛒 icon at the top right!
      Currently I can see you have items waiting. Want me to suggest
      something to go with them? 🥗"

3. DELIVERY INFORMATION
   - Standard delivery: 2-4 hours for local, 1-2 days for outstation
   - Free delivery on orders above ₹499
   - Express delivery available for ₹49 extra

4. RETURN & REFUND POLICY
   - Fresh produce: report within 24 hours of delivery for full refund
   - Packaged items: 7-day return window
   - Refund processed in 3-5 business days to original payment method

5. PAYMENT METHODS
   - UPI, Credit/Debit Card, Net Banking, Cash on Delivery, Wallets
   - All payments are 100% secure

6. OFFERS & DEALS
   - Tell customers to check the "Explore Deals" section on homepage
   - First order: Use code FRESH10 for 10% off
   - Weekend deals: Extra 5% on vegetables every Saturday-Sunday

7. PRODUCT FILTERING GUIDANCE
   - Help customers narrow choices by asking:
     "Are you looking for organic, budget-friendly, or premium quality? 🌿"
   - Based on answer, guide them: "Filter by [category] on the All Products page"

8. ORDER TRACKING
   - "You can track your order in your profile under 'My Orders' 📦"

9. RECIPE SUGGESTIONS
   - If customer mentions a dish, suggest ingredients available on GreenCart
   - Example: "For pasta, you'll need tomatoes 🍅, garlic, onions — all fresh on GreenCart!"

10. SEASONAL PRODUCE
    - Recommend what's in season and freshest right now

STRICT RULES:
- NEVER mention competitor platforms
- NEVER make up order details or real-time inventory data
- NEVER discuss anything unrelated to GreenCart, food, or grocery shopping
- If asked something outside scope: "I'm best at helping you shop fresh! 
  Try asking me about products, delivery, or deals 🛒"
- Keep every response under 60 words unless it's a product list
`;

export const detectIntent = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes("cart") || msg.includes("my order"))
      return "cart";
    if (msg.includes("deliver") || msg.includes("shipping"))
      return "delivery";
    if (msg.includes("return") || msg.includes("refund"))
      return "return";
    if (msg.includes("payment") || msg.includes("pay") || msg.includes("upi"))
      return "payment";
    if (msg.includes("offer") || msg.includes("deal") || msg.includes("discount"))
      return "offers";
    if (msg.includes("track") || msg.includes("where is my"))
      return "tracking";
      
    // Basic product search intent for local fetching
    const searchKeywords = ["fruit", "vegetable", "organic", "fresh", "apple", "banana", "potato", "onion", "tomato"];
    if (searchKeywords.some(kw => msg.includes(kw)) || msg.includes("price") || msg.includes("cheap")) {
        return "products";
    }
      
    return "ai"; // fallback → call Claude API
};

export const getLocalResponse = (intent, message, products) => {
    switch (intent) {
        case "cart":
            return {
                text: "You can view your cart by clicking the 🛒 icon at the top right! Currently I can see you have items waiting. Want me to suggest something to go with them? 🥗",
                type: "text"
            };
        case "delivery":
            return {
                text: "We deliver within 2-4 business days! 🚚 Shipping is calculated based on your location at checkout.",
                type: "text"
            };
        case "return":
            return {
                text: "Our return policy allows returns within 7 days of delivery for fresh produce if there are quality issues. 🔄 Please check our Terms and Conditions for more details.",
                type: "text"
            };
        case "payment":
            return {
                text: "We support multiple payment methods including Credit/Debit Cards, Net Banking, and UPI. 💳 All transactions are secure.",
                type: "text"
            };
        case "offers":
            return {
                text: "Check the 'Explore Deals' section on the homepage! First order? Use code FRESH10 for 10% off. 🌟",
                type: "text"
            };
        case "tracking":
            return {
                text: "You can easily track your order in your profile under 'My Orders' 📦. Let me know if you need anything else!",
                type: "text"
            };
        case "products":
            // Reuse the existing local product filter trick if intent matches
            const msg = message.toLowerCase();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(msg) || 
                p.category.toLowerCase().includes(msg) ||
                p.description.toLowerCase().includes(msg)
            ).slice(0, 4);

            if (filtered.length > 0) {
                return {
                    text: `I found these items for you: 🛒`,
                    products: filtered,
                    type: "products"
                };
            }
            return null; // fallback to AI if no products found locally
        default:
            return null;
    }
};
