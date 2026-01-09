<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class TaskAssignedNotification extends Notification
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
            ->title('New Task Assigned!')
            ->icon('/logo-192x192.png')
            ->body('You have been assigned Order #' . $this->order->order_number)
            ->action('View Tasks', route('joki.dashboard')); // Or specific task URL
    }
}
