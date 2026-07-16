export default function timeAgo(date: string) {
    const now = new Date();
    const past = new Date(date);

    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
        const value = Math.floor(seconds / interval.seconds);

        if (value >= 1) {
            return `${value} ${interval.label}${value > 1 ? "s" : ""} ago`;
        }
    }

    return "just now";
}