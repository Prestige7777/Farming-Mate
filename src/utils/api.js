// src/utils/api.js

const API_BASE_URL = 'http://localhost:3001';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    } else {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText || 'Something went wrong');
    }
  }
  return response.json();
};

// User API
export const getAllUsers = () => fetch(`${API_BASE_URL}/users`).then(handleResponse);
export const getUserById = (id) => fetch(`${API_BASE_URL}/users/${id}`).then(handleResponse);

export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH', // Use PATCH to update specific fields
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Product API
export const getAllProducts = () => fetch(`${API_BASE_URL}/products`).then(handleResponse);
export const getProductById = (id) => fetch(`${API_BASE_URL}/products/${id}`).then(handleResponse);
export const getFeaturedProducts = async () => {
  const products = await getAllProducts();
  return products.filter(p => p.isFeatured);
};

export const getProductsByTag = async (tag) => {
  try {
    const allProducts = await getAllProducts(); // Fetch all products
    // Filter products to include only those that have the exact tag in their tags array
    const filteredProducts = allProducts.filter(product =>
      product.tags && product.tags.includes(tag)
    );
    return filteredProducts;
  } catch (error) {
    console.error(`Error fetching products by tag ${tag}:`, error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Story API
export const getAllStories = () => fetch(`${API_BASE_URL}/stories`).then(handleResponse);
export const getStoryById = (id) => fetch(`${API_BASE_URL}/stories/${id}`).then(handleResponse);

export const createStory = async (storyData) => {
  const response = await fetch(`${API_BASE_URL}/stories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storyData),
  });
  return handleResponse(response);
};

export const updateStory = async (id, storyData) => {
  const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storyData),
  });
  return handleResponse(response);
};

export const deleteStory = async (id) => {
  const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Cart API
export const getCart = (userId) => fetch(`${API_BASE_URL}/cart?userId=${userId}`).then(handleResponse);

export const addToCart = async (cartItem) => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartItem),
  });
  return handleResponse(response);
};

export const updateCartItem = async (id, quantity) => {
  const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });
  return handleResponse(response);
};

export const removeCartItem = async (id) => {
  const response = await fetch(`${API_BASE_URL}/cart/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Farmer API (assuming farmers are users with role 'farmer')
export const getAllFarmers = async () => {
  const users = await getAllUsers();
  return users.filter(user => user.role === 'farmer');
};

export const getFarmerById = (id) => getUserById(id);

export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const getProductsByFarmerId = (farmerId) => fetch(`${API_BASE_URL}/products?farmerId=${farmerId}`).then(handleResponse);

// Wishlist API
export const getWishlist = (userId) => fetch(`${API_BASE_URL}/wishlist?userId=${userId}`).then(handleResponse);

export const addToWishlist = async (wishlistItem) => {
  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wishlistItem),
  });
  return handleResponse(response);
};

export const removeFromWishlist = async (id) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};


