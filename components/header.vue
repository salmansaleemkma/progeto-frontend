<template>
  <div class="header">
    <div class="header-topbar">
      <no-ssr>
        <notifications group="authentication" position="top center"></notifications>
      </no-ssr>
    </div>
    <div class="header-center">
      <div class="logo-section">

        <a href="/">
          <h1><img style="vertical-align: middle;" src="~/static/progeto-logo.png" alt=""> Progeto</h1>
        </a>
      </div>
      <div class="search-bar-section">
        <form v-on:submit.prevent="searchQueryHandler">
          <input type="text" class="search-bar" name="query" v-model="query" value="" placeholder="Search">
          <button type="submit" @click="searchQueryHandler">Search</button>
        </form>
      </div>
      <div class="user-options-section">
        <nuxt-link to="/cart"><button type="button" name="cart">Cart <i class="fa fa-shopping-cart"></i></button></nuxt-link>
        <button class="dropdown" type="button" name="sign-out-button" v-if="this.loggedIn">
          {{ FullName || 'Account' }} <svg width="12px" height="12px" viewBox="0 0 18 18" fill="#000000" aria-hidden="true" focusable="false">
            <polygon points="12,16.41 5.29,9.71 6.71,8.29 12,13.59 17.29,8.29 18.71,9.71"></polygon>
            <path fill="none" d="M0,0h24v24H0V0z"></path>
          </svg>
          <div class="dropdown-menu">
            <nuxt-link to="/my-account">My Account</nuxt-link>
            <nuxt-link to="/my-orders">Orders</nuxt-link>
            <a href="#" @click="logoutUser()">Logout</a>
          </div>
        </button>
        <button type="button" name="sign-in-button" v-else @click="openLoginModel()">Sign In</button>
      </div>
    </div>
    <div class="menu-bar">
      <div class="menu-list-section">
        <ul class="menu">
          <li v-for="category in this.categories"><a :href="categoryLink(category) | lowercase | hyphenate">{{category}}</a></li>
        </ul>
        <div class="responsive-menu">
          <select v-model="selectedCategory" @change="routeCategoryPage($event)">
            <option value="">Categories</option>
            <option v-for="category in this.categories" :value="category">{{category}}</option>
          </select>
        </div>
      </div>
      <div class="menu-extras-section">
        <!-- <button type="button" class="best-deals-button" name="button">Best Deals</button> -->
      </div>
    </div>
    <div class="modal" :style="{display: displayModal}" @click="closeLoginUser($event)">
      <div id="modal-content">
        <span class="close" @click="closeLoginUser($event)">&times;</span>
        <form :style="{display: displayForm1}" id="signin-form-1" v-on:submit.prevent="checkUserExists()">
          <h1>Login</h1>
          <label>Email Adress (username)</label><br>
          <input type="text" v-model="username" placeholder="email address"><br>
          <button type="submit" name="login-next-button" @click="checkUserExists()">Next</button>
        </form>
        <form :style="{display: displayForm2}" id="signin-form-2" v-on:submit.prevent="loginUser()">
          <h1>Login</h1>
          <label>Password for {{username}}</label><br>
          <input type="password" v-model="password" placeholder="password"><br>
          <a style="cursor: pointer;" @click="forgotPassword()">forgot password?</a>
          <button class="right-align" type="submit" name="login-button" @click="loginUser()">Login</button>
        </form>

        <form :style="{display: displaySignUpForm}" id="signup-form" v-on:submit.prevent="closeSignUpForm()">
          <h1>Create an Account</h1>
          <div style="text-align: right;">
            <label>Full Name</label>
            <input type="text" v-model="name" placeholder="Enter your full name" required><br>
            <label>Email ID*</label>
            <input type="email" v-model="email" placeholder="email id" required><br>
            <label>Password*</label>
            <input type="password" :style="{borderColor: displayPasswordMatch}" v-model="password" placeholder="password" @change="passwordMatch" required><br>
            <label>Confirm Password</label>
            <input type="password" :style="{borderColor: displayPasswordMatch}" v-model="password2" placeholder="password" @change="passwordMatch" required><br>
            <button type="submit" name="sign-up-button" @click="signUpUser()" class="sign-up-button" :disabled="displayPasswordMatch == 'red'">Sign Up</button>
            <p style="margin: 5px;">Or <a style="cursor: pointer; " @click="closeSignUpForm">click here</a> to login</p>
          </div>
        </form>
        <div :style="{display: displaySignUpButton}" class="sign-up">
          <hr>
          <h3>Sign Up</h3>
          <button type="button" name="button" @click="signUpForm()">Create an account</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import {
    mapState
  } from 'vuex'
  export default {
    computed: {
      loggedIn() {
        return this.$store.state.user.loggedIn
      },
      FullName() {
        return this.$store.state.user.user.name.split(' ').slice(0, 1).join(' ');
      },
    },
    watch: {
      cartLength() {
        return this.cart.length
      }
    },
    mounted() {
      if (localStorage.token) {
        let data = {
          token: localStorage.token
        }
        this.$store.dispatch('user/addAuthToken', data).then(response => {
          if (response.status == 200) {
            localStorage.cart = JSON.stringify(this.$store.state.user.user.cart)
            this.cart = JSON.parse(localStorage.cart)
            console.log('authenticated')
          } else {
            localStorage.clear()
          }
        }, error => {
          localStorage.clear()
          console.log(error)
        })
      }
    },
    methods: {
      categoryLink(category) {
        let link = "/category/" + category
        return link
      },
      searchQueryHandler() {
        if (this.query != '') {
          this.$router.push({
            path: `/search/${this.query}`
          })
        }
      },
      openLoginModel() {
        this.displayModal = 'block'
      },
      closeLoginUser(event) {
        if (event.target.classList == 'modal' || event.target.classList == 'close') {
          this.displayModal = 'none'
        }
      },
      checkUserExists() {
        if (this.username != '') {
          this.$store.dispatch('user/checkUsername', this.username).then(response => {
            this.displayForm1 = 'none'
            this.displayForm2 = 'block'
            if (response.status == 200) {
              console.log(response.data.success + ' ' + response.status)
            }
          }, error => {
            this.$notify({
              group: 'authentication',
              title: 'Invalid Email address'
            });
            console.log('user does not exist')
          })
        }
      },
      signUpForm() {
        this.displayForm1 = 'none'
        this.displayForm2 = 'none'
        this.displaySignUpForm = 'block'
        this.displaySignUpButton = 'none'
      },
      closeSignUpForm() {
        this.displaySignUpForm = 'none'
        this.displayForm1 = 'block'
        this.displaySignUpButton = 'block'
      },
      forgotPassword() {
        this.$axios('/user/account/password/reset/' + this.username).then(response => {
          this.displayModal = 'none'
          this.message = 'A password reset link has been sent to your email.'
          this.displayMessage = 'block'
          console.log(response)
        }, error => {
          console.error();
        })
      },
      signUpUser() {
        if (this.password != '' && this.email != '') {
          const body = {
            name: this.name,
            email: this.email,
            password: this.password
          }
          this.$root.$loading.start();
          const loginUser = this.$axios({
            method: 'POST',
            url: '/user/account/register',
            headers: {
              'Content-Type': 'application/json'
            },
            data: body
          }).then(response => {
            if (response.status == 201) {
              this.$notify({
                group: 'authentication',
                title: 'Sign Up Successful. Please check your email inbox for confirmation e-mail.'
              });
            }
          }, error => {

            this.$notify({
              group: 'authentication',
              title: 'An account with this Email Address already exists'
            });
          })
          this.$root.$loading.finish();
        }
      },
      async loginUser() {
        if (this.password != '') {
          const body = {
            username: this.username,
            password: this.password
          }
          this.$root.$loading.start();
          const loginUser = await this.$axios({
            method: 'POST',
            url: '/user/account/login',
            headers: {
              'Content-Type': 'application/json'
            },
            data: body
          }).then(response => {
            if (response.status == 200) {
              let data = { ...response.data,
                ...{
                  username: body.username
                }
              }
              this.$store.dispatch('user/addAuthToken', data).then(() => {
                localStorage.token = data.token
                localStorage.user = data.username
                this.displayModal = 'none'
              })
              if (localStorage.cart) {
                var cart = JSON.parse(localStorage.cart)
                for (var item in cart) {
                  this.$store.dispatch('user/updateCart', cart[item])
                }
              }
              localStorage.cart = JSON.stringify(this.$store.state.user.user.cart)
              this.cart = JSON.parse(localStorage.cart)
            }
            this.$notify({
              group: 'authentication',
              title: 'Login Successful'
            });
            this.$router.push('/')
          }, error => {
            this.$notify({
              group: 'authentication',
              title: 'Invalid Password'
            });
          })
          this.$root.$loading.finish();
        }
      },
      logoutUser() {
        this.$store.dispatch('user/logoutUser')
        localStorage.clear()
        this.$notify({
          group: 'authentication',
          title: 'You are logged out'
        });
        this.$router.push('/')
      },
      passwordMatch() {
        if (this.password == this.password2) {
          this.displayPasswordMatch = 'green'
        } else {
          this.displayPasswordMatch = 'red'
        }
      },
      routeCategoryPage(event) {
        if (this.selectedCategory != "") {
          location.replace(this.categoryLink(this.selectedCategory))
        }
      }
    },
    filters: {
      lowercase(str) {
        return _.toLower(str);
      },
      hyphenate(str) {
        return str.replace(/\s+/g, '-')
      }
    },
    data() {
      return {
        categories: this.$store.state.categories.categories,
        username: '',
        email: '',
        name: '',
        password: '',
        password2: '',
        query: "",
        displayPasswordMatch: 'black',
        displayModal: 'none',
        displayForm1: 'block',
        displayForm2: 'none',
        displaySignUpButton: 'block',
        displaySignUpForm: 'none',
        displayMessage: 'none',
        message: '',
        cart: [],
        selectedCategory: ''
      }
    }

  }
</script>

<style>
  .header {
    background-color: #fff;
  }

  .header-topbar {
    padding-left: 40px;
    padding-right: 40px;
    height: 40px;
    background-color: #554694;
    color: #FFFFFF;

    text-align: right;
  }

  .header-topbar p {
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: bold;
  }

  .header-center {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-areas: "logo search-bar user-options";
    padding: 15px;
    padding-left: 40px;
    padding-right: 40px;
  }

  .menu li {
    list-style-type: none;
    display: inline;
  }

  .menu-bar {
    background-color: #554694;
    padding: 15px;
  }

  .menu-bar ul li {
    color: #FFFFFF;
    font-weight: bold;
    padding-left: 10px;
    padding-right: 10px;
  }

  .responsive-menu {
    display: none;
  }

  .search-bar-section {
    grid-area: search-bar;
    align-self: center;
  }

  .user-options-section {
    grid-area: user-options;
    align-self: center;
  }

  .search-bar {
    height: 30px;
    vertical-align: middle;
    border-radius: 25px;
    border: 2px solid;
    width: 60%;
    padding: 5px;
  }

  .search-bar:focus {
    outline: none;
    border: 2px solid #6045d0;
  }

  .menu-extras-section {
    text-align: center;
  }

  .menu-list-section {
    padding: 10px 0px;
    align-self: center;
  }

  .logo-section {
    max-width: 350px;
    grid-area: logo;
  }

  .logo-section a {
    text-decoration: none;
    color: black;
  }

  .menu-list-section a {
    text-decoration: none;
    color: white;
  }

  .menu-list-section a:hover {
    color: #c5adc1;
  }

  a {
    color: black;
    text-decoration: none;
  }

  a:hover {
    color: #6045d0;
  }

  .modal {
    position: fixed;
    /* Stay in place */
    z-index: 1;
    /* Sit on top */
    padding-top: 100px;
    /* Location of the box */
    left: 0;
    top: 0;
    width: 100%;
    /* Full width */
    height: 100%;
    /* Full height */
    overflow: auto;
    /* Enable scroll if needed */
    background-color: rgb(0, 0, 0);
    /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4);
    /* Black w/ opacity */
  }

  #modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    max-width: 500px;
    height: auto;
    text-align: center;

  }

  .modal-content-form {
    width: 350px;
    padding: 20px;
    margin-left: auto;
    margin-right: auto;
  }

  .modal-content-form form {
    padding: 10px;
  }

  hr {
    margin: 10px;
  }

  input {
    height: 18px;
    margin: 10px;
    vertical-align: middle;
    border-radius: 25px;
    border: 2px solid;
    width: 60%;
    padding: 5px;
  }

  .close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }

  .best-deals-button {
    color: white;
  }

  .best-deals-button:hover {
    color: #c5adc1;
  }

  .dropdown:hover .dropdown-menu {
    display: block;
  }

  li.dropdown {
    display: inline-block;
  }

  .dropdown-menu {
    align-self: auto;
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 130px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .dropdown-menu a {
    color: black;
    padding: 8px 10px;
    text-decoration: none;
    display: block;
    text-align: center;
  }

  #sign-up-form {
    text-align: left;
  }

  .sign-up-button {
    margin: 5px;
  }

  .sign-up-button:disabled {
    color: grey;
    border-color: grey;
  }

  @media only screen and (max-width: 414px) {
    .header-center {
      grid-template-columns: 60% 40%;
      grid-template-areas: "logo user-options""search-bar search-bar";
      padding: 15px;
    }

    ul.menu {
      display: none;
    }

    .responsive-menu {
      display: block;
      width: 100%;
    }

    .responsive-menu option {
      padding: 100px;
    }
  }

  @media only screen and (max-width: 375px) {
    .header-center {
      grid-template-columns: 50% 50%;
      grid-template-areas: "logo user-options""search-bar search-bar";
      padding: 10px;
    }

    .logo-section {
      padding: 8px 0px;
    }

    .logo-section img {
      width: 60px;
    }

    .logo-section h1 {
      font-size: 24px;
    }

  }
</style>
