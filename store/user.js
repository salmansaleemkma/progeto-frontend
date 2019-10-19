export const state = () => ({
  user: {
    cart: []
  },
  token: '',
  loggedIn: false
})

export const mutations = {
  getUser(state, data){
    state.user = data.user
  },
  setAuth(state, data) {
    state.token = data.token
    state.loggedIn = true
    this.$axios.setToken('Basic ' + Buffer.from(state.token + ':').toString('base64'))
  },
  setUser(state, data) {
    state.user = data.user
    state.loggedIn = true
  },
  removeAuth(state) {
    state.token = ''
    state.username = ''
    state.loggedIn = false
    this.$axios.setToken(false)
  },
  updateCart(state, cart) {
    state.user.cart = cart
  },
  removeFromCart(state, product) {
    var index = state.user.cart.findIndex(product => product.code == product.code)
    state.user.cart.splice(index, 1)
    if (state.loggedIn) {
      this.$axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        url: '/user/cart/remove',
        data: product
      }).then(response => {
        console.log(response.data)
      }, error => {
        console.log(error)
      })
    }
  }
}

export const actions = {
  async get({commit}){
    await this.$axios('user/profile').then(response =>{
      commit('getUser', response.data)
    })
  },
  async addAuthToken({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      this.$axios.setToken('Basic ' + btoa(data.token + ':'))
      this.$axios({
        url: '/user/profile'
      }).then(response => {
        if (response.status == 200) {
          commit('setUser', response.data)
        }
        resolve(response);
      }, error => {
        commit('removeAuth')
        reject(error);
      })
    })
    commit('setAuth', data)
  },
  logoutUser({
    commit
  }) {
    commit('removeAuth')
  },
  checkUsername({
    commit
  }, username) {
    return new Promise((resolve, reject) => {
      this.$axios("/user/" + username).then(response => {
        resolve(response);
      }, error => {
        reject(error);
      })
    })

  },
  async updateCart({
    commit
  }, newProduct) {
    await this.$axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: '/user/cart',
      data: {
        product: newProduct
      }
    }).then(response => {
      commit('updateCart', response.data.cart)
    })
  },
  removeFromCart({
    commit
  }, product) {
    commit('removeFromCart', product)
  }
}
