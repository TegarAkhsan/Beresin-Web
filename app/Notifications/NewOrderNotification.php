<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class NewOrderNotification extends Notification
{
    use Queueable;

    public function __construct(public $order)
    {
    }

    public function via($notifiable)
    {
        return [WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title('New Order Received!')
            ->icon('/logo-192x192.png')
            ->body('Order #' . $this->order->order_number . ' is waiting for verification.')
            ->action('View Order', route('admin.orders.verify'));
    }
}
