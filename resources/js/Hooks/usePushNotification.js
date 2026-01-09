import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function usePushNotification() {
    const { vapid_public_key } = usePage().props;
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if already subscribed
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.getSubscription().then((subscription) => {
                    setIsSubscribed(!!subscription);
                });
            });
        }
    }, []);

    const subscribeToPush = async () => {
        if (!vapid_public_key) {
            console.error('VAPID Public Key not found.');
            alert('Push notification configuration is missing (VAPID Key). Please contact admin.');
            return;
        }

        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapid_public_key),
            });

            // Send subscription to backend
            await axios.post(route('push.subscribe'), subscription);

            setIsSubscribed(true);
            console.log('Push Subscription successful');
        } catch (error) {
            console.error('Failed to subscribe to push', error);
            alert(`Failed to enable notifications: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return { isSubscribed, subscribeToPush, loading };
}
