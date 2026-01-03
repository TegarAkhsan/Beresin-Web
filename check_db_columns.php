<?php

use Illuminate\Support\Facades\Schema;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$columns = Schema::getColumnListing('orders');
echo "Columns in 'orders' table:\n";
print_r($columns);

if (in_array('invoice_number', $columns)) {
    echo "\nSUCCESS: 'invoice_number' column exists.\n";
} else {
    echo "\nFAILURE: 'invoice_number' column DOES NOT exist.\n";
}
