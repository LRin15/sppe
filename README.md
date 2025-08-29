# 🚀 Laravel + React (Inertia) + Tailwind Starter

Project ini menggunakan **Laravel** sebagai backend, **React (Inertia.js)** untuk frontend, dan **TailwindCSS** untuk styling.

## 📦 Persyaratan

Pastikan sudah terinstall di sistem kamu:

- PHP >= 8.1 https://www.apachefriends.org/index.html
- Composer https://getcomposer.org/
- Node.js & npm (atau Yarn/Pnpm) https://nodejs.org/en/
- MySQL / MariaDB (jika menggunakan database) https://www.apachefriends.org/index.html

Setelah install, pastikan php dikenali di terminal:

Tambahkan path php ke Environment Variables → Path.

## Misalnya C:\xampp\php atau C:\laragon\bin\php\php-8.2.12

## ⚙️ Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/LRin15/desa_cinnong.git
cd nama-proyek
```

### 2. Install Dependency Laravel

```
composer install

```

### 3. Konfigurasi Environment

```
cp .env.example .env

```

ganti bagian .env dibawah

DB_CONNECTION=sqlite

# DB_HOST=127.0.0.1

# DB_PORT=3306

# DB_DATABASE=laravel

# DB_USERNAME=root

# DB_PASSWORD=

Menjadi seperti yang dibawah

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sppe_db
DB_USERNAME=root
DB_PASSWORD=

### 3. Konfigurasi Environment

```
php artisan key:generate

```

### 4. Migrasi Database

```
php artisan migrate

```

### 5. Setup Frontend (React + Tailwind)

```
npm install

npm run dev

```

### 6. Menjalankan Aplikasi

```
php artisan serve

```

🛠️ Catatan

Gunakan npm run dev saat development agar perubahan React/Tailwind langsung terlihat.

Jika deploy ke hosting (shared hosting/cPanel), jalankan npm run build lalu upload hasil build ke server.

👨‍💻 Tech Stack

- Laravel
- Inertia.js
- React
- Tailwind CSS
