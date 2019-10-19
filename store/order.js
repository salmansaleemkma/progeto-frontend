export const state = () => ({
  orders: []
})

export const mutations = {
  set(state, orders) {
    state.orders = orders
  }
}

export const actions = {
  async get({
    commit
  }) {
    await this.$axios('/user/order').then(response => {
      commit('set', response.data.orders)
    })
  },
  getOrder({ commit }, order_id) {
    return new Promise((resolve, reject) => {
      this.$axios('/user/order/' + order_id).then(response => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })
  }
}
