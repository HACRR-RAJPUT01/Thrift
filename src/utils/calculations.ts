import { CartItem, Product } from '../types';

export interface CartCalculationResult {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  itemCount: number;
}

export function calculateCartTotals(
  items: CartItem[],
  promoPercent: number = 0
): CartCalculationResult {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Free shipping above ₹999; flat ₹99 otherwise; ₹0 if cart is empty
  const shippingFee = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 99;

  const discountAmount = Math.round((subtotal * promoPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return {
    subtotal,
    shippingFee,
    discountAmount,
    total,
    itemCount,
  };
}

export interface FilterOptions {
  category?: string;
  sizes?: string[];
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'discount';
}

export function filterProducts(products: Product[], options: FilterOptions): Product[] {
  const { category = 'All', sizes = [], maxPrice, searchQuery = '', sortBy = 'featured' } = options;

  let filtered = products.filter(product => {
    // Category filter
    if (category !== 'All' && product.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    // Size filter
    if (sizes.length > 0) {
      const hasMatchingSize = product.sizes.some(size => sizes.includes(size));
      if (!hasMatchingSize) {
        return false;
      }
    }

    // Max price filter
    if (maxPrice !== undefined && product.price > maxPrice) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchDesc) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'discount') {
    filtered.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  }

  return filtered;
}

export function calculatePitchFinancials(units: number, avgPrice: number) {
  const revenue = units * avgPrice;
  const stockCost = 12000;
  const operatingCosts = 5000; // packaging (2k) + marketing (2k) + web tools (1k)
  const projectedOperatingProfit = revenue - stockCost - operatingCosts;

  return {
    units,
    avgPrice,
    revenue,
    stockCost,
    operatingCosts,
    projectedOperatingProfit,
  };
}

export type OrderLifecycleStatus =
  | 'Placed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

export const ORDER_LIFECYCLE_STAGES: {
  status: OrderLifecycleStatus;
  label: string;
  description: string;
  percent: number;
}[] = [
  {
    status: 'Placed',
    label: 'Order Placed',
    description: 'Thrift find confirmed & logged into fulfillment queue',
    percent: 20,
  },
  {
    status: 'Processing',
    label: 'Processing',
    description: 'Undergoing fabric inspection, steam sanitization & tag check',
    percent: 45,
  },
  {
    status: 'Shipped',
    label: 'Shipped',
    description: 'Packed in eco-kraft packaging & dispatched to logistics hub',
    percent: 75,
  },
  {
    status: 'Out for Delivery',
    label: 'Out for Delivery',
    description: 'Assigned to courier partner for local doorstep delivery',
    percent: 90,
  },
  {
    status: 'Delivered',
    label: 'Delivered',
    description: 'Successfully handed over to circular wardrobe owner',
    percent: 100,
  },
];

export function getNextOrderStatus(current: OrderLifecycleStatus): OrderLifecycleStatus {
  const sequence: OrderLifecycleStatus[] = [
    'Placed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];
  const idx = sequence.indexOf(current);
  if (idx === -1 || idx === sequence.length - 1) return 'Delivered';
  return sequence[idx + 1];
}

export function getOrderStatusProgress(status: OrderLifecycleStatus): number {
  const match = ORDER_LIFECYCLE_STAGES.find((s) => s.status === status);
  return match ? match.percent : 20;
}

