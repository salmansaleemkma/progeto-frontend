<template>
  <div>
    <h2 style="text-align: center; padding: 20px;">Search result for "{{query}}" </h2>
    <ProductsList :products="searchResults"></ProductsList>
  </div>
</template>
<script>
  import ProductsList from './../../components/products-list.vue'

  export default {
    components: {
      ProductsList
    },
    async asyncData({
      params,
      store
    }) {
      const query = params.search
      await store.dispatch('search/searchQuery', query)
      return {
        query
      }
    },
    data() {
      return {
        searchResults: this.$store.state.search.searchResults
      }
    }
  }
</script>
