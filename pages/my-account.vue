<template>
  <div class="profile-card">
    <div v-if="loggedIn()">
      <h1>My Profile</h1>
      <p>Name: <strong>{{ user.name }}</strong></p>
      <p>Mobile Number: <strong>{{user.contact_number}}</strong></p>
      <p>Email ID: <strong>{{user.email}}</strong></p>
      <p>Shipping Addresses: <strong>{{user.shipping_address}}</strong></p>
      <p>Billing Address: <strong>{{user.billing_address}}</strong></p>
    </div>
    <div v-else>
      You are not logged in. Please sign in to view your account details.
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      user() {
        return this.$store.state.user.user
      }
    },
    methods: {
      loggedIn() {
        return this.$store.state.user.loggedIn
      }
    }
  }
</script>
<style>
  .profile-card {
    margin: 30px 20px;
  }

  .profile-card h1,
  p {
    padding: 10px 5px;
  }
</style>
