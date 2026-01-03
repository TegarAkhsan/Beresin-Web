<?php

use App\Models\Order;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$orders = Order::select('id', 'order_number', 'status', 'payment_status', 'invoice_number')->get();

echo "Total Orders: " . $orders->count() . "\n";
foreach ($orders as $order) {
    echo "ID: {$order->id} | Num: {$order->order_number} | Status: {$order->status} | P_Status: {$order->payment_status} | Inv: {$order->invoice_number}\n";
}
