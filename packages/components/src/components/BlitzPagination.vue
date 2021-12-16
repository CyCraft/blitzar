<template>
  <ul class="blitz-pagination">
    <li :class="['_page-item', disabledPrevious && 'disabled']">
      <a
        class="_page-link"
        href="#"
        :tabindex="disabledPrevious ? '-1' : null"
        :aria-disabled="disabledPrevious ? 'true' : null"
        @click.prevent="
          () => setPage(modelValue !== 1 && pageCount !== 0 ? modelValue - 1 : modelValue)
        "
      >
        <Pepicon type="pop" name="arrow-left" />
      </a>
    </li>
    <template v-for="(item, index) in pagesShown" :key="index">
      <li
        :class="['_page-item', item === modelValue && 'active', item === morePages && 'disabled']"
      >
        <a
          v-if="item !== morePages"
          class="_page-link"
          href="#"
          @click.prevent="() => setPage(item)"
        >
          {{ item }}
        </a>
        <span v-else class="_page-link">
          {{ item }}
        </span>
      </li>
    </template>
    <li :class="['_page-item', disabledNext && 'disabled']">
      <a
        class="_page-link"
        href="#"
        :tabindex="disabledNext ? '-1' : null"
        :aria-disabled="disabledNext ? 'true' : null"
        @click.prevent="
          () => setPage(modelValue !== pageCount && pageCount !== 0 ? modelValue + 1 : modelValue)
        "
      >
        <Pepicon type="pop" name="arrow-right" />
      </a>
    </li>
  </ul>
</template>

<style scoped>
.blitz-pagination,
.blitz-pagination * {
  box-sizing: border-box;
}

.blitz-pagination {
  --c-primary: #0b3d92;
  --c-primary-dark: #0c306c;
  --c-primary-super-light: #0b3d921b;
  --c-border: #dfe2e5;
  display: flex;
  padding-left: 0;
  list-style: none;
  border-radius: 0.25rem;
}

._page-link {
  position: relative;
  display: block;
  padding: 0.5rem 0.75rem;
  margin-left: -1px;
  line-height: 1.5;
  color: var(--c-primary);
  background-color: #fff;
  border: 1px solid var(--c-border);
}
._page-link:hover {
  z-index: 2;
  text-decoration: none;
  background-color: var(--c-primary-super-light);
}
._page-link:focus {
  z-index: 3;
  outline: 0;
  box-shadow: 0 0 0 0.2rem var(--primary-dark);
}
._page-item:first-child ._page-link {
  margin-left: 0;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}
._page-item:last-child ._page-link {
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}
._page-item.active ._page-link {
  z-index: 3;
  color: #fff;
  background-color: var(--c-primary);
  border-color: var(--c-primary);
}
._page-item.disabled ._page-link {
  pointer-events: none;
  cursor: auto;
  background-color: #fff;
  border-color: #dee2e6;
}
._page-item.disabled ._page-link > * {
  opacity: 0.3;
}
</style>

<script>
import { computed } from 'vue'
import { Pepicon } from 'vue-pepicons'

export default {
  name: 'BlitzPagination',
  components: { Pepicon },
  props: {
    modelValue: { type: Number, required: true },
    pageCount: { type: Number, required: true },
    pagesShown: { type: Array, required: true },
  },
  setup(props, { emit }) {
    const morePages = '...'

    const disabledPrevious = computed(() => props.modelValue === 1)
    const disabledNext = computed(
      () => props.modelValue === props.pageCount || props.pageCount === 0
    )

    function setPage(val) {
      emit('update:modelValue', val)
    }

    return {
      setPage,
      morePages,
      disabledPrevious,
      disabledNext,
    }
  },
}
</script>
