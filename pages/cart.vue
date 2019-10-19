<template>
  <div class="cart-list-container">
    <div v-if="cartEmpty()" class="container-grid">
      <div class="product-list">
        <h1>Cart</h1>
        <div style="margin-top: 20px;" class="" v-for="product in cart" class="cart-product-grid">
          <img :src="productImageLink(product)" height="120" :alt="productName(product)" style="grid-area: prod-img;">
          <p style="margin-top:5px; grid-area: prod-remove;"><a style="cursor: pointer;" @click="removeFromCart(productGetter(product))">&nbsp;<strong>remove</strong></a></p>
          <h4 style="grid-area: prod-name;">{{productName(product)}}</h4>
          <div style="grid-area: prod-quantity;">
            <input type="text" style="width: 33px; margin:0px;" v-model="product.quantity" value=""></input> X
            {{formatter(productPrice(product))}} <span style="font-size: 14px; text-decoration: line-through; color: grey;">{{formatter(productMrp(product))}}</span>

          </div>
          <div style="grid-area: prod-price;">
            <p v-if="productDiscount(product)" style="margin-top:10px; color: #554694;">{{productDiscount(product)}}% <strong>Discount</strong></p>
            = {{formatter(productTotal(product))}}
          </div>
          <hr style="grid-area: prod-fin;">
        </div>
      </div>
      <div class="total-tap">
        <div class="" style="padding: 15px;">
          <h1>Summary</h1>
          <p class="">Total Price</p>
          <p class=" right-align-text">{{formatter(totalPrice())}}</p>
          <p class="" v-if="totalDiscount()">Total Discount</p>
          <p class=" right-align-text" v-if="totalDiscount()">{{formatter(totalDiscount())}}</p>
          <p class="">Estimated Tax</p>
          <p class=" right-align-text">{{formatter(estimatedTax())}}</p>
          <p class=""><strong>Total</strong></p>
          <p class=" right-align-text">{{formatter(cartTotal())}}</p>
          <button class="checkout-btn" type="button" name="button" :disabled="userLoggedIn() == false" @click="checkoutPage()">Checkout</button>
          <div class="login-note" v-if="!userLoggedIn()">Please login to Checkout.</div>
        </div>
      </div>
    </div>

    <div v-else class="empty-cart">
      <h1>Your shopping cart is empty.</h1>
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
    mounted() {
      if (localStorage.cart) {
        this.cart = JSON.parse(localStorage.cart)
      }

    },
    methods: {
      cartEmpty() {
        if (this.cart.length > 0) {
          return true
        } else {
          return false
        }
      },
      userLoggedIn() {
        return this.$store.state.user.loggedIn
      },
      formatter(amount) {
        return formatter.format(amount)
      },
      productGetter(item) {
        var product = this.$store.state.products.products.find(product => product.code == item.code)
        return product
      },
      productImageLink(item) {
        let product = this.productGetter(item)
        let link = this.$axios.defaults.baseURL + 'products/images/' + product.code + '/' + product.images[0].image_name
        return link
      },
      productName(item) {
        let product = this.productGetter(item)
        return product.name
      },
      productDiscount(item) {
        let product = this.productGetter(item)
        return product.discount_percentage
      },
      productPrice(item) {
        let product = this.productGetter(item)
        return product.price
      },
      productMrp(item) {
        let product = this.productGetter(item)
        return product.mrp
      },
      productTotal(item) {
        let product = this.productGetter(item)
        let total = product.price * item.quantity
        return total
      },
      async removeFromCart(product) {
        if (this.$store.state.user.loggedIn) {
          await this.$store.dispatch('user/removeFromCart', product).then(() => {
            localStorage.cart = JSON.stringify(this.$store.state.user.user.cart)
            this.cart = this.$store.state.user.user.cart
          })
        } else {
          var cart = JSON.parse(localStorage.cart)
          var rProduct = cart.find(item => item.code == product.code)
          let index = cart.indexOf(rProduct)
          if (index > -1) {
            cart.splice(index, 1);
          }
          this.cart = cart
          localStorage.cart = JSON.stringify(cart)
        }
      },
      totalPrice() {
        var total = 0.00
        for (var item in this.cart) {
          let product = this.productGetter(this.cart[item])
          total += product.price * this.cart[item].quantity
        }
        return total
      },
      totalDiscount() {
        var total = 0.00
        for (var item in this.cart) {
          let product = this.productGetter(this.cart[item])
          total += (product.price * (product.discount_percentage / 100)) * this.cart[item].quantity
        }
        return total
      },
      estimatedTax() {
        var total = 0.00
        for (var item in this.cart) {
          let product = this.productGetter(this.cart[item])
          total += (product.price * 0.18) * this.cart[item].quantity
        }
        return total
      },
      cartTotal() {
        var total = this.totalPrice() + this.estimatedTax() - this.totalDiscount()
        return total
      },
      async checkoutPage() {
        var data = {
          orderTotal: this.cartTotal(),
          sendEmail: false,
          orderDiscount: this.totalDiscount(),
          orderTax: this.estimatedTax(),
        }
        await this.$store.dispatch('checkout/update', data)
        this.$router.push('checkout')
      }
    },
    data() {
      return {
        cart: [],
        order: {}
      }
    }
  }
</script>
<style>
  .cart-list-container {
    min-height: 500px;
  }

  .container-grid {
    display: grid;
    grid-template-columns: auto auto;
  }

  .total-tap {
    margin: 10px;
    min-width: 200px;
    min-height: auto;
    border-left: solid 1px #554694;
    /* box-shadow: 0px 0px 1px 1px #554694; */
  }

  .empty-cart {
    margin: 50px;
    text-align: center;
  }

  .product-list {
    padding: 10px;
  }

  .right-align-text {
    text-align: right;
  }

  .checkout-btn {
    cursor: pointer;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    background-color: #554694;
    color: white;
  }

  .checkout-btn:disabled {
    background-color: #504a6b;
    cursor: not-allowed;
  }

  .login-note {
    padding: 10px;
    border: 2px solid #554694;
    border-radius: 25px;
  }

  .cart-product-grid {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "prod-img prod-name prod-remove"
      "prod-img prod-quantity prod-price"
      "prod-fin prod-fin prod-fin";
  }

  @media only screen and (max-width: 414px) {
    .container-grid {
      grid-template-columns: 1fr;
    }

    .cart-product-grid {
      grid-template-columns: 1fr auto;
      grid-template-areas: "prod-img prod-remove"
        "prod-img ."
        "prod-name prod-name"
        "prod-quantity prod-price"
        "prod-fin prod-fin"
    }

  }
</style>
