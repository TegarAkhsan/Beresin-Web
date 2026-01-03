<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Invoice {{ $order->invoice_number }}</title>
    <style>
        body {
            font-family: sans-serif;
        }

        .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
        }

        .invoice-details {
            margin-bottom: 2rem;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .total {
            font-weight: bold;
            text-align: right;
        }

        .stamp {
            margin-top: 3rem;
            text-align: right;
        }

        .stamp-box {
            border: 2px dashed #000;
            padding: 10px;
            display: inline-block;
            transform: rotate(-5deg);
            font-weight: bold;
            color: green;
        }
    </style>
</head>

<body>
    <div class="invoice-header">
        <div>
            <h1>INVOICE</h1>
            <p><strong>Beresin Jasa Digital</strong><br>
                Jalan Digital No. 1<br>
                Jakarta, Indonesia<br>
                WhatsApp: {{ $whatsapp }}</p>
        </div>
        <div style="text-align: right;">
            <p>No Invoice: {{ $order->invoice_number ?? $order->order_number }}<br>
                Tanggal Order: {{ $order->created_at->format('d M Y') }}<br>
                Status: {{ strtoupper($order->status) }}</p>
        </div>
    </div>

    <div class="invoice-details">
        <h3>Kepada:</h3>
        <p>{{ $order->user->name }}<br>
            {{ $order->user->email }}<br>
            {{ $order->user->phone }}<br>
            {{ $order->user->university }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Layanan</th>
                <th>Paket</th>
                <th>Deskripsi</th>
                <th>Harga</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $order->package->service->name }}</td>
                <td>{{ $order->package->name }}</td>
                <td>{{ $order->description }}</td>
                <td>Rp {{ number_format($order->amount, 0, ',', '.') }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" class="total">Total Tagihan</td>
                <td class="total">Rp {{ number_format($order->amount, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    <div class="stamp">
        @if(in_array($order->status, ['paid', 'in_progress', 'completed']))
            <div class="stamp-box">LUNAS / PAID</div>
        @else
            <div class="stamp-box" style="color: red; border-color: red;">BELUM LUNAS</div>
        @endif
        <p style="margin-top: 20px;">Hormat Kami,<br><br>Admin Beresin</p>
    </div>
</body>

</html>