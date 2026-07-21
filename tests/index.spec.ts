// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '~/pages/index.vue'

describe('Landing page', () => {
  it('contains the pun tagline', () => {
    const wrapper = mount(IndexPage, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
        directives: {
          reveal: {
            getSSRProps: () => ({}),
            mounted: () => {},
            unmounted: () => {},
          },
          count: {
            getSSRProps: () => ({}),
            mounted: () => {},
            unmounted: () => {},
          },
        },
      },
    })
    expect(wrapper.text()).toContain('This page intentionally left punny')
  })
})
