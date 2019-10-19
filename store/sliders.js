export const state = () => ({
  slides: []
})

export const mutations = {
  set(state, slides) {
    slides = slides.carousels
    var slide_links = []
    let r = Math.random().toString(36).substring(7);
    for (var i = 0, len = slides.length; i < len; i++) {
      var slide = {
        slide: this.$axios.defaults.baseURL + 'homepage/carousel-images/' + slides[i].file_name + '/?' + r
      }
      slide_links[i] = slide
    }
    state.slides = slide_links
  },
  setNext(state) {
    state.slides[state.slides.length-1] = state.slides.shift()
  },
  setPrevious(state) {
    state.slides.unshift(state.slides.pop())

  }
}

export const actions = {
  async get({
    commit
  }) {
    await this.$axios.get('/homepage/carousel-images')
      .then((res) => {
        commit('set', res.data)
      })
  },
  async next({
    commit
  }) {
    commit('setNext')
  },
  previous({
    commit
  }) {
    commit('setPrevious')
  }
}
