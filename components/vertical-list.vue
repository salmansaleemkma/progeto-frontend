<template>
  <div class="vertical-list">
    <div class="vertical-list-container">
      <ProductCard v-for="product in products" :key="product.id" :product="product"></ProductCard>
    </div>
  </div>
</template>

<script>
  import ProductCard from './../components/product-card.vue'

  export default {
    props: ['products'],
    components: {
      ProductCard
    }
  }
</script>

<style>
  .vertical-list {
    display: flex;
  }

  .vertical-list-container {
    display: flex;
    margin: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    min-height: 250px;
    max-width: 100%;
    overflow-x: auto;
  }

  .vertical-list-container::-webkit-scrollbar {
    /* display: none; */
  }
</style>
