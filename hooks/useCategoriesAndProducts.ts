import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { categoriessCollection, productsCollection } from '../firebase';

import { Category, fetchCategories } from '../redux/business/categoriesSlice';
import { fetchProducts, Product } from '../redux/business/productsSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

export const useCategoriesAndProducts = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [products, setProducts] = useState<Product[]>([]);
   const { business } = useAppSelector((state) => state.business);
   const [loading, setLoading] = useState(true);
   const dispatch = useAppDispatch();
   useEffect(() => {
      if (!business) return;
      const sub = onSnapshot(categoriessCollection(business.id!), (snap) => {
         setCategories(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
         dispatch(
            fetchCategories(
               snap.docs
                  .map((doc) => ({ id: doc.id, ...doc.data() }))
                  .sort((a, b) =>
                     a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
                  )
            )
         );
      });
      const subCats = onSnapshot(productsCollection(business.id!), (snap) => {
         if (snap.empty) return;
         setProducts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
         dispatch(
            fetchProducts(
               snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            )
         );
      });
      setLoading(false);
      return () => {
         sub();
         subCats();
      };
   }, [business]);

   return { categories, products, loading };
};
