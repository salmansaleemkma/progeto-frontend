<template>
  <div class="profile-card">
    <div v-if="loggedIn()">
      <h1>My Orders</h1>
      <div class="order-card" v-for="order in orders">
        <p>Order ID: <strong>{{order.order_id}}</strong></p>
        <p>Order Date: <Strong>{{order.order_placed}}</Strong></p>
        <p>Payment Mode: <strong>{{order.payment_mode}}</strong></p>
        <p>Discount: <strong>{{order.discount}}</strong></p>
        <p>Total: <strong>{{formatter(order.total)}}</strong></p>
        <nuxt-link style="margin: 10px; float: right;" :to="{name: 'my-orders-order_id', params: { order_id: order.order_id } }">
          <h4>View Order</h4>
        </nuxt-link>
        <p>Status: <span style="font-weight: bold; color: green;">{{order.status}}</span></p>
      </div>
    </div>
    <div v-else>
      <p>No Orders to show</p>
    </div>
  </div>
</template>
<script>
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  })
  export default {
    async asyncData({
      store
    }) {
      await store.dispatch('order/get')
      return {
        orders: store.state.order.orders
      }
    },
    computed: {
      user() {
        return this.$store.state.user.user
      }
    },
    methods: {
      loggedIn() {
        return this.$store.state.user.loggedIn
      },
      formatter(amount) {
        return formatter.format(amount)
      }
    }

  }
</script>
<style>
  .order-card {
    box-shadow: 0px 1px 1px grey;
    padding: 15px 20px;
    margin: 10px;
    min-width: 180px;
  }
</style>
