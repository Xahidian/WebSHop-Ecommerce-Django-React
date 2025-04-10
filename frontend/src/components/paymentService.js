// src/components/paymentService.js

// Replace the dummy function with an API request.
export const fetchLatestItemData = async (itemId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/items/${itemId}/latest/`);
    const data = await response.json();
    return { price: data.price, available: data.available, quantity: data.quantity };
  } catch (error) {
    console.error("Error fetching item data:", error);
    return { price: 0, available: false, quantity: 0 };
  }
};

export const validateCartItems = async (cartItems) => {
  const validations = await Promise.all(
    cartItems.map(async (item) => {
      const latestData = await fetchLatestItemData(item.id);
      return {
        ...item,
        latestPrice: latestData.price,
        available: latestData.available,
        currentQuantity: latestData.quantity,
        requestedQuantity: item.quantity  // ❗ Use the quantity in cart
      };
    })
  );
  return validations;
};

export const handlePay = async (cartItems, toast) => {
  const validatedItems = await validateCartItems(cartItems);

  let priceChanged = false;
  let anyUnavailable = false;
  let insufficientQuantity = false;
  let insufficientMessage = "";

  const updatedCart = validatedItems.map((item) => {
    if (parseFloat(item.latestPrice) !== parseFloat(item.price)) {
      priceChanged = true;
      return { ...item, price: item.latestPrice };
    }

    if (!item.available) {
      anyUnavailable = true;
    }

    if (item.requestedQuantity > item.currentQuantity) {
      insufficientQuantity = true;
      insufficientMessage = `Only ${item.currentQuantity} pieces available for '${item.title}'.`;
    }

    return item;
  });

  if (priceChanged) {
    toast.error("One or more item prices have changed. Please review the updated prices.");
    return { success: false, updatedCart, reason: "PRICE_CHANGED" };
  }

  if (anyUnavailable) {
    toast.error("One or more items are no longer available.");
    return { success: false, updatedCart, reason: "ITEM_UNAVAILABLE" };
  }

  if (insufficientQuantity) {
    toast.error(insufficientMessage || "Requested quantity exceeds available stock.");
    return { success: false, updatedCart, reason: "INSUFFICIENT_QUANTITY" };
  }

  const token = localStorage.getItem('access_token');

  await Promise.all(updatedCart.map(item =>
    fetch(`http://127.0.0.1:8000/api/purchase-item/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        item_id: item.id,
        quantity: item.requestedQuantity
      })
    })
  ));

  toast.success("Payment successful! Your items are now sold.");
  return { success: true, purchasedItems: updatedCart.map(item => ({ ...item, status: 'SOLD' })) };
};

  