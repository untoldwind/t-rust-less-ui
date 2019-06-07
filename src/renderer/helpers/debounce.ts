
export function debounce<F extends Function>(func: F, wait: number): F {
  let timeoutId: number | undefined;

  return function(this: any, ...args: any[]) {
    const context = this;

    if (timeoutId) window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      timeoutId = undefined;
      func.apply(context, args);
    }, wait);
  } as any as F;
}