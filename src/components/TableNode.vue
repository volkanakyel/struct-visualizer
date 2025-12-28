<template>
  <div class="table-node min-w-[240px] shadow-lg bg-secondary border border-primary">
    <div
      class="table-node-header px-4 py-3 flex items-center justify-between bg-primary border-b border-accent"
    >
      <div class="font-semibold text-lg text-text">{{ data.name }}</div>
      <GripVertical class="text-accent w-4 h-4 cursor-move" />
    </div>
    <div class="divide-y divide-primary">
      <div
        v-for="(column, index) in data.columns"
        :key="index"
        class="table-node-column px-4 py-3 flex items-center justify-between relative"
      >
        <span class="text-sm font-mono text-text">
          {{ column.name }}
          <span
            v-if="column.isPrimaryKey"
            class="text-yellow ml-1"
            >*</span
          >
        </span>
        <div class="flex items-center gap-2">
          <span :class="`text-sm font-mono ${getTypeColor(column.type)}`">
            <template v-if="column.type === 'relation'">
              <span class="flex items-center">
                <span class="mr-1">{{ column.type }}</span>
                <span class="text-accent">({{ column.relatedCollection }})</span>
              </span>
            </template>
            <template v-else>
              {{ column.type }}
            </template>
          </span>
        </div>
        <Handle
          v-if="column.type === 'relation'"
          type="source"
          :id="`${column.name}-right`"
          :position="Position.Right"
          class="handle !absolute w-2 h-2 bg-purple"
          :style="{ right: '-5px' }"
        />
      </div>
    </div>
    <Handle
      type="target"
      :id="`${data.name}-left`"
      :position="Position.Left"
      class="handle !absolute w-2 h-2 bg-accent"
      :style="{ top: '50%', left: '-5px' }"
    />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { GripVertical } from 'lucide-vue-next'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const getTypeColor = (type) => {
  switch (type.toLowerCase()) {
    case 'int':
    case 'number':
      return 'text-yellow'
    case 'varchar':
    case 'text':
      return 'text-orange'
    case 'datetime':
    case 'date':
      return 'text-green'
    case 'autodate':
      return 'text-red'
    case 'json':
      return 'text-blue'
    case 'relation':
      return 'text-purple'
    case 'url':
      return 'text-green'
    default:
      return 'text-accent'
  }
}
</script>
