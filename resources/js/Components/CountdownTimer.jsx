import { useState, useEffect } from 'react';

export default function CountdownTimer({ deadline }) {
    const calculateTimeLeft = () => {
        const difference = +new Date(deadline) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
            };
        } else {
            timeLeft = { expired: true };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000);
        return () => clearTimeout(timer);
    });

    if (timeLeft.expired) return <span className="text-red-500 font-bold text-xs uppercase">Expired</span>;

    return (
        <span className="font-mono text-xl font-bold text-blue-600">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
        </span>
    );
}
