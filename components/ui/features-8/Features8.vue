<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users } from 'lucide-vue-next'

const graphImage =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
const secureImage =
  'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80'
const teamImage =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
</script>

<template>
  <section class="py-8 sm:py-10">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-6">
      <Card class="relative col-span-full overflow-hidden md:col-span-2">
        <CardContent class="pt-6">
          <div class="relative h-40 overflow-hidden rounded-lg border border-border bg-secondary/20 p-4">
            <img :src="graphImage" alt="Graph dashboard preview" class="h-full w-full rounded-md object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div class="absolute bottom-3 left-3 rounded-md border border-border bg-background/90 px-2 py-1 font-mono text-xs">
              100% customizable
            </div>
          </div>
          <h3 class="mt-4 text-xl font-semibold tracking-tight text-primary">Customizable</h3>
          <p class="mt-2 text-sm leading-relaxed text-textMuted">
            Bring your own JSON shape and navigate the graph in a layout tuned for quick understanding.
          </p>
        </CardContent>
      </Card>

      <Card class="relative col-span-full overflow-hidden md:col-span-2">
        <CardContent class="pt-6">
          <div class="relative h-40 overflow-hidden rounded-lg border border-border bg-secondary/20 p-4">
            <img :src="secureImage" alt="Security lock and code editor" class="h-full w-full rounded-md object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div class="absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-border bg-background/90 px-2 py-1 text-xs">
              <Shield class="size-3.5" />
              Secure by default
            </div>
          </div>
          <h3 class="mt-4 text-xl font-semibold tracking-tight text-primary">Secure by default</h3>
          <p class="mt-2 text-sm leading-relaxed text-textMuted">
            Local-first flow with clear import boundaries so your schema review stays calm and private.
          </p>
        </CardContent>
      </Card>

      <Card class="relative col-span-full overflow-hidden md:col-span-2">
        <CardContent class="pt-6">
          <div class="relative h-40 overflow-hidden rounded-lg border border-border bg-secondary/20 p-4">
            <img :src="teamImage" alt="Product team collaborating" class="h-full w-full rounded-md object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div class="absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-border bg-background/90 px-2 py-1 text-xs">
              <Users class="size-3.5" />
              Team-ready context
            </div>
          </div>
          <h3 class="mt-4 text-xl font-semibold tracking-tight text-primary">Built for collaboration</h3>
          <p class="mt-2 text-sm leading-relaxed text-textMuted">
            Share one visual language across product, backend, and design when discussing structures.
          </p>
        </CardContent>
      </Card>

      <Card class="col-span-full overflow-hidden md:col-span-3">
        <CardContent class="pt-6">
          <div class="flex h-full flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div class="mb-3 inline-flex rounded-md border border-border bg-secondary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted">
                Motion details
              </div>
              <h3 class="text-lg font-semibold tracking-tight text-primary">Fast, visual, and purposeful</h3>
              <p class="mt-2 max-w-lg text-sm leading-relaxed text-textMuted">
                Every card supports the same calm hierarchy used across the landing page: clear title,
                one message, one action signal.
              </p>
            </div>
            <div class="rounded-md border border-border bg-secondary/40 px-3 py-2 font-mono text-xs text-muted">
              300ms transitions · reduced motion aware
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="col-span-full overflow-hidden md:col-span-3">
        <CardContent class="pt-6">
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-md border border-border bg-secondary/30 p-3">
              <p class="font-mono text-[10px] uppercase tracking-wider text-muted">Input</p>
              <p class="mt-1 text-sm font-medium text-primary">PocketBase schema</p>
            </div>
            <div class="rounded-md border border-border bg-secondary/30 p-3">
              <p class="font-mono text-[10px] uppercase tracking-wider text-muted">Output</p>
              <p class="mt-1 text-sm font-medium text-primary">Navigable graph</p>
            </div>
            <div class="rounded-md border border-border bg-secondary/30 p-3">
              <p class="font-mono text-[10px] uppercase tracking-wider text-muted">Format</p>
              <p class="mt-1 text-sm font-medium text-primary">Type-safe Vue components</p>
            </div>
            <div class="rounded-md border border-border bg-secondary/30 p-3">
              <p class="font-mono text-[10px] uppercase tracking-wider text-muted">Stack</p>
              <p class="mt-1 text-sm font-medium text-primary">Nuxt + shadcn-vue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
