# Wearspace Outfitly: Aplikasi E-commerce Pakaian

## Overview

Wearspace Outfitly adalah aplikasi e-commerce yang dirancang untuk memudahkan pengguna dalam menjelajahi, membeli, dan mengelola produk pakaian, merek, serta menemukan inspirasi *fashion*. Aplikasi ini terdiri dari *frontend* yang dibangun dengan React.js dan *backend* menggunakan *framework* Pyramid (Python) dengan SQLAlchemy sebagai ORM. Tujuan utama aplikasi ini adalah menyediakan pengalaman belanja yang intuitif dan fungsional, baik untuk pengguna umum maupun admin yang mengelola katalog produk.

## Fitur

### Fitur Pengguna (Customer)
* **Autentikasi Pengguna**: Login dan Registrasi akun baru.
* **Katalog Produk**: Melihat daftar semua produk yang tersedia.
* **Detail Produk**: Melihat informasi rinci tentang setiap produk, termasuk harga, deskripsi, ukuran, dan warna.
* **Manajemen Favorit**: Menambahkan atau menghapus produk dari daftar favorit pribadi.
* **Proses Checkout**: Melakukan pembelian produk dengan mengisi detail pengiriman dan metode pembayaran.
* **Riwayat Transaksi**: Melihat semua transaksi yang pernah dilakukan.
* **Detail Transaksi & Faktur**: Melihat detail transaksi spesifik dan mencetak faktur.
* **Manajemen Akun**: Mengelola informasi profil pribadi (email, telepon, alamat, password).
* **Inspirasi Outfit**: Menjelajahi inspirasi outfit berdasarkan tag untuk rekomendasi gaya.

### Fitur Admin
* **Dashboard Admin**: Melihat ringkasan data seperti total produk, merek, dan inspirasi.
* **Manajemen Produk**: Menambah, mengedit, dan menghapus produk.
* **Manajemen Merek**: Menambah, mengedit, dan menghapus merek.
* **Manajemen Inspirasi**: Menambah, mengedit, dan menghapus postingan inspirasi.

## Struktur Folder Proyek

Proyek ini dipisahkan menjadi dua direktori utama: `frontend` dan `wearspace_app-backend`.
```
.
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── hooks/
│   │   │   ├── useApi.js
│   │   │   ├── useAuth.js
│   │   │   ├── useBrands.js
│   │   │   ├── useFavorites.js
│   │   │   ├── useInspirations.js
│   │   │   ├── useProducts.js
│   │   │   ├── useTransactions.js
│   │   │   └── useUsers.js
│   │   ├── pages/
│   │   │   ├── Account.jsx
│   │   │   ├── Brands.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DetailProduct.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Inspirations.jsx
│   │   │   ├── Invoice.jsx
│   │   │   ├── Katalog.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ManageInspirations.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Success.jsx
│   │   │   ├── TransactionDetails.jsx
│   │   │   └── Transactions.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   └── checkSession.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── script.py
│   └── tailwind.config.js
├── wearspace_app-backend/
│   ├── alembic/
│   │   ├── versions/
│   │   │   ├── 20250527_294e4f48bbcd.py
│   │   │   ├── 20250528_0a7dee3d4191.py
│   │   │   └── README.txt
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── wearspace_app/
│   │   ├── models/
│   │   │   ├── init.py
│   │   │   ├── brand.py
│   │   │   ├── favorite.py
│   │   │   ├── inspiration.py
│   │   │   ├── meta.py
│   │   │   ├── product.py
│   │   │   ├── transaction.py
│   │   │   └── user.py
│   │   ├── scripts/
│   │   │   ├── init.py
│   │   │   └── initialize_db.py
│   │   ├── static/
│   │   │   └── theme.css
│   │   ├── templates/
│   │   │   ├── 404.jinja2
│   │   │   ├── layout.jinja2
│   │   │   └── mytemplate.jinja2
│   │   ├── views/
│   │   │   ├── init.py
│   │   │   ├── api.py
│   │   │   ├── default.py
│   │   │   └── notfound.py
│   │   ├── init.py
│   │   ├── cors.py
│   │   ├── pshell.py
│   │   ├── routes.py
│   │   └── tests.py
│   ├── CHANGES.txt
│   ├── context.md
│   ├── development.ini
│   ├── production.ini
│   ├── pytest.ini
│   ├── README.txt
│   ├── script.py
│   ├── setup.py
│   └── wearspace_app.egg-info/
│       ├── PKG-INFO
│       ├── SOURCES.txt
│       ├── dependency_links.txt
│       ├── entry_points.txt
│       ├── requires.txt
│       └── top_level.txt
```


## Tabel Backend (SQLAlchemy Models)

Berikut adalah skema tabel utama dalam database backend, beserta relasinya:

* **`users`**: Menyimpan data pengguna.
    * `id` (UUID, Primary Key)
    * `email` (String, Unique, Not Null)
    * `hashed_password` (String, Not Null)
    * `phone` (String, Nullable)
    * `address` (Text, Nullable)
    * `created_at` (DateTime)
    * `updated_at` (DateTime)
    * **Relasi**: Memiliki banyak `transactions` dan `favorites`.

* **`brands`**: Menyimpan data merek produk.
    * `id` (UUID, Primary Key)
    * `name` (String, Unique, Not Null)
    * `created_at` (DateTime)
    * `updated_at` (DateTime)
    * **Relasi**: Memiliki banyak `products`.

* **`products`**: Menyimpan data produk.
    * `id` (UUID, Primary Key)
    * `name` (String, Not Null)
    * `brand_id` (UUID, Foreign Key ke `brands.id`, Not Null)
    * `price` (DECIMAL, Not Null)
    * `description` (Text, Nullable)
    * `image_url` (String, Nullable)
    * `material` (String, Nullable)
    * `category` (String, Nullable)
    * `stock` (Integer, Default 0)
    * `sizes` (ARRAY of String, Nullable)
    * `colors` (ARRAY of String, Nullable)
    * `created_at` (DateTime)
    * `updated_at` (DateTime)
    * **Relasi**: Merujuk ke `brand` tunggal. Memiliki banyak `transactions` dan `favorites`.
        * `transactions`: `relationship('Transaction', back_populates='product', cascade='all, delete-orphan', passive_deletes=True)` - Ketika produk dihapus, transaksi terkait akan ikut dihapus.
        * `favorites`: `relationship('Favorite', back_populates='product', cascade='all, delete-orphan', passive_deletes=True)` - Ketika produk dihapus, favorit terkait akan ikut dihapus.

* **`transactions`**: Menyimpan data transaksi pembelian.
    * `id` (UUID, Primary Key)
    * `user_id` (UUID, Foreign Key ke `users.id`, Nullable)
    * `product_id` (UUID, Foreign Key ke `products.id`, Not Null, `ondelete='CASCADE'`)
    * `customer_name` (String, Not Null)
    * `shipping_address` (Text, Not Null)
    * `payment_method` (String, Not Null)
    * `transaction_status` (String, Not Null, Default 'Menunggu Pembayaran')
    * `purchased_size` (String, Not Null)
    * `purchased_color` (String, Not Null)
    * `transaction_date` (DateTime)
    * `updated_at` (DateTime)
    * **Relasi**: Merujuk ke `user` (opsional) dan `product` tunggal.

* **`favorites`**: Menyimpan produk favorit pengguna.
    * `user_id` (UUID, Foreign Key ke `users.id`, Primary Key)
    * `product_id` (UUID, Foreign Key ke `products.id`, Primary Key, `ondelete='CASCADE'`)
    * `created_at` (DateTime)
    * **Relasi**: Merujuk ke `user` dan `product` tunggal.

* **`inspirations`**: Menyimpan data inspirasi *fashion*.
    * `id` (UUID, Primary Key)
    * `title` (String, Not Null)
    * `description` (Text, Nullable)
    * `image_url` (String, Nullable)
    * `tag` (String, Nullable)
    * `created_at` (DateTime)
    * `updated_at` (DateTime)

## API Endpoints (Backend)

Semua *endpoint* API berada di bawah *path* `/api/`.

### Authentication & User Management
* `POST /api/auth/register`: Mendaftar pengguna baru.
* `POST /api/auth/login`: Melakukan login pengguna.
* `POST /api/auth/logout`: Melakukan logout pengguna.
* `GET /api/users`: Mendapatkan daftar semua pengguna.
* `GET /api/users/{id}`: Mendapatkan detail pengguna berdasarkan ID.
* `PUT /api/users/{id}`: Memperbarui data pengguna.
* `DELETE /api/users/{id}`: Menghapus pengguna.

### Brand Management
* `GET /api/brands`: Mendapatkan daftar semua merek.
* `POST /api/brands`: Menambah merek baru.
* `PUT /api/brands/{id}`: Memperbarui merek.
* `DELETE /api/brands/{id}`: Menghapus merek.

### Product Management
* `GET /api/products`: Mendapatkan daftar semua produk.
* `POST /api/products`: Menambah produk baru.
* `GET /api/products/{id}`: Mendapatkan detail produk berdasarkan ID.
* `PUT /api/products/{id}`: Memperbarui produk.
* `DELETE /api/products/{id}`: Menghapus produk.

### Transaction Management
* `GET /api/transactions`: Mendapatkan daftar semua transaksi.
* `POST /api/transactions`: Membuat transaksi baru.
* `GET /api/transactions/{id}`: Mendapatkan detail transaksi berdasarkan ID.
* `PUT /api/transactions/{id}`: Memperbarui status transaksi.
* `DELETE /api/transactions/{id}`: Menghapus transaksi.

### Favorite Management
* `GET /api/favorites`: Mendapatkan daftar favorit pengguna yang sedang login.
* `POST /api/favorites`: Menambah produk ke favorit.
* `DELETE /api/favorites/{product_id}`: Menghapus produk dari favorit.

### Inspiration Management
* `GET /api/inspirations`: Mendapatkan daftar semua inspirasi (mendukung filter tag).
* `POST /api/inspirations`: Menambah inspirasi baru.
* `GET /api/inspirations/{id}`: Mendapatkan detail inspirasi berdasarkan ID.
* `PUT /api/inspirations/{id}`: Memperbarui inspirasi.
* `DELETE /api/inspirations/{id}`: Menghapus inspirasi.

## Cara Menjalankan Aplikasi

### Persyaratan
* Python 3.8+
* Node.js & npm (atau Yarn)
* PostgreSQL (disarankan untuk backend)

### Setup Backend

1.  **Navigasi ke Direktori Backend**:
    ```bash
    cd wearspace-app/backend
    ```
2.  **Buat Virtual Environment Python**:
    ```bash
    python3 -m venv venv
    ```
3.  **Aktifkan Virtual Environment**:
    * **Windows**:
        ```bash
        venv\Scripts\activate
        ```
    * **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```
4.  **Install Dependensi Python**:
    ```bash
    pip install -e ".[testing]"
    ```
5.  **Konfigurasi Database**:
    * Buka `wearspace_app-backend/development.ini`.
    * Sesuaikan baris `sqlalchemy.url` dengan konfigurasi database PostgreSQL Anda (misalnya, `postgresql://myuser:mypassword@localhost:5432/mydb`).
6.  **Inisialisasi dan Migrasi Database dengan Alembic**:
    * Pastikan Anda berada di direktori `wearspace-app/backend`.
    * Buat migrasi awal (jika belum ada):
        ```bash
        alembic -c development.ini revision --autogenerate -m "init"
        ```
    * Lakukan migrasi untuk membuat tabel:
        ```bash
        alembic -c development.ini upgrade head
        ```
    * Jika Anda telah memodifikasi model dengan `ondelete='CASCADE'` dan `cascade='all, delete-orphan'`, Anda perlu membuat migrasi baru untuk perubahan tersebut:
        ```bash
        alembic -c development.ini revision --autogenerate -m "Add cascade delete to product relationships"
        alembic -c development.ini upgrade head
        ```
7.  **Isi Data Awal (Opsional)**:
    ```bash
    initialize_wearspace_app_db development.ini
    ```
8.  **Jalankan Server Backend**:
    ```bash
    pserve development.ini
    ```
    Server backend akan berjalan di `http://localhost:6543`.

### Setup Frontend

1.  **Navigasi ke Direktori Frontend**:
    ```bash
    cd frontend
    ```
2.  **Install Dependensi Node.js**:
    ```bash
    npm install
    # atau jika menggunakan yarn: yarn install
    ```
3.  **Jalankan Aplikasi Frontend**:
    ```bash
    npm run dev
    # atau jika menggunakan yarn: yarn dev
    ```
    Aplikasi frontend akan terbuka di browser Anda, biasanya di `http://localhost:5173`.

## Copyright

© 2025 RIFNITA CAHYANI (NIM: 122140031)
