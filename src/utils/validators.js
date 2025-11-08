// Form validation functions

// Validate product form
export const validateProduct = (data) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = 'Product name is required';
  }

  if (!data.rawPrice || data.rawPrice <= 0) {
    errors.rawPrice = 'Valid raw price is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate salesperson form
export const validateSalesperson = (data) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.password?.trim()) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate order form
export const validateOrder = (data) => {
  const errors = {};

  if (!data.type?.trim()) {
    errors.type = 'Order type is required';
  }

  if (!data.customer?.trim()) {
    errors.customer = 'Customer name is required';
  }

  if (!data.product?.trim()) {
    errors.product = 'Product selection is required';
  }

  if (!data.quantity || data.quantity <= 0) {
    errors.quantity = 'Valid quantity is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate login form
export const validateLogin = (data) => {
  const errors = {};

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.password?.trim()) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
