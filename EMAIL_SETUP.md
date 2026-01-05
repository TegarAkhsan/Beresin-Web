# Panduan Konfigurasi Email & Troubleshooting

## 1. Mengapa "We can't find a user with that email address"?
Pesan ini muncul karena **email `tegarrigger@gmail.com` belum terdaftar di database aplikasi lokal Anda**.

Meskipun itu adalah email asli, aplikasi ini (`Beresin`) memiliki database sendiri. Agar fitur "Lupa Password" berfungsi:
1.  Anda harus **Register** dulu menggunakan email tersebut di menu Register.
2.  Setelah terdaftar di database, barulah sistem bisa mengirimkan link reset ke email tersebut.

> **Catatan:** Saya sudah mengubah pesan errornya menjadi Bahasa Indonesia: *"Kami tidak dapat menemukan pengguna dengan alamat email tersebut."* agar lebih mudah dipahami.

---

## 2. Cara Setting Email di `.env` (Untuk Publish/Production)

Agar aplikasi bisa mengirim email sungguhan, atur konfigurasi SMTP di file `.env`.

### Opsi A: Menggunakan Gmail (Gratis)
Anda harus membuat **App Password** (bukan password login biasa).

1.  Login ke Akun Google -> Manage Google Account.
2.  Ke menu **Security** -> **2-Step Verification** (On).
3.  Cari **App Passwords**.
4.  Buat App Password baru (pilih "Mail" -> "Other" -> namai "Web").
5.  Copy password 16 digit.
6.  Update file `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tegarrigger@gmail.com
MAIL_PASSWORD=paste_password_16_digit_disini
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="no-reply@beresin.com"
MAIL_FROM_NAME="${APP_NAME}"
```
**Penting:** Setelah edit `.env`, restart server (`Ctrl+C` lalu `php artisan serve` lagi).

### Opsi B: Testing Tanpa Kirim Email (Driver Log)
Jika belum mau setting SMTP, gunakan driver `log`.

File `.env`:
```env
MAIL_MAILER=log
```

Link reset password akan muncul di file:
`storage/logs/laravel.log` (Scroll ke paling bawah).
