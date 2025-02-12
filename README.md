# Laravel API with Testing and Seeding

## 📌 Overview
This project is a Laravel API with:
- **PostgreSQL** as the database
- **Laravel Eloquent** for ORM
- **Database seeding** for initial data
- **PestPHP** for testing

---

## 📂 Project Structure
```
laravel-api/
│── app/
│   ├── Models/User.php       # User model
│
│── database/
│   ├── migrations/           # Database migrations
│   ├── seeders/UserSeeder.php # Seeder file
│
│── routes/
│   ├── api.php               # API routes
│
│── tests/
│   ├── Feature/UserTest.php  # API tests
│
│── .env                      # Environment variables
│── package.json              # Dependencies
│── README.md                 # Documentation
```

---

## 🚀 Getting Started

### **1️⃣ Install Dependencies**
```sh
composer install
```

### **2️⃣ Configure Database**
Edit `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=laravel_api
DB_USERNAME=your_username
DB_PASSWORD=your_password
```
Run migrations:
```sh
php artisan migrate
```

### **3️⃣ Seed the Database**
```sh
php artisan db:seed --class=UserSeeder
```

### **4️⃣ Start the Server**
```sh
php artisan serve
```
Server runs at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🧪 Testing
Run tests with:
```sh
php artisan test
```

---

## 🔍 API Endpoints
### **GET /api/users**
Fetches all users.
```sh
curl http://127.0.0.1:8000/api/users
```

---

## 📊 Technologies Used
- **Laravel** - PHP framework
- **PostgreSQL** - Database
- **PestPHP** - Testing framework
- **Eloquent** - ORM for database management

---

## 🎯 Future Enhancements
- Add authentication
- Implement more API endpoints
- Deploy to production

---

**🚀 Happy Coding!**

