# 🌍 Paddle Payment Setup Guide

Paddle is a global payment platform that works in **200+ countries** including **Sri Lanka**!

## Why Paddle?

- ✅ Available globally (Stripe alternatives restricted in many countries)
- ✅ Handles all taxes and VAT automatically (Merchant of Record)
- ✅ Simpler compliance and setup
- ✅ Supports 100+ currencies
- ✅ Perfect for SaaS businesses

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Paddle Account

1. Go to https://www.paddle.com/
2. Click **"Start Selling"** or **"Sign Up"**
3. Choose **Paddle Billing** (not Paddle Classic)
4. Complete business verification

### Step 2: Get Your API Keys

1. Go to **Developer Tools** → **Authentication**
2. Generate an **API Key** (server-side)
3. Generate a **Client Token** (client-side)
4. Copy both to your `.env` file

### Step 3: Create Products & Prices

1. Go to **Catalog** → **Products**
2. Create two products:

#### Product 1: Pro Plan
- Name: **Glimtrics Pro**
- Price: **$14.99 USD/month**
- Billing: **Monthly recurring**
- Copy the **Price ID**

#### Product 2: Business Plan
- Name: **Glimtrics Business**
- Price: **$49.99 USD/month**
- Billing: **Monthly recurring**
- Copy the **Price ID**

### Step 4: Update Your `.env` File

```env
# Use sandbox for testing
PADDLE_API_KEY=your_api_key_here
PADDLE_ENVIRONMENT=sandbox

# Client-side token (starts with test_ or live_)
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_xxxxx
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox

# Price IDs from your products
NEXT_PUBLIC_PADDLE_PRO_PRICE_ID=pri_xxxxx
NEXT_PUBLIC_PADDLE_BUSINESS_PRICE_ID=pri_xxxxx
```

### Step 5: Set Up Webhook

1. Go to **Developer Tools** → **Notifications**
2. Create a **Webhook Destination**
3. URL: `https://yourdomain.com/api/paddle/webhook`
4. Select events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `transaction.completed`
5. Save and copy the **Webhook Secret** (not used currently, but good to have)

### Step 6: Test in Sandbox Mode

1. Restart your dev server: `npm run dev`
2. Go to `/pricing`
3. Click **Subscribe Now** on Pro or Business
4. Use Paddle test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

---

## 🔄 Switching to Production

When ready to go live:

1. **Complete Paddle verification**
2. Update `.env`:
   ```env
   PADDLE_ENVIRONMENT=production
   NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
   NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_xxxxx  # Replace with live token
   ```
3. Use **production API key** instead of sandbox
4. Update webhook URL to production domain
5. Test with a real card (you'll be charged!)

---

## 💳 Test Cards (Sandbox Mode)

| Card Number | Type | Result |
|-------------|------|--------|
| 4242 4242 4242 4242 | Visa | Success |
| 4000 0000 0000 0002 | Visa | Card declined |
| 4000 0027 6000 3184 | Visa | 3D Secure required |

---

## 🎯 Features in Your App

### Free Tier (No Payment)
- 1 dataset upload
- 5 AI insights per month
- Basic charts
- No PDF export

### Pro Tier ($14.99/month)
- Unlimited datasets
- Unlimited AI insights
- PDF export
- Priority support

### Business Tier ($49.99/month)
- Everything in Pro
- Team collaboration (future)
- API access (future)
- White-label reports (future)

---

## 🔗 Useful Links

- **Paddle Dashboard**: https://vendors.paddle.com/
- **Paddle Documentation**: https://developer.paddle.com/
- **Paddle Billing Guide**: https://developer.paddle.com/guides/billing
- **Paddle.js Reference**: https://developer.paddle.com/paddlejs/overview
- **Test Mode**: https://developer.paddle.com/concepts/payment-methods/test-mode

---

## 🛠️ Troubleshooting

### "Payment system is loading"
- Make sure `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` is set
- Check browser console for Paddle.js errors
- Restart dev server after adding environment variables

### Webhook not receiving events
- Verify webhook URL is accessible (use ngrok for local testing)
- Check webhook signature (currently not validated)
- Ensure correct events are selected

### Subscription not updating in database
- Check server logs for `[Paddle] Webhook event` messages
- Verify `customData.userId` is being passed correctly
- Ensure price IDs match your Paddle products

---

## 📊 Your Implementation

Your app is now configured with:
- ✅ Paddle.js for client-side checkout
- ✅ Paddle Node SDK for server-side API calls
- ✅ Webhook handler for subscription lifecycle
- ✅ Usage limits per plan tier
- ✅ PDF export for paid plans
- ✅ Subscription status tracking in database

**Happy selling! 🚀**
