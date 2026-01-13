import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import mysql from 'mysql2/promise';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const backendRoot = path.resolve(repoRoot, 'backend');
const imagesDir = path.resolve(backendRoot, 'db', 'images');
const applicationPropertiesPath = path.resolve(backendRoot, 'src', 'main', 'resources', 'application.properties');

function parseJavaProperties(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('!'));

  const props = {};
  for (const line of lines) {
    const idx = line.indexOf('=');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    props[key] = value;
  }
  return props;
}

function statusFromStock(stock) {
  return Number(stock) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK';
}

async function main() {
  const propsText = await fs.readFile(applicationPropertiesPath, 'utf8');
  const props = parseJavaProperties(propsText);

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || props['cloudinary.cloudName'];
  const apiKey = process.env.CLOUDINARY_API_KEY || props['cloudinary.apiKey'];
  const apiSecret = process.env.CLOUDINARY_API_SECRET || props['cloudinary.apiSecret'];
  const folderBase = process.env.CLOUDINARY_FOLDER || props['cloudinary.folder'] || 'mainproject';

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing Cloudinary credentials. Set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET or configure in backend/src/main/resources/application.properties');
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });

  const dbHost = process.env.MYSQL_HOST || 'localhost';
  const dbUser = process.env.MYSQL_USER || 'root';
  const dbPassword = process.env.MYSQL_PASSWORD || '1234';
  const dbName = process.env.MYSQL_DATABASE || 'mainproject';

  const conn = await mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    charset: 'utf8mb4',
  });

  const [existingProducts] = await conn.query('SELECT product_id, code, name, image FROM products ORDER BY product_id');

  const entries = await fs.readdir(imagesDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);

  if (files.length === 0) {
    throw new Error(`No files found in ${imagesDir}`);
  }

  const cloudinaryFolder = `${folderBase}/products`;
  console.log(`Uploading ${files.length} images to Cloudinary folder: ${cloudinaryFolder}`);

  const uploaded = new Map();

  for (const filename of files) {
    const filePath = path.resolve(imagesDir, filename);
    const ext = path.extname(filename);
    const base = ext ? filename.slice(0, -ext.length) : filename;

    const res = await cloudinary.uploader.upload(filePath, {
      folder: cloudinaryFolder,
      public_id: base,
      overwrite: true,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: false,
    });

    uploaded.set(filename, res.secure_url);
    console.log(`- ${filename} -> ${res.secure_url}`);
  }

  const pick = (...names) => {
    for (const n of names) {
      if (uploaded.has(n)) return uploaded.get(n);
    }
    return uploaded.get(files[0]);
  };

  // Update existing products (replace any non-cloudinary URL with an uploaded Cloudinary URL)
  const existingImageByCode = {
    'FOSSIL-ME3260': pick('ME3260_main.jfif'),
    'FOSSIL-ME3268': pick('ME3268_main.jfif'),
    'TUDOR-BB58': pick('17810501_1.avif', '17631295_1.avif'),
    'TISSOT-PRX35': pick('17631295_1.avif', 'm126334-0014.avif'),
    'CARTIER-TANK': pick('m126334-0014.avif', 'h69439411.avif'),
    'AP-RO41': pick('h69439411.avif', '17631295_1.avif'),
    'IWC-MARK18': pick('17810501_1.avif', 'h69439411.avif'),
    'SEIKO-CT': pick('17631295_1.avif', '17810501_1.avif'),
  };

  const seedProducts = [
    {
      code: 'ROLEX-SUB-DATE',
      name: 'Rolex Submariner Date',
      brandId: 1,
      categoryId: 2,
      stock: 5,
      sold: 1,
      price: 320000000,
      description: 'Rolex Submariner Date - biểu tượng diver, bền bỉ và sang trọng.',
      imageUrl: pick('17631295_1.avif', 'h69439411.avif'),
    },
    {
      code: 'ROLEX-DATEJUST-36',
      name: 'Rolex Datejust 36',
      brandId: 1,
      categoryId: 1,
      stock: 4,
      sold: 0,
      price: 280000000,
      description: 'Rolex Datejust 36 - thanh lịch, phù hợp đi làm và sự kiện.',
      imageUrl: pick('17810501_1.avif', '17631295_1.avif'),
    },
    {
      code: 'TUDOR-PELAGOS',
      name: 'Tudor Pelagos',
      brandId: 2,
      categoryId: 2,
      stock: 7,
      sold: 2,
      price: 125000000,
      description: 'Tudor Pelagos - diver tool-watch, mạnh mẽ, dễ đeo hằng ngày.',
      imageUrl: pick('17810501_1.avif', 'h69439411.avif'),
    },
    {
      code: 'TISSOT-LELOCLE',
      name: 'Tissot Le Locle Powermatic 80',
      brandId: 3,
      categoryId: 4,
      stock: 20,
      sold: 6,
      price: 14500000,
      description: 'Tissot Le Locle - dress watch phổ biến, máy Powermatic 80.',
      imageUrl: pick('m126334-0014.avif', '17631295_1.avif'),
    },
    {
      code: 'CARTIER-SANTOS',
      name: 'Cartier Santos Medium',
      brandId: 4,
      categoryId: 4,
      stock: 3,
      sold: 0,
      price: 185000000,
      description: 'Cartier Santos - thiết kế vuông cổ điển, sang trọng.',
      imageUrl: pick('h69439411.avif', 'm126334-0014.avif'),
    },
    {
      code: 'IWC-BIGPILOT',
      name: 'IWC Big Pilot',
      brandId: 6,
      categoryId: 5,
      stock: 2,
      sold: 0,
      price: 260000000,
      description: 'IWC Big Pilot - phong cách phi công đặc trưng, mặt số dễ đọc.',
      imageUrl: pick('17810501_1.avif', '17631295_1.avif'),
    },
    {
      code: 'SEIKO-5-SPORTS',
      name: 'Seiko 5 Sports',
      brandId: 8,
      categoryId: 3,
      stock: 50,
      sold: 15,
      price: 6500000,
      description: 'Seiko 5 Sports - lựa chọn thể thao, bền bỉ, dễ tiếp cận.',
      imageUrl: pick('17631295_1.avif', '17810501_1.avif'),
    },
  ];

  const existingCodes = new Set(existingProducts.map((p) => p.code));
  const toInsert = seedProducts.filter((p) => !existingCodes.has(p.code));

  await conn.query('SET NAMES utf8mb4');
  await conn.beginTransaction();

  // 1) Update images for existing products
  for (const p of existingProducts) {
    const desired = existingImageByCode[p.code];
    if (!desired) continue;

    const current = String(p.image || '');
    const isCloud = current.includes('res.cloudinary.com/') && current.includes(`/${cloudName}/`);
    if (isCloud && current === desired) continue;

    await conn.query('UPDATE products SET image=? WHERE product_id=?', [desired, p.product_id]);
  }

  // 2) Insert new sample products
  for (const p of toInsert) {
    await conn.query(
      'INSERT INTO products (name, brand_id, category_id, stock, sold_quantity, code, image, price, description, status) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [
        p.name,
        p.brandId,
        p.categoryId,
        p.stock,
        p.sold,
        p.code,
        p.imageUrl,
        p.price,
        p.description,
        statusFromStock(p.stock),
      ]
    );
  }

  await conn.commit();

  // Summary
  const [rows] = await conn.query('SELECT product_id, code, name, image FROM products ORDER BY product_id');
  console.log(`Done. Products: ${rows.length} (inserted ${toInsert.length})`);

  // Write a reproducible SQL file (with Cloudinary URLs)
  const outSqlPath = path.resolve(backendRoot, 'db', 'seed_data_products_cloudinary.generated.sql');
  const sqlLines = [];
  sqlLines.push('SET NAMES utf8mb4;');
  sqlLines.push('START TRANSACTION;');
  for (const r of rows) {
    // Only update image to current value (idempotent)
    sqlLines.push(
      `UPDATE products SET image='${String(r.image).replaceAll("'", "''")}' WHERE product_id=${Number(r.product_id)};`
    );
  }
  for (const p of toInsert) {
    sqlLines.push(
      `INSERT INTO products (name, brand_id, category_id, stock, sold_quantity, code, image, price, description, status) VALUES (` +
        `'${p.name.replaceAll("'", "''")}', ${p.brandId}, ${p.categoryId}, ${p.stock}, ${p.sold}, ` +
        `'${p.code}', '${p.imageUrl}', ${p.price}, '${p.description.replaceAll("'", "''")}', '${statusFromStock(p.stock)}');`
    );
  }
  sqlLines.push('COMMIT;');
  await fs.writeFile(outSqlPath, sqlLines.join('\n') + '\n', 'utf8');
  console.log(`Wrote SQL: ${outSqlPath}`);

  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
