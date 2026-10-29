import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, addDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with explicit database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot as required by skill guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client indicates offline status:', error.message);
    }
  }
}

// Sign in with Google Popup
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Sign in error:', err);
    throw err;
  }
}

// Sign out
export async function logOut() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign out error:', err);
    throw err;
  }
}

// Add newsletter subscription
export async function subscribeNewsletter(email: string) {
  const path = 'newsletter';
  try {
    const docRef = await addDoc(collection(db, path), {
      email,
      subscribedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Create an order in Firestore
export async function createOrderInFirestore(orderData: {
  userId: string;
  customerName: string;
  customerEmail?: string;
  shippingAddress: string;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'placed' | 'processing' | 'shipped' | 'delivered';
  itemCount: number;
  items: Array<{
    productId: string;
    productName: string;
    size: string;
    price: number;
    quantity: number;
  }>;
}) {
  const path = 'orders';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...orderData,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Fetch user orders
export async function fetchUserOrders(userId: string) {
  const path = 'orders';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Add to user wishlist
export async function addToWishlistInFirestore(userId: string, product: { id: string; title: string; price: number }) {
  const path = 'wishlists';
  try {
    const docRef = await addDoc(collection(db, path), {
      userId,
      productId: product.id,
      productName: product.title,
      price: product.price,
      addedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Remove from user wishlist
export async function removeFromWishlistInFirestore(userId: string, productId: string) {
  const path = 'wishlists';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(docSnap => deleteDoc(doc(db, path, docSnap.id)));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Fetch user wishlist IDs
export async function fetchUserWishlistIds(userId: string): Promise<string[]> {
  const path = 'wishlists';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => d.data().productId as string);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}
