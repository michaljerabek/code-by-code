/* Insert Easing Sequence
 * 
 * Description:
 * Inserts a sequence of numbers between 0 and 1 for each 
 * selection / cursor interpolated by selected easing function.
 * 
 * Usage:
 * Have more then 2 (more like 10) cursors and execute.
 * It can be used for example for smoother gradients:
 * background: linear-gradient(
 *     rgba(0, 0, 0, 0.000),
 *     rgba(0, 0, 0, 0.040),
 *     rgba(0, 0, 0, 0.160),
 *     rgba(0, 0, 0, 0.360),
 *     rgba(0, 0, 0, 0.640),
 *     rgba(0, 0, 0, 1.000)
 * );
 */

const functions = {
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    easeInQuint: t => t * t * t * t * t,
    easeOutQuint: t => 1 + (--t) * t * t * t * t,
    easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
    easeInSine: t => -1 * Math.cos(t / 1 * (Math.PI * 0.5)) + 1,
    easeOutSine: t => Math.sin(t / 1 * (Math.PI * 0.5)),
    easeInOutSine: t => -1 / 2 * (Math.cos(Math.PI * t) - 1),
    easeInExpo: t => (t === 0) ? 0 : Math.pow(2, 10 * (t - 1)),
    easeOutExpo: t => (t === 1) ? 1 : (-Math.pow(2, -10 * t) + 1),
    easeInOutExpo: t => {
        if (t === 0 || t === 1) { return t; }
        if ((t /= 1 / 2) < 1) { return 1 / 2 * Math.pow(2, 10 * (t - 1)); }
        return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
    },
    easeInCirc: t => -1 * (Math.sqrt(1 - t * t) - 1),
    easeOutCirc: t => Math.sqrt(1 - (t = t - 1) * t),
    easeInOutCirc: t => {
        if ((t /= 1 / 2) < 1) { return -1 / 2 * (Math.sqrt(1 - t * t) - 1); }
        return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }
};

const input = STORAGE.input ?? await showDialog([
    { type: "select", title: "Select easing function:", name: "fn", values: Object.keys(functions) }, 
    { type: "number", title: "Number of decimal places:", name: "fix", attrs: { min: 1, value: 3 } }
]);
if (!input) return abort();
STORAGE.input = input;

const fn = functions[input.fn];
return fn(INDEX / ((SELECTIONS.length - 1) || 1)).toFixed(input.fix);