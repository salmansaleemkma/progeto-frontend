<template id="">
  <div class="list-container">
    <div class="product-card-list span-col-4" v-for="product in products">
      <nuxt-link :to="{name: 'category-category-id', params: { category: product.category, id: product.code } }">

        <img :src="productImageLink(product)" style="width:100%; max-height: 280px;" alt="">
        <p :title="product.name">{{product.name | truncate}}</p>
        <p>
          <strong>{{formatter(product.price)}}</strong>
          <span style="font-size: 14px; text-decoration: line-through; color: grey;">{{formatter(product.mrp)}}</span>
          <span style="float: right; font-size: 16px; font-weight: bold; color:#320ec5;" v-if="product.discount_percentage"> {{product.discount_percentage}}% off</span>
        </p>
      </nuxt-link>
    </div>
  </div>
</template>
<script type="text/javascript">
  import _ from 'lodash';
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  })
  export default {
    props: ['products'],
    methods: {
      formatter(amount) {
        return formatter.format(amount)
      },
      categoryImageLink(category, size = '250') {
        let link = 'https://via.placeholder.com/' + size + '/000000/FFFFFF?text=' + category
        return link
      },
      productImageLink(product) {
        let link = this.$axios.defaults.baseURL + 'products/images/' + product.code + '/' + product.images[0].image_name
        return link
      }
    },
    filters: {
      truncate(str, len = 25) {
        _.trim(str);
        return _.truncate(str, {
          'length': len
        });
      }
    }
  }
</script>
<style media="screen">
  .list-container {
    text-align: center;
  }

  .product-card-list {
    display: inline-block;
    max-height: auto;
    max-width: 256px;
    box-shadow: 0px 1px 1px grey;
    padding: 5px;
    margin: 8px 3px;
    min-width: 180px;
  }
</style>