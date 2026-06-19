import { useEffect, useState } from "react";

// Returns a version of `value` that only updates after `delayMs`
// has passed without `value` changing again. Used to avoid firing
// an API call on every single keystroke in the search box.
export function useDebouncedValue(value, delayMs = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}