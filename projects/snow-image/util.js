function DO_NOTHING() {};

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function myXor(a, b) {
    // TODO: is there a standard implementation
    return (a ? 1 : 0) ^ (b ? 1 : 0);
}

// return a number in [0,max_val]. assumes max is > 0.
function randomInt(max_val) {
    return Math.floor(Math.floor(max_val + 1) * Math.random());
}
