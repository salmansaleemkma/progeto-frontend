<template>
  <div class="product-card">
    <nuxt-link :to="{name: 'category-category-id', params: { category: product.category, id: product.code } }">
      <img :src="productImageLink(product)" width="180px" style="max-height: 165px;"></img>
      <div class="content grid">
        <div class="span-col-12">
          <h4 :title="product.name">{{product.name | truncate }}</h4>
        </div>
        <div class="span-col-12">
          <p style="font-size: 18px; font-weight: bold;">{{formatter(product.price)}} <span style="font-size: 14px; text-decoration: line-through; color: grey;">{{formatter(product.mrp)}}</span></p>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>
<script>
  import _ from 'lodash'
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  })
  export default {
    props: ['product'],
    methods: {
      formatter(amount) {
        return formatter.format(amount)
      },
      productImageLink(product) {
        let link = this.$axios.defaults.baseURL + 'products/images/' + product.code + '/' + product.images[0].image_name
        return link
      }
    },
    filters: {
      truncate(str, len = 21) {
        _.trim(str);
        return _.truncate(str, {
          'length': len
        });
      }
    }
  }
</script>
<style>
  .product-card {
    box-shadow: 0px 1px 1px grey;
    padding: 5px;
    margin: 10px;
    min-width: 180px;
  }
</style>
