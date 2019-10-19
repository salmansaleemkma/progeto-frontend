<template>
  <div>
    <div v-if="paymentStatus == 'success'" class="successfullOrder">
      <h1 style="color: #006900;">Order Placed :)</h1>
      <p>Thank you for placing the order.</p>
      <h4>Your Order Number is {{orderId}}</h4>
      <nuxt-link :to="/my-orders/ + orderId"><button>View Order</button></nuxt-link> or <nuxt-link to="/"><button>Continue Shopping</button></nuxt-link>
    </div>
    <div v-else>
      <h1 style="color: #ad0000;"> order could not be placed:(</h1>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    async asyncData({
      store,
      params
    }) {
      return {
        orderId: params.order_id,
        paymentStatus: params.payment_status
      }
    }
  }
</script>
<style media="screen">
  .successfullOrder {
    text-align: center;
    padding: 65px;
  }
</style>
