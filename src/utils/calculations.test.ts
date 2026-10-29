import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  filterProducts,
  calculatePitchFinancials,
  getNextOrderStatus,
  getOrderStatusProgress,
} from './calculations';
import { CartItem, Product } from '../types';

test('calculateCartTotals computes subtotal, threshold shipping, and discounts accurately', () => {
  const emptyResult = calculateCartTotals([]);
  assert.equal(emptyResult.subtotal, 0);
  assert.equal(emptyResult.shippingFee, 0);
  assert.equal(emptyResult.total, 0);

  const sampleItems: CartItem[] = [
    {
      id: 'item-1-M',
      productId: 'item-1',
      title: 'Vintage Denim Jacket',
      price: 699,
      image: '',
      size: 'M',
      quantity: 1,
    },
  ];

  // Under ₹999 -> ₹99 shipping
  const underThreshold = calculateCartTotals(sampleItems, 0);
  assert.equal(underThreshold.subtotal, 699);
  assert.equal(underThreshold.shippingFee, 99);
  assert.equal(underThreshold.total, 798);

  // Over ₹999 -> Free shipping
  const twoItems: CartItem[] = [
    ...sampleItems,
    {
      id: 'item-2-L',
      productId: 'item-2',
      title: 'Retro Sweater',
      price: 599,
      image: '',
      size: 'L',
      quantity: 1,
    },
  ];
  const overThreshold = calculateCartTotals(twoItems, 10); // 10% promo
  assert.equal(overThreshold.subtotal, 1298);
  assert.equal(overThreshold.shippingFee, 0);
  assert.equal(overThreshold.discountAmount, 130);
  assert.equal(overThreshold.total, 1168);
});

test('filterProducts properly filters by category, size, price, and search keyword', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'Vintage Denim Jacket',
      price: 699,
      originalPrice: 1299,
      category: 'Jackets',
      sizes: ['S', 'M', 'L'],
      conditionBadge: 'Grade A',
      conditionGrade: 'Grade A (Excellent Vintage)',
      description: 'Classic denim jacket',
      image: '',
      galleryImages: [],
      measurements: {},
      visibleFlaws: 'None',
      careNotes: 'Hand wash',
      fabricDetails: '100% Cotton Denim',
    },
    {
      id: '2',
      title: 'Retro Sweater',
      price: 599,
      originalPrice: 1199,
      category: 'Hoodies',
      sizes: ['M', 'XL'],
      conditionBadge: 'Grade B',
      conditionGrade: 'Grade B (Good Vintage)',
      description: 'Cosy knit sweater',
      image: '',
      galleryImages: [],
      measurements: {},
      visibleFlaws: 'Minor pilling',
      careNotes: 'Dry clean',
      fabricDetails: 'Wool blend',
    },
  ];

  // Category filter
  const jacketOnly = filterProducts(mockProducts, { category: 'Jackets' });
  assert.equal(jacketOnly.length, 1);
  assert.equal(jacketOnly[0].title, 'Vintage Denim Jacket');

  // Size filter
  const xlOnly = filterProducts(mockProducts, { sizes: ['XL'] });
  assert.equal(xlOnly.length, 1);
  assert.equal(xlOnly[0].title, 'Retro Sweater');

  // Search filter
  const searchDenim = filterProducts(mockProducts, { searchQuery: 'denim' });
  assert.equal(searchDenim.length, 1);
  assert.equal(searchDenim[0].id, '1');

  // Price filter
  const cheapOnly = filterProducts(mockProducts, { maxPrice: 600 });
  assert.equal(cheapOnly.length, 1);
  assert.equal(cheapOnly[0].id, '2');
});

test('calculatePitchFinancials matches startup pitch numbers from PDF', () => {
  // 40 items * 650 avg = 26,000 revenue
  // 26,000 revenue - 12,000 stock - 5,000 operating = 9,000 projected profit
  const pitch = calculatePitchFinancials(40, 650);
  assert.equal(pitch.revenue, 26000);
  assert.equal(pitch.stockCost, 12000);
  assert.equal(pitch.operatingCosts, 5000);
  assert.equal(pitch.projectedOperatingProfit, 9000);
});

test('order lifecycle transitions sequentially through stages', () => {
  assert.equal(getNextOrderStatus('Placed'), 'Processing');
  assert.equal(getNextOrderStatus('Processing'), 'Shipped');
  assert.equal(getNextOrderStatus('Shipped'), 'Out for Delivery');
  assert.equal(getNextOrderStatus('Out for Delivery'), 'Delivered');
  assert.equal(getNextOrderStatus('Delivered'), 'Delivered');

  assert.equal(getOrderStatusProgress('Placed'), 20);
  assert.equal(getOrderStatusProgress('Processing'), 45);
  assert.equal(getOrderStatusProgress('Shipped'), 75);
  assert.equal(getOrderStatusProgress('Out for Delivery'), 90);
  assert.equal(getOrderStatusProgress('Delivered'), 100);
});

