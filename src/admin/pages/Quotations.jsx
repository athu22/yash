import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Copy, Link } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getProducts } from '../../firebase/realtime';
import { formatCurrency } from '../../utils/helpers';

const Quotations = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quotationLink, setQuotationLink] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(Object.entries(data).map(([id, product]) => ({
        id,
        ...product,
      })));
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const generateQuotationLink = () => {
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const quotationData = {
      productId: product.id,
      productName: product.name,
      quantity: quantity,
      rawPrice: product.rawPrice,
      finalPrice: product.finalPrice,
      totalAmount: product.finalPrice * quantity,
      generatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days validity
    };

    // In a real application, you would save this to Firebase and generate a proper URL
    // For now, we'll create a dummy link with encoded data
    const encodedData = btoa(JSON.stringify(quotationData));
    const link = `${window.location.origin}/quote/${encodedData}`;
    setQuotationLink(link);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quotationLink);
      toast.success('Quotation link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <>
      <Helmet>
        <title>Quotation Generator - Yash Tools Admin</title>
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Quotation Generator
        </h1>

        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700">
              Select Product
            </label>
            <select
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Select a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
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
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          {selectedProductData && (
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <p className="text-sm text-gray-600">
                Product: <span className="font-medium">{selectedProductData.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Unit Price: <span className="font-medium">{formatCurrency(selectedProductData.finalPrice)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Total Amount: <span className="font-medium">{formatCurrency(selectedProductData.finalPrice * quantity)}</span>
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={generateQuotationLink}
              disabled={!selectedProduct}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Quotation Link
            </button>
          </div>

          {quotationLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <Link className="h-4 w-4 text-gray-500" />
                <div className="flex-1 font-mono text-sm text-gray-600 break-all">
                  {quotationLink}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Quotations;
