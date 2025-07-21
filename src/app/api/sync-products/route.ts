import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { products } from '@/data/products';

export async function POST(request: NextRequest) {
  try {
    // Clear existing products
    const existingProducts = await getDocs(collection(db, 'products'));
    const deletePromises = existingProducts.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Add new products
    const addPromises = products.map(product => {
      const productData = {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return addDoc(collection(db, 'products'), productData);
    });

    await Promise.all(addPromises);

    return NextResponse.json(
      { message: `Successfully synced ${products.length} products to Firestore` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error syncing products:', error);
    return NextResponse.json(
      { message: 'Failed to sync products' },
      { status: 500 }
    );
  }
} 