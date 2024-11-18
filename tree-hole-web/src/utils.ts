
export const timeFromNow = (d: Date | string) => {
    if (typeof d === 'string') {
        d = new Date(d);
    }
    const longBeen = Date.now() - d.getTime();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    if (longBeen > year) {
        return Math.floor(longBeen / year) + '年';
    }
    if (longBeen > month) {
        return Math.floor(longBeen / month) + '月';
    }
    if (longBeen > week) {
        return Math.floor(longBeen / week) + '周';
    }
    if (longBeen > day) {
        return Math.floor(longBeen / day) + '天';
    }
    if (longBeen > hour) {
        return Math.floor(longBeen / hour) + '小时';
    }
    if (longBeen > minute) {
        return Math.floor(longBeen / minute) + '分钟';
    }
}

type DebounceFunc<T extends any[]> = (...args: T) => void;

export function debounce<T extends any[]>(func: DebounceFunc<T>, wait: number): DebounceFunc<T> {
    let timeoutId: number | null = null;

    return function(...args: T): void {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, wait);
    };
}
