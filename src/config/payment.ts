// Payment Gateway Configuration
export const PAYMENT_CONFIG = {
  razorpay: {
    // Using your existing Razorpay keys
    keyId: 'rzp_test_S4XQEjfZfBmeYM',
    keySecret: '4QF4Y2D5xflavcXJC9dRnjcm',
    
    // Razorpay API endpoints
    baseUrl: 'https://api.razorpay.com/v1',
    
    // Default options
    defaultOptions: {
      currency: 'INR',
      theme: {
        color: '#3B82F6'
      },
      modal: {
        backdropClose: false,
        escape: false,
        handleback: false,
        confirm_close: true,
        ondismiss: function() {
          console.log('Payment cancelled by user')
        }
      }
    }
  },
  
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'your_paypal_client_id',
    baseUrl: 'https://api-m.sandbox.paypal.com'
  }
}

// Helper function to get Razorpay options
export const getRazorpayOptions = (orderData: any, callbacks: any) => {
  return {
    key: PAYMENT_CONFIG.razorpay.keyId,
    amount: orderData.amount,
    currency: orderData.currency || 'INR',
    name: 'The Grand Stay',
    description: orderData.description || 'Payment for booking',
    order_id: orderData.orderId,
    handler: callbacks.onSuccess,
    prefill: orderData.prefill || {},
    theme: PAYMENT_CONFIG.razorpay.defaultOptions.theme,
    modal: {
      ...PAYMENT_CONFIG.razorpay.defaultOptions.modal,
      ondismiss: callbacks.onCancel || PAYMENT_CONFIG.razorpay.defaultOptions.modal.ondismiss
    }
  }
}