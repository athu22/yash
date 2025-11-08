import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2 } from 'lucide-react';
import { getTrackingInfo } from '../../firebase/realtime';
import { formatDate } from '../../utils/helpers';

const statusSteps = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3
};

const statusIcons = {
  pending: Package,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2
};

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getTrackingInfo(orderId);
        if (!data) {
          console.error('Order not found');
          setOrder(null);
        } else {
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the order you're looking for. Please check the tracking link and try again.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Order not found</h2>
          <p className="mt-2 text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const currentStep = statusSteps[order.status];
  const StatusIcon = statusIcons[order.status];

  return (
    <>
      <Helmet>
        <title>Track Order - Yash Tools</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center mb-8">
                <StatusIcon className="mx-auto h-12 w-12 text-primary-600" />
                <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                  Order #{orderId.slice(0, 8)}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Created on {formatDate(order.createdAt)}
                </p>
              </div>

              {/* Status Timeline */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-between">
                    {Object.entries(statusSteps).map(([status, step]) => (
                      <div
                        key={status}
                        className={`flex flex-col items-center ${
                          step <= currentStep ? 'text-primary-600' : 'text-gray-400'
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            step <= currentStep
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {statusIcons[status] && React.createElement(statusIcons[status], { className: "h-5 w-5" })}
                        </div>
                        <p className="mt-2 text-sm font-medium capitalize">{status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Customer</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.customer}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{order.type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Product</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.product}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.quantity}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TrackOrder;
