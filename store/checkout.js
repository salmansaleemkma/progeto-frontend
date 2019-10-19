export const state = () => ({
  payment: {
    orderTotal: '',
    sendEmail: false,
    orderDiscount: '',
    orderTax: '',
    deliveryAddress: '',
    paymentMode: ''
  }
})

export const mutations = {
  set(state, data){
    const keys = Object.keys(data)
    for(var key in keys){
      state.payment[keys[key]] = data[keys[key]]
    }
  }
}

export const actions = {
  update({commit}, data){
    commit('set', data)
  }
}
