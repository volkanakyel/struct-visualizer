<template>
  <div class="min-h-screen bg-background text-text font-sans antialiased">
    <header class="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div
        class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
      >
        <NuxtLink
          to="/"
          class="group flex items-center gap-2 font-semibold tracking-tight text-primary transition-colors hover:text-primary/90"
        >
          <img
            src="/logo.svg"
            alt="Struct Visualizer logo"
            class="h-5 w-5 object-contain"
          />
          <span>Struct Visualizer</span>
        </NuxtLink>
        <nav
          class="flex items-center gap-1 sm:gap-2"
          aria-label="Primary"
        >
          <NuxtLink
            to="/details"
            class="rounded-md px-3 py-2 text-xs font-medium text-textMuted transition-colors hover:bg-secondary hover:text-primary sm:text-sm"
            active-class="bg-secondary text-primary"
          >
            Details
          </NuxtLink>
          <NuxtLink
            to="/visualizer"
            class="btn-dither rounded-sm px-3 py-2 text-[10px] font-medium uppercase tracking-wide sm:px-4 sm:text-xs"
          >
            Open app
          </NuxtLink>
        </nav>
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
