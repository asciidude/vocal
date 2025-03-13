import { writable, type Writable } from 'svelte/store';
import type { ComponentType } from 'svelte';

export function lazyLoad<T extends ComponentType>(
  importFn: () => Promise<{ default: T }>
) {
  const loading = writable(true);
  const component = writable<T | null>(null);
  
  importFn()
    .then(module => {
      component.set(module.default);
      loading.set(false);
    })
    .catch(error => {
      console.error('Failed to load component:', error);
      loading.set(false);
    });
  
  return { 
    loading: {
      subscribe: loading.subscribe,
      get value() { 
        let value: boolean;
        const unsubscribe = loading.subscribe(v => value = v);
        unsubscribe();
        return value!;
      }
    },
    component: {
      subscribe: component.subscribe,
      get value() {
        let value: T | null;
        const unsubscribe = component.subscribe(v => value = v);
        unsubscribe();
        return value;
      }
    }
  };
}