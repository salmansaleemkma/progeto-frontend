<template>
  <div class="checkout-page">
    <div class="checkout-left">
      <h2>Checkout </h2>
      <h5>Please fill the below details to place the order.</h5>
      <table>
        <tbody>
          <tr>
            <th>Name:</th>
            <td>
              <h4 class="" style="margin: 10px 0px;">{{this.$store.state.user.user.name}}</h4>
            </td>
          </tr>
          <tr>
            <th>Email:</th>
            <td>
              <h4 class="" style="margin: 10px 0px;">{{this.$store.state.user.user.email}} <i style="color: green; font-size: 18px;" class="fa fa-check-circle"></i></h4>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="phone-grid">
        <table>
          <tbody>
            <tr>
              <th>Phone:</th>
              <td><span style="margin-top: 12px; margin-right: 5px;">+91</span><input class=" phone" type="text" name="" v-model="phone" value="" pattern="\d*" maxlength="10" :disabled="mobileVerified"></td>
            </tr>
          </tbody>
        </table>
        <div class="">
          <div v-if="mobileVerified">
            <i style="color: green; font-size: 18px; margin-top: 12px;" class="fa fa-check-circle"></i> (number verified)
          </div>
          <div v-else>
            <div v-if="otpSent">
              <input type="text" name="" value="" v-model="otp">
              <button type="button" name="button" @click="verifyOtp">verify OTP</button>
            </div>
            <div v-else>
              <button type="button" name="button" @click="sendOtp" :disabled="phoneLength <= 9">Send OTP</button>
            </div>
          </div>
        </div>
      </div>
      <h3>Delivery Address</h3>
      <div class="address-grid">
        <div style="grid-area: address;">
          <label>Address: </label> <input style="width: 70%" v-model="delivery_address.address" type="text" required>
        </div>
        <div style="grid-area: pin-code;">
          <label>Pin Code:</label> <input v-model="delivery_address.zip_code" type="text">
        </div>
        <div style="grid-area: city;">
          <label> City:</label> <input v-model="delivery_address.city" type="text">
        </div>
      </div>
      <h3>Billing Address: <span style="font-weight: 300; font-size:16px;"><input type="checkbox" v-model="sameAsDelivery" name=""> Same as Delivery Address</span></h3>
      <div class="address-grid">
        <div style="grid-area: address;">
          <label>Address: </label><input style="width: 70%" v-model="billing_address.address" class="" type="text" name="">
        </div>
        <div style="grid-area: pin-code;">
          <label>Pin Code:</label><input v-model="billing_address.zip_code" type="text">
        </div>
        <div style="grid-area: city;">
          <label> City:</label><input v-model="billing_address.city" class="" type="text">
        </div>
      </div>
    </div>
    <div class=" checkout-right">
      <h2>Order Summary</h2>
      <div v-for="product in products">
        <h4 style="margin: 10px 0px;">{{productName(product)}} x {{product.quantity}}</h4>
      </div>
      <strong>Order Total: </strong>{{formatter(this.$store.state.checkout.payment.orderTotal)}}

      <div class="" style="margin-top: 20px;">
        <p class="" style="padding-top:20px;">Payment Mode:</p>
        <select v-model="payment_mode" class="" name="">
          <option value="">Select</option>
          <option value="online">Online(Credit/Debit Card, UPI, NetBanking)</option>
          <option value="COD">Cash On Delivery</option>
        </select>
        <span class=""></span>
      </div>
      <button class="place-order-btn" type="button" name="button" @click="placeOrder()" :disabled="!allDetailsEntered ">Place Order</button>
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
      if (!this.$store.state.checkout.payment.orderTotal) {
        this.$router.push('cart')
      }
    },
    computed: {
      mobileVerified() {
        return this.$store.state.user.user.contact_verified
      },
      phoneLength() {
        if (this.phone) {
          return this.phone.length
        } else {
          return 0
        }
      },
      watchAddresses() {
        if (this.delivery_address.address.length != 0 && this.delivery_address.zip_code.length != 0 && this.delivery_address.city.length != 0) {
          if (this.billing_address.address.length != 0 && this.billing_address.zip_code.length != 0 && this.billing_address.city.length != 0) {
            return true
          }
        } else {
          return false
        }
      },
      allDetailsEntered() {
        if (this.watchAddresses && this.mobileVerified && this.payment_mode != "") {
          console.log('details updated')
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      sameAsDelivery() {
        if (this.sameAsDelivery) {
          this.billing_address = this.delivery_address
        } else {
          this.billing_address = {
            address: '',
            city: '',
            zip_code: ''
          }
        }
      }
    },
    methods: {
      formatter(amount) {
        return formatter.format(amount)
      },
      productGetter(item) {
        var product = this.$store.state.products.products.find(product => product.code == item.code)
        return product
      },
      productName(item) {
        let product = this.productGetter(item)
        return product.name
      },
      async sendOtp() {
        var data = {
          'phone': this.phone
        }
        await this.$axios({
          method: 'POST',
          url: 'user/phone/otp/send',
          data: data
        }).then(response => {
          console.log(response)
          this.otpSent = true
        }, error => {
          console.log(error)
        })
      },
      async verifyOtp() {
        var data = {
          'code': this.otp
        }
        await this.$axios({
          method: 'POST',
          url: 'user/phone/otp/verify',
          data: data
        }).then(response => {
          console.log(response)
          this.$store.dispatch('user/get')
        }, error => {
          console.log(error)
        })
      },
      async placeOrder() {
        this.$root.$loading.start();
        var data = {
          'total': this.$store.state.checkout.payment.orderTotal,
          'total_discount': this.$store.state.checkout.payment.orderDiscount,
          'estimated_tax': this.$store.state.checkout.payment.orderTax,
          'delivery_address': this.delivery_address,
          'billing_address': this.billing_address,
          'payment_mode': this.payment_mode,
          'send_email': this.$store.state.checkout.payment.sendEmail
        }
        await this.$axios({
          url: 'user/order/new',
          method: 'POST',
          data: data
        }).then(response => {
          if (response.status == 201) {
            this.$root.$loading.finish();
            if (response.data.payment_mode == 'COD') {
              console.log(response.data)
              this.$router.push({
                name: "cod-order-placed",
                params: {
                  order_id: response.data.order_id,
                  payment_status: response.data.status
                }
              })
            } else {
              console.log(response.data)
              location.replace(response.data.payment_requet_url)
            }
          }
        }, error => {
          console.log(error)
        })
      }
    },
    data() {
      return {
        products: this.$store.state.user.user.cart,
        phone: this.$store.state.user.user.contact_number,
        delivery_address: {
          address: '',
          city: '',
          zip_code: ''
        },
        billing_address: {
          address: '',
          city: '',
          zip_code: ''
        },
        payment_mode: '',
        otpSent: false,
        otp: '',
        sameAsDelivery: false
      }
    }

  }
</script>
<style>
  .checkout-page {
    display: grid;
    grid-template-columns: auto auto;
    padding: 20px;
  }

  .checkout-right {
    margin-left: 100px;
    margin-right: 0px;
  }

  .checkout-left h3 {
    padding-top: 20px;
  }

  .checkout-left input {
    width: auto;
    margin: 5px 0px;
  }

  .checkout-left label {
    margin: 10px 0px;
  }

  .checkout-left . {
    margin: 20px 0px;
  }

  .place-order-btn {
    margin: 20px;
    cursor: pointer;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    background-color: #554694;
    color: white;
  }

  .place-order-btn:disabled {
    background-color: #504a6b;
    cursor: not-allowed;
  }

  .phone {
    margin-left: 0px;
  }

  select {
    border: 2px solid;
    padding: 15px 10px;
    background-color: #fff;
    border-radius: 25px;
  }

  select option {
    padding: 15px 15px;
    background-color: #fff;
    border-radius: 25px;
  }

  .phone-grid {
    display: grid;
    grid-template-columns: auto 1fr;
  }

  .address-grid {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-areas: "address address"
      "pin-code city"
  }

  @media only screen and (max-width: 414px) {
    .checkout-page {
      grid-template-columns: 1fr;
    }

    .checkout-right {
      margin: auto;
    }

    .phone-grid {
      grid-template-columns: 1fr;

    }

    .address-grid {
      grid-template-columns: 1fr;
      grid-template-areas: "address""pin-code""city"
    }
  }
</style>
