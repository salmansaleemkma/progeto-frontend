<template>
  <div class="grid">
    <div class="reset-password center span-col-12">
      <h1 style="margin:10px;">Reset Password</h1>
      <hr>
      <form>
        <label>New Password</label>
        <input type="password" v-model="password" name="password" value=""> <br>
        <label>Re-enter Password</label>
        <input type="password" v-model="password2" name="password2" value=""> <br>
        <button style="margin:10px;" class="center" type="submit" v-on:click="resetPassword()" name="button">Change Password</button>
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    asyncData({
      params
    }) {
      const token = params.token
      return {
        token
      }
    },
    methods: {
      resetPassword() {
        this.$axios({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          url: '/user/account/password/token',
          data: {
            'token': this.token,
            'password': this.password
          }
        }).then(response => {
          console.log(response.data)
        }, error => {
          console.log(error.status)
        })
      }
    },
    data() {
      return {
        password: '',
        password2: ''
      }
    }
  }
</script>
<style>
  .reset-password {
    margin: 30px;
    text-align: right;
  }

  .reset-password input {
    width: auto;
  }

  .center {
    margin-right: auto;
    margin-left: auto;
  }
</style>
