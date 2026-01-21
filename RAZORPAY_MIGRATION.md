# Razorpay API Migration Guide

## Overview
This guide helps you migrate from old Razorpay API keys to new ones across your entire application.

## Files Updated

### Frontend Files:
1. `src/pages/MembershipPayment.tsx` - Membership payment processing
2. `src/pages/Checkout.tsx` - Hotel booking checkout
3. `src/pages/MemberCheckout.tsx` - Member exclusive checkout
4. `src/config/payment.ts` - Centralized payment configuration (NEW)

### Backend Files:
1. `backend/routes/payment.js` - Payment processing routes

### Configuration Files:
1. `.env.example` - Environment variables template (NEW)

## Migration Steps

### Step 1: Update Environment Variables
1. Copy `.env.example` to `.env` in both root and backend directories
2. Replace placeholder values with your actual Razorpay API keys:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_ACTUAL_KEY_ID
   VITE_RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET
   RAZORPAY_KEY_ID=rzp_live_YOUR_ACTUAL_KEY_ID
   RAZORPAY_SECRET_KEY=YOUR_ACTUAL_KEY_SECRET
   ```

### Step 2: Verify Backend Configuration
1. Restart your backend server
2. Check console for Razorpay configuration warnings
3. Test payment order creation endpoint

### Step 3: Test Frontend Integration
1. Restart your frontend development server
2. Test each payment flow:
   - Regular hotel booking checkout
   - Membership payment
   - Member exclusive checkout

### Step 4: Production Deployment
1. Update production environment variables
2. Ensure all API keys are live keys (not test keys)
3. Test in production environment

## Key Changes Made

### Centralized Configuration
- Created `src/config/payment.ts` for centralized payment settings
- All Razorpay options now use this configuration
- Easier to maintain and update

### Environment Variable Support
- Removed hardcoded API keys
- Added fallback support for different environment variable names
- Added validation for missing configuration

### Improved Error Handling
- Better error messages for configuration issues
- Graceful fallbacks for missing keys
- Console warnings for debugging

## Testing Checklist

### Frontend Testing:
- [ ] Membership payment with Razorpay
- [ ] Membership payment with PayPal
- [ ] Hotel booking with Razorpay
- [ ] Hotel booking with PayPal
- [ ] Member checkout with Razorpay
- [ ] Payment cancellation handling
- [ ] Payment failure handling

### Backend Testing:
- [ ] Order creation endpoint
- [ ] Payment verification endpoint
- [ ] PayPal order creation
- [ ] PayPal payment capture
- [ ] Error handling for invalid keys

## Troubleshooting

### Common Issues:

1. **"Razorpay API keys not configured"**
   - Check your `.env` file exists
   - Verify environment variable names match exactly
   - Restart your server after updating `.env`

2. **"Payment initialization failed"**
   - Verify your Razorpay key is active
   - Check if you're using test keys in production
   - Ensure key has proper permissions

3. **"Order creation failed"**
   - Check backend logs for detailed error
   - Verify Razorpay secret key is correct
   - Ensure amount is in correct format (paise for INR)

### Debug Commands:
```bash
# Check environment variables are loaded
echo $RAZORPAY_KEY_ID
echo $VITE_RAZORPAY_KEY_ID

# Test backend payment endpoint
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 100000, "currency": "INR"}'
```

## Security Notes

1. **Never commit API keys to version control**
2. **Use different keys for development and production**
3. **Regularly rotate your API keys**
4. **Monitor your Razorpay dashboard for suspicious activity**
5. **Keep your secret keys secure and never expose them in frontend code**

## Support

If you encounter issues during migration:
1. Check Razorpay dashboard for key status
2. Review server logs for detailed error messages
3. Test with Razorpay's test keys first
4. Contact Razorpay support if API-related issues persist