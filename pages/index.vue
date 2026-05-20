<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const prefersReducedMotion = usePrefersReducedMotion()
</script>

<template>
  <div>
    <LandingHero :reduced-motion="prefersReducedMotion" />
    <LandingBento :reduced-motion="prefersReducedMotion" />
    <LandingFooter :reduced-motion="prefersReducedMotion" />
  </div>
</template>
