export interface P_Size {
    id: string | number;
    size: string;
    price: number | string;
}
export const PRODUCT_SIZES: P_Size[] = [
    { id: 'small', size: 'small', price: 0 },
    { id: 'medium', size: 'medium', price: 0 },
    { id: 'large', size: 'large', price: 0 }
];
