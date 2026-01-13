Run:
- `npm install`
- `node seed_products_cloudinary.mjs`

Optional env overrides:
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`
- `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`

It uploads files from `backend/db/images` to Cloudinary folder `${cloudinary.folder}/products` and:
- updates `products.image` to Cloudinary URLs
- inserts extra sample products
- writes a reproducible SQL file: `backend/db/seed_data_products_cloudinary.generated.sql`
