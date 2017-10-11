export function number(number) {
    if (number < 1000){
        return {
            exponent: '',
            number: number
        };
    }
    else if (number < 10000) {
        return {
            exponent: 'k',
            number: (number/1000).toFixed(1)
        };
    }
    else {
        return {
            exponent: 'k',
            number: Math.round(number/1000)
        };
    }
}