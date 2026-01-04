<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'services' => App\Models\Service::with('packages')->get(),
        'whatsapp_number' => App\Models\Setting::where('key', 'whatsapp_number')->value('value'),
        'footer_settings' => App\Models\Setting::whereIn('key', ['instagram_url', 'email_contact', 'footer_description', 'whatsapp_number'])->pluck('value', 'key'),
    ]);
})->name('home');

Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [App\Http\Controllers\Admin\AdminController::class, 'index'])->name('dashboard');
    Route::resource('users', App\Http\Controllers\Admin\UserController::class);

    // Order Management
    Route::get('/orders/verify', [App\Http\Controllers\Admin\AdminOrderController::class, 'verify'])->name('orders.verify');
    Route::post('/orders/{order}/approve', [App\Http\Controllers\Admin\AdminOrderController::class, 'approvePayment'])->name('orders.approve');

    Route::post('/orders/assign/batch', [App\Http\Controllers\Admin\AdminOrderController::class, 'batchAutoAssign'])->name('orders.batch_auto_assign');
    Route::get('/orders/assign', [App\Http\Controllers\Admin\AdminOrderController::class, 'assign'])->name('orders.assign');
    Route::post('/orders/{order}/assign', [App\Http\Controllers\Admin\AdminOrderController::class, 'storeAssignment'])->name('orders.store_assignment');

    // Service Management
    Route::resource('services', App\Http\Controllers\Admin\AdminServiceController::class);

    // Package Management (Nested & Direct)
    Route::post('/services/{service}/packages', [App\Http\Controllers\Admin\AdminPackageController::class, 'store'])->name('services.packages.store');
    Route::put('/packages/{package}', [App\Http\Controllers\Admin\AdminPackageController::class, 'update'])->name('packages.update');
    Route::delete('/packages/{package}', [App\Http\Controllers\Admin\AdminPackageController::class, 'destroy'])->name('packages.destroy');

    // Transaction Report
    Route::get('/transactions', [App\Http\Controllers\Admin\AdminTransactionController::class, 'index'])->name('transactions.index');

    // Settings
    Route::get('/settings', [App\Http\Controllers\Admin\AdminSettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [App\Http\Controllers\Admin\AdminSettingController::class, 'update'])->name('settings.update');

    // Admin Chat
    Route::get('/chat', [App\Http\Controllers\ChatController::class, 'adminIndex'])->name('chat.index');
    Route::get('/chat/{user}', [App\Http\Controllers\ChatController::class, 'adminShow'])->name('chat.show');
    Route::post('/chat/{user}', [App\Http\Controllers\ChatController::class, 'adminStore'])->name('chat.reply');
});

Route::middleware('auth')->group(function () {
    Route::get('/orders/create', [App\Http\Controllers\OrderController::class, 'create'])->name('orders.create');
    Route::post('/orders', [App\Http\Controllers\OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [App\Http\Controllers\OrderController::class, 'show'])->name('orders.show');
    Route::get('/orders/{order}/review', [App\Http\Controllers\OrderController::class, 'review'])->name('orders.review');
    Route::get('/orders/{order}/invoice', [App\Http\Controllers\OrderController::class, 'downloadInvoice'])->name('orders.invoice');
    Route::post('/orders/{order}/cancel', [App\Http\Controllers\OrderController::class, 'cancel'])->name('orders.cancel');
    Route::post('/orders/{order}', [App\Http\Controllers\OrderController::class, 'update'])->name('orders.update');
    Route::post('/orders/{order}/accept', [App\Http\Controllers\OrderController::class, 'acceptResult'])->name('orders.accept');
    Route::post('/orders/{order}/revision', [App\Http\Controllers\OrderController::class, 'requestRevision'])->name('orders.revision');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Joki Task Actions
    Route::post('/joki/orders/{order}/start', [App\Http\Controllers\JokiDashboardController::class, 'startTask'])->name('joki.orders.start');
    Route::post('/joki/orders/{order}/upload', [App\Http\Controllers\JokiDashboardController::class, 'uploadResult'])->name('joki.orders.upload');
    Route::post('/joki/orders/{order}/link', [App\Http\Controllers\JokiDashboardController::class, 'updateLink'])->name('joki.orders.link');

    // Chat Routes (Customer)
    Route::get('/chat/messages', [App\Http\Controllers\ChatController::class, 'index'])->name('chat.index');
    Route::post('/chat/send', [App\Http\Controllers\ChatController::class, 'store'])->name('chat.store');
});

require __DIR__ . '/auth.php';
