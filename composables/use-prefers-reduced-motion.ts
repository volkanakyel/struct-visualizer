import { onUnmounted, ref, type Ref } from 'vue'

/**
 * Tracks `(prefers-reduced-motion: reduce)` for accessible motion toggles.
 */
export function usePrefersReducedMotion(): Ref<boolean> {
  const prefersReducedMotion = ref(false)

  if (!import.meta.client) {
    return prefersReducedMotion
  }

  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const sync = (): void => {
    prefersReducedMotion.value = media.matches
  }
  sync()
  media.addEventListener('change', sync)
  onUnmounted(() => {
    media.removeEventListener('change', sync)
  })

  return prefersReducedMotion
}
