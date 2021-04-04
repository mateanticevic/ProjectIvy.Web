export function number(number) {
    if (number < 1000) {
        return {
            exponent: '',
            number: (number * 100) % 100 == 0 ? number : number.toFixed(2),
        };
    } else if (number < 10000) {
        return {
            exponent: 'k',
            number: (number / 1000).toFixed(1),
        };
    } else if (number < 1000000) {
        return {
            exponent: 'k',
            number: Math.round(number / 1000),
        };
    } else {
        return {
            exponent: 'M',
            number: (number / 1000000).toFixed(1),
        };
    }
}

export function time(seconds) {
    if (seconds >= 3600) {
        const hours = Math.floor(seconds / 3600);
        const secondsLeft = seconds % 3600;

        return secondsLeft > 0 ? `${hours}h ${time(secondsLeft)}` : `${hours}h`;
    } else if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        const secondsLeft = seconds % 60;

        return secondsLeft > 0 ? `${minutes}m ${time(secondsLeft)}` : `${minutes}m`;
    }

    return `${seconds}s`;
}
