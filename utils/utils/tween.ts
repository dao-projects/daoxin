/**
 * Linear 线性
 * @param t 当前时间
 * @param b 开始值
 * @param c 总距离
 * @param d 总时间
 * @returns {number}
 */
export const linear = (t: number, b: number, c: number, d: number): number =>
  (c * t) / d + b;

/**
 * Quad  二次方缓动
 * @param t 当前时间
 * @param b 初始值
 * @param c 变化量
 * @param d 持续时间
 * @returns {number}
 */
export const quad = {
  easeIn: (t: number, b: number, c: number, d: number): number =>
    c * (t /= d) * t + b,
  easeOut: (t: number, b: number, c: number, d: number): number =>
    -c * (t /= d) * (t - 2) + b,
  easeInOut: (t: number, b: number, c: number, d: number): number => {
    if ((t /= d / 2) < 1) {
      return (c / 2) * t * t + b;
    }
    return (-c / 2) * (--t * (t - 2) - 1) + b;
  },
} as any;

/**
 * Cubic  三次方缓动
 * @param t 当前时间
 * @param b 初始值
 * @param c 变化量
 * @param d 持续时间
 * @returns {number}
 */
export const cubic = {
  easeIn: (t: number, b: number, c: number, d: number): number =>
    c * (t /= d) * t * t + b,
  easeOut: (t: number, b: number, c: number, d: number): number =>
    c * ((t = t / d - 1) * t * t + 1) + b,
  easeInOut: (t: number, b: number, c: number, d: number): number => {
    if ((t /= d / 2) < 1) {
      return (c / 2) * t * t * t + b;
    }
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  },
} as any;

/**
 * Quart  四次方缓动
 * @param t 当前时间
 * @param b 初始值
 * @param c 变化量
 * @param d 持续时间
 * @returns {number}
 */
export const quart = {
  easeIn: (t: number, b: number, c: number, d: number): number =>
    c * (t /= d) * t * t * t + b,
  easeOut: (t: number, b: number, c: number, d: number): number =>
    -c * ((t = t / d - 1) * t * t * t - 1) + b,
  easeInOut: (t: number, b: number, c: number, d: number): number => {
    if ((t /= d / 2) < 1) {
      return (c / 2) * t * t * t * t + b;
    }
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
  },
} as any;

/**
 * Quint  五次方缓动
 * @param t 当前时间
 * @param b 初始值
 * @param c 变化量
 * @param d 持续时间
 * @returns {number}
 */
export const quint = {
  easeIn: (t: number, b: number, c: number, d: number): number =>
    c * (t /= d) * t * t * t * t + b,
  easeOut: (t: number, b: number, c: number, d: number): number =>
    c * ((t = t / d - 1) * t * t * t * t + 1) + b,
  easeInOut: (t: number, b: number, c: number, d: number): number => {
    if ((t /= d / 2) < 1) {
      return (c / 2) * t * t * t * t * t + b;
    }
    return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
  },
} as any;

/**
 * Sine  正弦曲线缓动
 * @param t 当前时间
 * @param b 初始值
 * @param c 变化量
 * @param d 持续时间
 */
export const sine = {
  easeIn: (t: number, b: number, c: number, d: number): number =>
    -c * Math.cos((t / d) * (Math.PI / 2)) + c + b,
  easeOut: (t: number, b: number, c: number, d: number): number =>
    c * Math.sin((t / d) * (Math.PI / 2)) + b,
  easeInOut: (t: number, b: number, c: number, d: number): number =>
    (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b,
} as any;

/**
 * Expo  指数曲线缓动
 * @param t 当前时间
 * @param b 初始值
 * @param c 变化量
 * @param d 持续时间
 * @returns {number}
 */
export const expo = {
  easeIn: (t: number, b: number, c: number, d: number): number =>
    t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b,
  easeOut: (t: number, b: number, c: number, d: number): number =>
    t === d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b,
  easeInOut: (t: number, b: number, c: number, d: number): number => {
    if (t === 0) {
      return b;
    }
    if (t === d) {
      return b + c;
    }
    if ((t /= d / 2) < 1) {
      return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
    }
    return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
  },
} as any;

/**
 * Circ  圆形曲线缓动
 * @param t 当前时间
 * @param b 初始值
 * @param c 变化量
 * @param d 持续时间
 * @returns {number}
 */
export const circ = {
  easeIn: (t: number, b: number, c: number, d: number): number =>
    -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b,
  easeOut: (t: number, b: number, c: number, d: number): number =>
    c * Math.sqrt(1 - (t = t / d - 1) * t) + b,
  easeInOut: (t: number, b: number, c: number, d: number): number => {
    if ((t /= d / 2) < 1) {
      return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
    }
    return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
} as any;

/**
 * Elastic  指数衰减的正弦曲线缓动
 * @param t 当前时间
 * @param b 初始值
 * @param c 变化量
 * @param d 持续时间
 * @returns {number}
 */
export const elastic = {
  easeIn: (
    t: number,
    b: number,
    c: number,
    d: number,
    a: number = 0,
    p: number = 0
  ): number => {
    let s;
    if (t === 0) {
      return b;
    }
    if ((t /= d) === 1) {
      return b + c;
    }
    if (!p) {
      p = d * 0.3;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(c / a);
    }
    return (
      -(
        a *
        Math.pow(2, 10 * (t -= 1)) *
        Math.sin(((t * d - s) * (2 * Math.PI)) / p)
      ) + b
    );
  },
  easeOut: (
    t: number,
    b: number,
    c: number,
    d: number,
    a: number = 0,
    p: number = 0
  ): number => {
    let s;
    if (t === 0) {
      return b;
    }
    if ((t /= d) === 1) {
      return b + c;
    }
    if (!p) {
      p = d * 0.3;
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(c / a);
    }
    return (
      a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
      c +
      b
    );
  },
  easeInOut: (
    t: number,
    b: number,
    c: number,
    d: number,
    a: number = 0,
    p: number = 0
  ): number => {
    let s;
    if (t === 0) {
      return b;
    }
    if ((t /= d / 2) === 2) {
      return b + c;
    }
    if (!p) {
      p = d * (0.3 * 1.5);
    }
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(c / a);
    }
    if (t < 1) {
      return (
        -0.5 *
          (a *
            Math.pow(2, 10 * (t -= 1)) *
            Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
        b
      );
    }
    return (
      a *
        Math.pow(2, -10 * (t -= 1)) *
        Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
        0.5 +
      c +
      b
    );
  },
} as any;

/**
 * Back  超过范围的三次方缓动
 * @param t 当前时间
 * @param b 初始值
 * @param c 变化量
 * @param d 持续时间
 * @param s 步长
 * @returns {number}
 */
export const back = {
  easeIn: (
    t: number,
    b: number,
    c: number,
    d: number,
    s: number = 1.70158
  ): number => c * (t /= d) * t * ((s + 1) * t - s) + b,
  easeOut: (
    t: number,
    b: number,
    c: number,
    d: number,
    s: number = 1.70158
  ): number => c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b,
  easeInOut: (
    t: number,
    b: number,
    c: number,
    d: number,
    s: number = 1.70158
  ): number => {
    if ((t /= d / 2) < 1) {
      return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
    }
    return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
  },
} as any;

/**
 * Bounce  指数衰减的反弹缓动
 * @param t 当前时间
 * @param b 初始值
 * @param c 变化量
 * @param d 持续时间
 * @returns {number}
 */
export const bounce = {
  easeIn: (t: number, b: number, c: number, d: number): number => {
    return c - bounce.easeOut(d - t, 0, c, d) + b;
  },
  easeOut: (t: number, b: number, c: number, d: number): number => {
    if ((t /= d) < 1 / 2.75) {
      return c * (7.5625 * t * t) + b;
    } else if (t < 2 / 2.75) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
    } else if (t < 2.5 / 2.75) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
    } else {
      return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
    }
  },
  easeInOut: (t: number, b: number, c: number, d: number): number => {
    if (t < d / 2) {
      return bounce.easeIn(t * 2, 0, c, d) * 0.5 + b;
    } else {
      return bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
  },
} as any;
