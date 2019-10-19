<template>
  <div class="">
    <div class="order-details" v-if="order">
      <h1>Order: {{order.order_id}}</h1>
      <p>Delivery Address: {{order.delivery_address}}</p>
      <p>Discount: {{order.discount}}</p>
      <p>Payment Mode: {{order.payment_mode}}</p>
      <div class="order-product" v-for="product in order.products">
        <img :src="productImage(product)" width=200px alt="">
        <h3>{{product.name}}</h3>
        <p>{{product.description}}</p>
        <p>{{product.quantity}}</p>
        <p>{{product.category}}</p>
        <p>{{product.code}}</p>
        <p>condition:{{product.condition}}</p>
        <p>price: {{product.price}}</p>
        <h2>Specifications</h2>
        <p>{{product.specifications.accessories}}</p>
        <p>{{product.specifications.brand}}</p>
        <p>{{product.specifications.capacity}}</p>
        <p>{{product.specifications.dimensions}}</p>
        <p>{{product.specifications.model}}</p>
        <p>{{product.specifications.sub_category}}</p>
        <p>{{product.warranty}}</p>
        <p>Warranty Expiry date: {{product.warranty_expiry}}</p>
        <p>warranty claims: {{product.warranty_claims}}</p>
      </div>
      <p>Order Status: {{order.status}}</p>
      <p>Tax: {{order.tax}}</p>
      <p>Total: {{order.total}}</p>
    </div>
    <div class="" v-else>
      <h1>Invalid Order ID</h1>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    async asyncData({
      params
    }) {
      return {
        order_id: params.order_id
      }
    },
    mounted() {
      this.$store.dispatch('order/getOrder', this.order_id).then(response => {
        this.order = response.data.order
      }, error => {
        console.log(error)
      })
    },
    methods: {
      productImage(product) {
        const link = this.$axios.defaults.baseURL + 'products/images/' + product.code + '/' + product.images[0].image_name
        return link
      }
    },
    data() {
      return {
        order: ''
      }
    }
  }
</script>
<style>
  .order-details {
    margin: 30px 40px;
  }

  .order-product {
    padding: 20px;
    border: 1px solid;
    border-radius: 25px;
  }
</style>
