<template>
  <div style="box-shadow: 0px 2px 5px grey;">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <MainHeader></MainHeader>
    <nuxt />
    <MainFooter></MainFooter>
  </div>
</template>

<script>
  import MainHeader from '../components/header.vue';
  import MainFooter from '../components/footer.vue'
  const apiUsername = process.env.API_USERNAME
  const apiPassword = process.env.API_PASSWORD
  export default {
    components: {
      MainHeader,
      MainFooter
    },
    async fetch({
      store
    }) {
      await store.dispatch('products/get')
      await store.dispatch('sliders/get')
    }
  }
</script>
<style>
  * {
    @import url('https://fonts.googleapis.com/css?family=Arimo');
    font-family: 'Arimo', sans-serif;
    margin: 0;
    padding: 0;
    outline: none;
  }

  body {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  button {
    border-radius: 25px;
    border: 2px solid;
    padding: 10px;
    background-color: transparent;
  }
</style>
