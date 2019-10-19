export const state = () => ({
  searchResults: []
})

export const mutations = {
  set_searchResults(state, products){
    state.searchResults = products.products
  }
}

export const actions = {
  async searchQuery({
    commit
  }, searchQuery) {
    const searchResults = await this.$axios('/products/search/'+searchQuery)
    commit('set_searchResults', searchResults.data)
  }
}
