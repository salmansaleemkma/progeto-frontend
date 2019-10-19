<template>
  <div>
    <div v-if="paymentStatus == 'Credit'" class="successfullOrder">
      <h1 style="color: #006900;">Payment Succesful.</h1>
      <p>Thank you for placing the order. Your payment trasaction id is <strong>{{paymentId}}</strong></p>
      <h4>Your Order Number is {{currentOrder.order_id}}</h4>
      <nuxt-link :to="/my-orders/ + currentOrder.order_id"><button>View Order</button></nuxt-link> or <nuxt-link to="/"><button>Continue Shopping</button></nuxt-link>
    </div>
    <div v-else>
      <h1 style="color: #ad0000;">Payment Failed :(</h1>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    async asyncData({
      store,
      route
    }) {
      return {
        paymentId: route.query.payment_id,
        paymentStatus: route.query.payment_status,
        paymentRequestId: route.query.payment_request_id
      }
    },
    async mounted() {
      const data = {
        "payment_id": this.paymentId,
        "payment_status": this.paymentStatus,
        "payment_request_id": this.paymentRequestId
      }
      await this.$axios({
        method: 'POST',
        url: '/user/order/update',
        data: data
      }).then(response => {
        this.$axios.get('/user/order/payment_request_id/' + this.paymentRequestId).then(response => {
          this.currentOrder = response.data.order
        })
      })
    },
    data() {
      return {
        currentOrder: ''
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
