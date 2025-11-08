// Helper functions for the application

// Format currency to INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Format date to local string
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random order ID
export const generateOrderId = () => {
  return 'ORD' + Date.now().toString(36).toUpperCase();
};

// Calculate final price (3x of raw price)
export const calculateFinalPrice = (rawPrice) => {
  return rawPrice * 3;
};

// Check if tracking link is expired
export const isTrackingLinkExpired = (order) => {
  return order.status === 'delivered' || order.trackingLinkExpired;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};

// Sort array by date
export const sortByDate = (array, key = 'createdAt', ascending = false) => {
  return array.sort((a, b) => {
    return ascending ? a[key] - b[key] : b[key] - a[key];
  });
};

// Truncate text with ellipsis
export const truncateText = (text, limit = 50) => {
  return text.length > limit ? text.substring(0, limit) + '...' : text;
};
