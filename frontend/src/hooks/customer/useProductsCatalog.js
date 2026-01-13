import React from "react";

import { BrandService } from "../../service/BrandService";
import { CategoryService } from "../../service/CategoryService";
import { ProductService } from "../../service/ProductService";
import { ReviewService } from "../../service/ReviewService";

const clampRating = (value) => {
	const n = Number(value);
	if (!Number.isFinite(n)) return 0;
	return Math.max(0, Math.min(5, n));
};

const aggregateReviews = (reviews) => {
	const list = Array.isArray(reviews) ? reviews : [];
	const ratings = list
		.map((r) => Number(r?.rating))
		.filter((n) => Number.isFinite(n) && n > 0);
	const reviewCount = ratings.length;
	const avg = reviewCount ? ratings.reduce((sum, n) => sum + n, 0) / reviewCount : 0;
	return { rating: clampRating(avg), reviewCount };
};

export function useProductsCatalog({ enabled = true } = {}) {
	const mountedRef = React.useRef(true);
	const [products, setProducts] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(Boolean(enabled));
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const load = React.useCallback(async () => {
		if (!enabled) return;
		if (mountedRef.current) {
			setIsLoading(true);
			setError(null);
		}

		try {
			const [rawProducts, brands, categories] = await Promise.all([
				ProductService.getAll(),
				BrandService.getAll(),
				CategoryService.getAll(),
			]);

			const brandById = new Map(
				(Array.isArray(brands) ? brands : []).map((b) => [String(b.id), b])
			);
			const categoryById = new Map(
				(Array.isArray(categories) ? categories : []).map((c) => [String(c.id), c])
			);

			const base = (Array.isArray(rawProducts) ? rawProducts : []).map((p) => {
				const brand = p?.brandId != null ? brandById.get(String(p.brandId)) : null;
				const category = p?.categoryId != null ? categoryById.get(String(p.categoryId)) : null;
				return {
					...p,
					brand: brand?.name,
					category: category?.name,
					rating: 0,
					reviewCount: 0,
				};
			});

			const results = await Promise.allSettled(
				base.map(async (p) => {
					if (p?.id == null) return { id: p?.id, rating: 0, reviewCount: 0 };
					const reviews = await ReviewService.getByProductId(p.id);
					return { id: p.id, ...aggregateReviews(reviews) };
				})
			);
			const aggById = new Map();
			results.forEach((r) => {
				if (r.status !== "fulfilled") return;
				aggById.set(String(r.value?.id), {
					rating: r.value?.rating ?? 0,
					reviewCount: r.value?.reviewCount ?? 0,
				});
			});

			const enriched = base.map((p) => {
				const agg = aggById.get(String(p?.id));
				return {
					...p,
					rating: agg?.rating ?? 0,
					reviewCount: agg?.reviewCount ?? 0,
				};
			});

			if (mountedRef.current) setProducts(enriched);
		} catch (err) {
			if (mountedRef.current) {
				setProducts([]);
				setError(err);
			}
		} finally {
			if (mountedRef.current) setIsLoading(false);
		}
	}, [enabled]);

	React.useEffect(() => {
		load();
	}, [load]);

	return { products, isLoading, error, reload: load };
}
