export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('products/get')
    await dispatch('sliders/get')
  }
}
