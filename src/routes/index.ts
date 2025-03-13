import type { SvelteComponent } from 'svelte';
import { lazyLoad } from './lazyload';

export interface Route {
  path: string;
  loadComponent: () => { 
    loading: {
      subscribe: (run: (value: boolean) => void) => () => void;
      value: boolean;
    };
    component: {
      subscribe: (run: (value: SvelteComponent | null) => void) => () => void;
      value: SvelteComponent | null;
    };
  };
}

const routes: Route[] = [
  {
    path: '/notifications',
    loadComponent: () => lazyLoad(() => import('./notifications/+page.svelte'))
  },
  {
    path: '/settings',
    loadComponent: () => lazyLoad(() => import('./settings/+page.svelte'))
  },
  {
    path: '/users/[slug]',
    loadComponent: () => lazyLoad(() => import('./users/[slug]/+page.svelte'))
  },
  {
    path: '/home',
    loadComponent: () => lazyLoad(() => import('./home/+page.svelte'))
  },
  {
    path: '/',
    loadComponent: () => lazyLoad(() => import('./+page.svelte'))
  }
];

export default routes;