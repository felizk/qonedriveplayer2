import { inject, InjectionKey } from '@vue/composition-api';

export function injectStrict<T>(key: InjectionKey<T>, fallback?: T) {
    const resolved = inject(key, fallback);
    if (!resolved) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Could not resolve ${key}`);
    }
  
    return resolved;
  }