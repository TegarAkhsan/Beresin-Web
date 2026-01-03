# Beresin - Digital Service Platform 🚀

**Beresin** is a modern, comprehensive digital service marketplace connecting customers with professional freelancers ("Jokis") for various digital tasks such as Web Development, UI/UX Design, and Mobile App Development. Built with performance and user experience in mind, it features a seamless order flow, automated task assignment, and dedicated dashboards for all user roles.

![Beresin Hero](https://via.placeholder.com/1200x600.png?text=Beresin+Platform+Preview)

## 🛠 Tech Stack

**Backend**
- **Framework**: Laravel 11.x
- **Database**: MySQL 8.0
- **Auth**: Laravel Breeze
- **ORM**: Eloquent

**Frontend**
- **Framework**: React.js 18 (via Inertia.js)
- **Styling**: Tailwind CSS 3.4
- **Build Tool**: Vite
- **Icons**: Heroicons, Lucide React

**Tools & Services**
- **Payment**: Xendit / Midtrans (Simulation)
- **PDF Generation**: Barryvdh DomPDF

---

## ✨ Features

### 👤 Customer (Client)
- **Modern Landing Page**: Glassmorphism UI with interactive elements.
- **Service Catalog**: Browse services (Web, Mobile, UI/UX) with detailed packages.
- **Seamless Ordering**: Split-form order process (Bio -> File Upload -> Payment).
- **Payment Gateway**: Integration for VA and QRIS payments.
- **Dashboard**: Track order status, download invoices, and view history.

### 💼 Joki (Freelancer)
- **Dedicated Dashboard**: View active workload and performance stats.
- **Task Management**: Accept tasks, start timers, and manage deadlines.
- **Submission System**: Upload results or provide external links directly.
- **Workload Limits**: System prevents burnout by capping active tasks (Max 5).
- **Specialization**: Specialized roles (Web Dev, Designer, etc.) for targeted assignments.

### 🛡 Admin (Administrator)
- **Custom Admin Panel**: efficient management without heavy dependencies.
- **User Management**: Create/Edit users, manage roles, and specializations.
- **Order Verification**: Review and approve payments manually if needed.
- **Advanced Assignment System**:
  - **Manual Assign**: Select specific Joki with custom fees.
  - **Auto Assign**: Algorithmically selects the least busy Joki.
  - **Batch Auto Assign**: Automatically distributes all pending orders based on specialization.
- **Reporting**: Transaction reports with date filters and PDF export.

---

## 🚀 Installation Guide

Follow these steps to set up the project locally.

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/beresin-web.git
cd beresin-web
```

### 2. Install Dependencies
**Backend**
```bash
composer install
```

**Frontend**
```bash
npm install
```

### 3. Environment Configuration
Copy the `.env.example` file and configure your database settings.
```bash
cp .env.example .env
```

Open `.env` and update your DB credentials:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=beresin_db
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Generate Key & Migrate
```bash
php artisan key:generate
php artisan migrate --seed
```
*The `--seed` flag populates the database with default services, packages, and admin accounts.*

### 5. Run the Application
You need two terminal instances running:

**Terminal 1 (Laravel Server)**
```bash
php artisan serve
```

**Terminal 2 (Vite Dev Server)**
```bash
npm run dev
```

Visit `http://127.0.0.1:8000` in your browser.

---

## 🔑 Default Accounts (Seeder)

Use these accounts to test different roles:

**Administrator**
- Email: `admin@beresin.com`
- Password: `password`

**Joki (Freelancer)**
- Email: `joki@beresin.com`
- Password: `password`

**Customer**
- Email: `customer@beresin.com`
- Password: `password`

---

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
