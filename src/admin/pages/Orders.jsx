import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Link, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  createTrackingLink,
  getProducts,
} from '../../firebase/realtime';
import { validateOrder } from '../../utils/validators';
import { formatDate, formatCurrency } from '../../utils/helpers';
import ConfirmationDialog from '../components/ConfirmationDialog';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    customer: '',
    product: '',
    quantity: 1,
  });

  useEffect(() => {
    Promise.all([fetchOrders(), fetchProducts()]);
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      const productsList = Object.entries(data).map(([id, product]) => ({
        id,
        ...product,
      }));
      setProducts(productsList);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(Object.entries(data).map(([id, order]) => ({
        id,
        ...order,
      })));
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateOrder(formData);
    if (!validation.isValid) {
      Object.values(validation.errors).forEach(error => toast.error(error));
      return;
    }

    try {
      if (editingOrder) {
        await updateOrderStatus(editingOrder.id, formData.status);
        toast.success('Order updated successfully');
      } else {
        await createOrder(formData);
        toast.success('Order created successfully');
      }
      
      setShowForm(false);
      setEditingOrder(null);
      setFormData({
        type: '',
        customer: '',
        product: '',
        quantity: 1,
      });
      fetchOrders();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      if (newStatus === 'shipped') {
        // For shipped status, create a tracking link and update both status and link
        const trackingLink = `/track/${orderId}`; // Use orderId directly for tracking
        await updateOrderStatus(orderId, {
          status: newStatus,
          trackingLink,
          trackingLinkExpired: false
        });
      } else if (newStatus === 'delivered' || newStatus === 'cancelled') {
        // Mark tracking link as expired for completed or cancelled orders
        await updateOrderStatus(orderId, {
          status: newStatus,
          trackingLinkExpired: true
        });
      } else {
        // For other statuses, just update the status string
        await updateOrderStatus(orderId, newStatus);
      }
      
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleDelete = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteConfirmOpen(true);
  };



  const openDeleteConfirm = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setOrderToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      await deleteOrder(orderToDelete);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    } finally {
      closeDeleteConfirm();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Orders - Yash Tools Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <button
            onClick={() => {
              setEditingOrder(null);
              setFormData({
                type: '',
                customer: '',
                product: '',
                quantity: 1,
              });
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Create New Order
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Order Type
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="">Select type...</option>
                      <option value="new">New Product</option>
                      <option value="resharpening">Resharpening</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      id="customer"
                      value={formData.customer}
                      onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div>
                    <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                      Product
                    </label>
                    <select
                      id="product"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="">Select product...</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.name}>
                          {product.name} - {formatCurrency(product.finalPrice)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value)) })}
                      className="mt-1 block w-full rounded-lg border-gray-300 py-2.5 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-lg border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 rounded-full p-3">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[typeof order.status === 'string' ? order.status : order.status.status]}`}>
                      {typeof order.status === 'string' ? order.status : order.status.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {order.trackingLink && (
                      <a
                        href={order.trackingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 ${order.trackingLinkExpired ? 'text-gray-400' : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'} rounded-full transition-colors duration-200`}
                      >
                        <Link className="h-5 w-5" />
                      </a>
                    )}
                    <button
                      onClick={() => openDeleteConfirm(order.id)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {order.customer}
                </h3>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {order.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Product:</span> {order.product}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Quantity:</span> {order.quantity}
                  </p>
                  <p className="text-sm text-gray-400">
                    Created: {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Update Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="block w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
      />
    </>
  );
};

export default Orders;
