<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class NewChatMessageNotification extends Notification
{
    use Queueable;

    public function __construct(public $senderName, public $message)
    {
    }

    public function via($notifiable)
    {
        return [WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title('New Message from ' . $this->senderName)
            ->icon('/logo-192x192.png')
            ->body($this->message)
            ->action('View Chat', route('admin.chat.index')); // Or specific chat URL
    }
}
