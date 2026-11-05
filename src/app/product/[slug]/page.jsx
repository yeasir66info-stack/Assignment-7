import RequireAuth from '@/components/RequireAuth';
import ProductDetails from '@/components/ProductDetails';

export default function ProductPage() {
    return (
        <RequireAuth>
            <ProductDetails />
        </RequireAuth>
    );
}