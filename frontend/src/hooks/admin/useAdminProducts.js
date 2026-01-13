import React from "react";

import { AdminBrandService } from "../../service/AdminBrandService";
import { AdminCategoryService } from "../../service/AdminCategoryService";
import { AdminProductService } from "../../service/AdminProductService";
import { getSafeImageSrc } from "../../utils/images";
import { stockCodeFromLabel } from "../../utils/status";

const DEFAULT_PRODUCT_IMAGE = "/assets/images/logo.svg";
const LEGACY_PLACEHOLDERS = ["/assets/images/products/watch.jpg", "/assets/images/about-store.svg"];

const sortByIdDesc = (list) => {
	const safe = Array.isArray(list) ? list : [];
	return [...safe].sort((a, b) => (Number(b?.id) || 0) - (Number(a?.id) || 0));
};

export function useAdminProducts() {
	const mountedRef = React.useRef(true);
	const [brands, setBrands] = React.useState([]);
	const [categories, setCategories] = React.useState([]);
	const [items, setItems] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const reload = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [brandList, categoryList, productList] = await Promise.all([
				AdminBrandService.getAll(),
				AdminCategoryService.getAll(),
				AdminProductService.getAll(),
			]);

			if (mountedRef.current) {
				setBrands(Array.isArray(brandList) ? brandList : []);
				setCategories(Array.isArray(categoryList) ? categoryList : []);
				setItems(sortByIdDesc(productList));
			}
		} catch (e) {
			if (mountedRef.current) {
				setBrands([]);
				setCategories([]);
				setItems([]);
				setError(e);
			}
			throw e;
		} finally {
			if (mountedRef.current) setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		reload().catch(() => {});
	}, [reload]);

	const save = React.useCallback(
		async ({ editingId, values, fallbackImage = DEFAULT_PRODUCT_IMAGE }) => {
			const image = getSafeImageSrc({
				src: values?.image || fallbackImage,
				fallbackSrc: DEFAULT_PRODUCT_IMAGE,
				placeholders: LEGACY_PLACEHOLDERS,
			});

			const payload = {
				code: values?.sku,
				name: values?.name,
				categoryId: values?.categoryId,
				brandId: values?.brandId,
				price: values?.price,
				stock: values?.stock,
				soldQuantity: values?.soldQuantity,
				description: values?.description,
				image,
				status: stockCodeFromLabel(values?.status),
			};

			if (editingId != null) {
				await AdminProductService.update(editingId, payload);
			} else {
				await AdminProductService.create(payload);
			}

			await reload();
		},
		[reload]
	);

	const remove = React.useCallback(
		async (id) => {
			await AdminProductService.remove(id);
			await reload();
		},
		[reload]
	);

	return { brands, categories, items, loading, error, reload, save, remove, DEFAULT_PRODUCT_IMAGE, LEGACY_PLACEHOLDERS };
}
