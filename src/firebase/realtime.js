import { ref, get, set, update, remove, query, orderByChild, push } from 'firebase/database';
import { db } from './config';

// Products CRUD operations
export const createProduct = async (productData) => {
  const productsRef = ref(db, 'products');
  const newProductRef = push(productsRef);
  await set(newProductRef, {
    ...productData,
    finalPrice: productData.rawPrice * 3, // Auto calculate final price
    createdAt: Date.now()
  });
  return newProductRef.key;
};

export const getProducts = async () => {
  const productsRef = ref(db, 'products');
  const snapshot = await get(productsRef);
  return snapshot.val() || {};
};

export const updateProduct = async (productId, productData) => {
  const productRef = ref(db, `products/${productId}`);
  await update(productRef, {
    ...productData,
    finalPrice: productData.rawPrice * 3, // Update final price on raw price change
    updatedAt: Date.now()
  });
};

export const deleteProduct = async (productId) => {
  const productRef = ref(db, `products/${productId}`);
  await remove(productRef);
};

// Resharpening Products CRUD operations
export const createResharpeningProduct = async (productData) => {
  const resharpeningRef = ref(db, 'resharpening');
  const newProductRef = push(resharpeningRef);
  await set(newProductRef, {
    ...productData,
    createdAt: Date.now()
  });
  return newProductRef.key;
};

export const getResharpeningProducts = async () => {
  const resharpeningRef = ref(db, 'resharpening');
  const snapshot = await get(resharpeningRef);
  return snapshot.val() || {};
};

// Salesperson CRUD operations
export const createSalesperson = async (salespersonData) => {
  const salespersonsRef = ref(db, 'salespersons');
  const newSalespersonRef = push(salespersonsRef);
  await set(newSalespersonRef, {
    ...salespersonData,
    createdAt: Date.now()
  });
  return newSalespersonRef.key;
};

export const getSalespersons = async () => {
  const salespersonsRef = ref(db, 'salespersons');
  const snapshot = await get(salespersonsRef);
  return snapshot.val() || {};
};

// Orders CRUD operations
export const createOrder = async (orderData) => {
  const ordersRef = ref(db, 'orders');
  const newOrderRef = push(ordersRef);
  const orderId = newOrderRef.key;
  await set(newOrderRef, {
    ...orderData,
    status: 'pending',
    trackingLink: generateTrackingLink(orderId), // Use orderId for tracking link
    createdAt: Date.now()
  });
  return orderId;
};

export const getOrders = async () => {
  const ordersRef = ref(db, 'orders');
  const snapshot = await get(ordersRef);
  return snapshot.val() || {};
};

export const deleteOrder = async (orderId) => {
  const orderRef = ref(db, `orders/${orderId}`);
  await remove(orderRef);
};

// Orders operations
export const updateOrderStatus = async (orderId, updates) => {
  const orderRef = ref(db, `orders/${orderId}`);
  const updatedData = typeof updates === 'string' 
    ? { status: updates } 
    : updates;
  await update(orderRef, {
    ...updatedData,
    updatedAt: Date.now()
  });
};

// Helper function to generate tracking link
const generateTrackingLink = (orderId) => {
  return `${window.location.origin}/track/${orderId}`;
};

// Tracking link operations
export const createTrackingLink = async (orderId) => {
  const trackingRef = ref(db, `tracking/${orderId}`);
  const trackingData = {
    orderId,
    createdAt: Date.now(),
    status: 'active'
  };
  await set(trackingRef, trackingData);
  return `/track/${orderId}`;
};

export const getTrackingInfo = async (orderId) => {
  const trackingRef = ref(db, `orders/${orderId}`);
  const snapshot = await get(trackingRef);
  return snapshot.val() || null;
};

// Dashboard Data
export const getDashboardStats = async () => {
  const [salespersons, orders] = await Promise.all([
    getSalespersons(),
    getOrders()
  ]);

  const ordersArray = Object.values(orders || {});
  
  return {
    totalSalespersons: Object.keys(salespersons || {}).length,
    totalOrders: ordersArray.length,
    activeTrackingLinks: ordersArray.filter(order => !order.trackingLinkExpired).length,
    expiredLinks: ordersArray.filter(order => order.trackingLinkExpired).length
  };
};
