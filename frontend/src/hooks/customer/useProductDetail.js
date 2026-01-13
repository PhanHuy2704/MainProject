import React from "react";

import { BrandService } from "../../service/BrandService";
import { CategoryService } from "../../service/CategoryService";
import { ProductService } from "../../service/ProductService";

export function useProductDetail({ productId, enabled = true } = {}) {
	const mountedRef = React.useRef(true);
	const [product, setProduct] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(Boolean(enabled));
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const load = React.useCallback(async () => {
		if (!enabled || !productId) return;
		if (mountedRef.current) {
			setIsLoading(true);
			setError(null);
		}

		try {
			const raw = await ProductService.getById(productId);
			const [brand, category] = await Promise.all([
				raw?.brandId != null ? BrandService.getById(raw.brandId) : Promise.resolve(null),
				raw?.categoryId != null ? CategoryService.getById(raw.categoryId) : Promise.resolve(null),
			]);

			const enriched = {
				...raw,
				brand: brand?.name,
				category: category?.name,
				rating: 0,
				reviews: 0,
			};

			if (mountedRef.current) setProduct(enriched);
		} catch (err) {
			if (mountedRef.current) {
				setProduct(null);
				setError(err);
			}
		} finally {
			if (mountedRef.current) setIsLoading(false);
		}
	}, [enabled, productId]);

	React.useEffect(() => {
		load();
	}, [load]);

	return { product, isLoading, error, reload: load };
}
