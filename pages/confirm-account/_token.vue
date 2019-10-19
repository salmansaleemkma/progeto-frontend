<template>
  <div>
    <div class="bubble confirmed" v-if="status">
      <p class=""><i class="fa fa-check"></i> Your account has been confirmed.</p>
    </div>
    <div v-else>
      <p class="bubble invalid"><i class="fa fa-times"></i> Invalid confirmation link.</p>
    </div>
  </div>
</template>
<script>
  export default {
    asyncData({
      params,
      $axios
    }) {
      const token = params.token
      var status = false
      $axios('/user/account/confirm/' + token).then(response => {
        if (response.status == 200) {
          var status = true
        }
      }, error => {
        console.error(error)
      })
      return {
        token,
        status
      }
    }
  }
</script>
<style>
  .bubble {
    max-width: 300px;
    color: white;
    text-align: center;
    border-radius: 25px;
    margin: 50px;
    margin-left: auto;
    margin-right: auto;
    padding: 20px;
    font-weight: bold;
  }

  .confirmed {
    border: 1px solid lime;
    background-color: #4ea24e;
  }

  .invalid {
    border: 1px solid red;
    background-color: #e54d42;
  }
</style>
