<template>
  <div class="" style="background-color: #fff;">
    <div class="product-grid">
      <div style="padding: 20px;">
        <no-ssr placeholder="Loading...">
          <ProductZoomer :base-images="productImages" :base-zoomer-options="zoomerOptions" />
        </no-ssr>
      </div>
      <div style="padding: 20px;">
        <h1 style="margin:10px; margin-left:0;">{{product.name}}</h1>
        <p style="font-size: 28px; font-weight: 600; padding-bottom: 10px; color:#554694;">
          {{formatter(product.price)}}
          <span style="font-size: 14px; text-decoration: line-through; color: grey;">{{formatter(product.mrp)}}</span>
        </p>
        <p style="padding-bottom:10px;"><strong>Description:</strong> {{product.description}}</p>
        <p style="padding-bottom:10px;"><strong>Product Code:</strong> {{product.code}}</p>
        <p style="padding-bottom:10px;"><strong>Capacity:</strong> {{product.specifications.capacity}}</p>
        <p style="padding-bottom:10px;"><strong>Category:</strong> {{product.category}}</p>
        <p style="padding-bottom:10px;"><strong>Condition:</strong> {{product.condition}}</p>

        <button v-on:click="addToCart(product)">Add to Cart</button>
      </div>
    </div>
    <div class="product-specifications">
      <h2 style="padding: 0px 40px;;">Specifications</h2>
      <hr>
      <table>
        <tbody>
          <tr>
            <th>Accessories:</th>
            <td>{{product.specifications.accessories}}</td>
            <th>Brand:</th>
            <td>{{product.specifications.brand}}</td>
          </tr>
          <tr>
            <th>Dimensions:</th>
            <td>{{product.specifications.dimensions}}</td>
            <th>Capacity:</th>
            <td>{{product.specifications.capacity}}</td>
          </tr>
          <tr>
            <th>Model:</th>
            <td>{{product.specifications.model}}</td>
            <th>Sub Category:</th>
            <td>{{product.specifications.sub_category}}</td>
          </tr>
        </tbody>
      </table>
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
    name: 'productPage',
    async asyncData({
      params,
      $axios
    }) {
      return await $axios.get(`/products/${params.id}`)
        .then((response) => {
          const product = response.data
          var images = product.images
          var productImages = {
            'normal_size': []
          }
          for (var image in images) {
            productImages.normal_size.push({
              'id': images[image].image_name,
              'url': $axios.defaults.baseURL + 'products/images/' + product.code + '/' + images[image].image_name
            })
          }
          return {
            product: product,
            productImages: productImages
          }
        })
    },
    mounted() {
      if (process.client) {
        if (window.screen.width < 769) {
          this.zoomerOptions.pane = 'container'
          this.zoomerOptions.zoomFactor = 3
        } else {
          this.zoomerOptions.pane = 'pane',
            this.zoomerOptions.zoomFactor = 4
        }
      }
    },
    methods: {
      formatter(amount) {
        return formatter.format(amount)
      },
      productImage(product) {
        const link = this.$axios.defaults.baseURL + 'products/images/' + product.code + '/' + product.images[0].image_name
        return link
      },
      async addToCart(product) {
        let newProduct = {
          code: product.code,
          quantity: 1
        }
        if (this.$store.state.user.loggedIn) {
          await this.$store.dispatch('user/updateCart', newProduct)
          localStorage.cart = JSON.stringify(this.$store.state.user.user.cart)
        } else {
          let cart = []
          if (typeof(localStorage.cart) != 'undefined') {
            cart = JSON.parse(localStorage.cart)
          }
          var itemExists = cart.find(item => item.code == product.code)
          if (itemExists) {
            var index = cart.indexOf(itemExists)
            cart[index].quantity = itemExists.quantity + newProduct.quantity
          } else {
            cart.push(newProduct)
          }
          localStorage.cart = JSON.stringify(cart)
        }
        this.$notify({
          group: 'authentication',
          title: 'Added to Cart'
        });
      }
    },
    data() {
      return {
        'zoomerOptions': {
          'zoomFactor': 4,
          'pane': 'pane', // three type of pane ['pane', 'container-round', 'container']
          'hoverDelay': 300,
          'namespace': 'container-zoomer',
          'move_by_click': false,
          'scroll_items': 5,
          'choosed_thumb_border_color': "#ff3d00",
        }
      }
    }
  }
</script>
<style>
  .product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .product-specifications {
    padding: 20px;
  }

  .product-specifications table {
    width: 100%;
    padding: 10px 40px;
    text-align: left;
  }

  tr {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  td {
    background-color: #e9e4ff;
  }

  th,
  td {
    border: 1px solid #dedede;
    padding: 8px;
    text-align: left;
  }

  @media only screen and (max-width: 414px) {
    .product-grid {
      grid-template-columns: 1fr;
    }

    .product-specifications table {
      padding: 0px;
    }

    tr {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
