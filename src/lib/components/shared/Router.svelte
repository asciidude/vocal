<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { writable, derived } from 'svelte/store';
    import routes from '../../../index';
    import LoadingSpinner from './LoadingSpinner.svelte';
    
    const currentPath = writable(window.location.pathname);
    
    function handleLocationChange() {
      currentPath.set(window.location.pathname);
    }

    function matchPath(pattern: string, path: string): { match: boolean, params: Record<string, string> } {
      const params: Record<string, string> = {};
      
      const regexPattern = pattern
        .replace(/\//g, '\\/') // Escape slashes
        .replace(/\[(\w+)\]/g, (_, paramName) => { // Convert [param] to named capture groups
          return `(?<${paramName}>[^/]+)`;
        );
      
      const regex = new RegExp(`^${regexPattern}$`);
      const match = path.match(regex);
      
      if (match && match.groups) {
        return {
          match: true,
          params: match.groups
        };
      }
      
      return { match: false, params: {} };
    }
    
    const currentRoute = derived(currentPath, $currentPath => {
      for (const route of routes) {
        const { match, params } = matchPath(route.path, $currentPath);
        if (match) {
          return { ...route, params };
        }
      }
      return null;
    });
    
    const routeData = derived(currentRoute, ($currentRoute, set) => {
      if (!$currentRoute) return { loading: false, component: null, params: {} };
      
      const { loadComponent, params } = $currentRoute;
      const { loading, component } = loadComponent();
      
      const unsubLoading = loading.subscribe(isLoading => {
        set({ loading: isLoading, component: component.value, params });
      });
      
      const unsubComponent = component.subscribe(comp => {
        set({ loading: loading.value, component: comp, params });
      });
      
      return () => {
        unsubLoading();
        unsubComponent();
      };
    }, { loading: true, component: null, params: {} });
    
    export function navigate(path: string) {
      window.history.pushState(null, '', path);
      currentPath.set(path);
    }
    
    onMount(() => {
      window.addEventListener('popstate', handleLocationChange);
    });
    
    onDestroy(() => {
      window.removeEventListener('popstate', handleLocationChange);
    });
</script>
  
{#if !$currentRoute}
    <div class="flex justify-center items-center h-screen bg-vocal_darkest text-white">
      <div class="text-center">
        <h1 class="text-2xl mb-4">404</h1>
        <p>Page not found</p>
        <button 
          class="mt-4 px-4 py-2 bg-vocal_medium text-white rounded" 
          on:click={() => navigate('/')}
        >
          Go Home
        </button>
      </div>
    </div>
  {:else if $routeData.loading}
    <LoadingSpinner />
  {:else if $routeData.component}
    <svelte:component this={$routeData.component} {...$routeData.params} />
{/if}