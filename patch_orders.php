<?php

use App\Models\Order;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Find orders that have an invoice number (meaning they were approved) but payment_status is 'pending'
$orders = Order::whereNotNull('invoice_number')->where('payment_status', 'pending')->get();

echo "Found " . $orders->count() . " orders to patch.\n";

foreach ($orders as $order) {
    $order->payment_status = 'paid';
    $order->save();
    echo "Fixed Order ID: {$order->id}\n";
}
