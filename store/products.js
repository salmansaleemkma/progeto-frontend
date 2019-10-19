import _ from 'lodash';

export const state = () => ({
  products: []
})

export const getters = {
  getById: state => (product_code) => {
    return state.products.find(product => product.code == product_code)
  }
}

export const mutations = {
  set(state, products) {
    state.products = products.products
  }
}

export const actions = {
  async get({commit}){
    const products = await this.$axios({
      url: '/products/'
    })
    commit('set', products.data)
  }
}
