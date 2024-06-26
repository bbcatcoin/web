import {
  __commonJS,
  __toESM,
  require_react
} from "./chunk-2FATVHAI.js";

// node_modules/debounce/index.js
var require_debounce = __commonJS({
  "node_modules/debounce/index.js"(exports, module) {
    function debounce(func, wait, immediate) {
      var timeout, args, context, timestamp, result;
      if (null == wait)
        wait = 100;
      function later() {
        var last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            context = args = null;
          }
        }
      }
      ;
      var debounced = function() {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout)
          timeout = setTimeout(later, wait);
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }
        return result;
      };
      debounced.clear = function() {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      };
      debounced.flush = function() {
        if (timeout) {
          result = func.apply(context, args);
          context = args = null;
          clearTimeout(timeout);
          timeout = null;
        }
      };
      return debounced;
    }
    debounce.debounce = debounce;
    module.exports = debounce;
  }
});

// node_modules/react-use-measure/dist/web.js
var import_react = __toESM(require_react());
var import_debounce = __toESM(require_debounce());
function useMeasure(_temp) {
  let {
    debounce,
    scroll,
    polyfill,
    offsetSize
  } = _temp === void 0 ? {
    debounce: 0,
    scroll: false,
    offsetSize: false
  } : _temp;
  const ResizeObserver = polyfill || (typeof window === "undefined" ? class ResizeObserver {
  } : window.ResizeObserver);
  if (!ResizeObserver) {
    throw new Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");
  }
  const [bounds, set] = (0, import_react.useState)({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0
  });
  const state = (0, import_react.useRef)({
    element: null,
    scrollContainers: null,
    resizeObserver: null,
    lastBounds: bounds
  });
  const scrollDebounce = debounce ? typeof debounce === "number" ? debounce : debounce.scroll : null;
  const resizeDebounce = debounce ? typeof debounce === "number" ? debounce : debounce.resize : null;
  const mounted = (0, import_react.useRef)(false);
  (0, import_react.useEffect)(() => {
    mounted.current = true;
    return () => void (mounted.current = false);
  });
  const [forceRefresh, resizeChange, scrollChange] = (0, import_react.useMemo)(() => {
    const callback = () => {
      if (!state.current.element)
        return;
      const {
        left,
        top,
        width,
        height,
        bottom,
        right,
        x,
        y
      } = state.current.element.getBoundingClientRect();
      const size = {
        left,
        top,
        width,
        height,
        bottom,
        right,
        x,
        y
      };
      if (state.current.element instanceof HTMLElement && offsetSize) {
        size.height = state.current.element.offsetHeight;
        size.width = state.current.element.offsetWidth;
      }
      Object.freeze(size);
      if (mounted.current && !areBoundsEqual(state.current.lastBounds, size))
        set(state.current.lastBounds = size);
    };
    return [callback, resizeDebounce ? (0, import_debounce.default)(callback, resizeDebounce) : callback, scrollDebounce ? (0, import_debounce.default)(callback, scrollDebounce) : callback];
  }, [set, offsetSize, scrollDebounce, resizeDebounce]);
  function removeListeners() {
    if (state.current.scrollContainers) {
      state.current.scrollContainers.forEach((element) => element.removeEventListener("scroll", scrollChange, true));
      state.current.scrollContainers = null;
    }
    if (state.current.resizeObserver) {
      state.current.resizeObserver.disconnect();
      state.current.resizeObserver = null;
    }
  }
  function addListeners() {
    if (!state.current.element)
      return;
    state.current.resizeObserver = new ResizeObserver(scrollChange);
    state.current.resizeObserver.observe(state.current.element);
    if (scroll && state.current.scrollContainers) {
      state.current.scrollContainers.forEach((scrollContainer) => scrollContainer.addEventListener("scroll", scrollChange, {
        capture: true,
        passive: true
      }));
    }
  }
  const ref = (node) => {
    if (!node || node === state.current.element)
      return;
    removeListeners();
    state.current.element = node;
    state.current.scrollContainers = findScrollContainers(node);
    addListeners();
  };
  useOnWindowScroll(scrollChange, Boolean(scroll));
  useOnWindowResize(resizeChange);
  (0, import_react.useEffect)(() => {
    removeListeners();
    addListeners();
  }, [scroll, scrollChange, resizeChange]);
  (0, import_react.useEffect)(() => removeListeners, []);
  return [ref, bounds, forceRefresh];
}
function useOnWindowResize(onWindowResize) {
  (0, import_react.useEffect)(() => {
    const cb = onWindowResize;
    window.addEventListener("resize", cb);
    return () => void window.removeEventListener("resize", cb);
  }, [onWindowResize]);
}
function useOnWindowScroll(onScroll, enabled) {
  (0, import_react.useEffect)(() => {
    if (enabled) {
      const cb = onScroll;
      window.addEventListener("scroll", cb, {
        capture: true,
        passive: true
      });
      return () => void window.removeEventListener("scroll", cb, true);
    }
  }, [onScroll, enabled]);
}
function findScrollContainers(element) {
  const result = [];
  if (!element || element === document.body)
    return result;
  const {
    overflow,
    overflowX,
    overflowY
  } = window.getComputedStyle(element);
  if ([overflow, overflowX, overflowY].some((prop) => prop === "auto" || prop === "scroll"))
    result.push(element);
  return [...result, ...findScrollContainers(element.parentElement)];
}
var keys = ["x", "y", "top", "bottom", "left", "right", "width", "height"];
var areBoundsEqual = (a, b) => keys.every((key) => a[key] === b[key]);
export {
  useMeasure as default
};
//# sourceMappingURL=react-use-measure.js.map
