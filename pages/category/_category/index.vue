<template>
  <div class="main">
    <div class="header">
      <img :src="categoryImageLink(category,'1200x200')" width="100%" alt="">
    </div>
    <div v-if="this.products.length > 0" class="list-container-grid">
      <div class="filters">
        <h3>Filter Products:</h3>
        <hr>
        <h4>{{category}} Type:</h4>
        <form v-for="subCategory in categoryTypes">
          <input type="checkbox" name="sub_category" :id="subCategory" @change="selectCategoryType(subCategory)"> {{subCategory}}<br>
        </form>
        <hr>

        <h4>Brands:</h4>
        <form v-for="brand in brands">
          <input type="checkbox" name="brand" :id="brand" @change="selectBrand(brand)"> {{brand}}<br>
        </form>
        <hr>

      </div>
      <div class="" v-if="filteredProducts.length > 0">
        <ProductsList :products="filteredProducts"></ProductsList>
      </div>
      <div class="" v-else>
        <ProductsList :products="this.products"></ProductsList>
      </div>
    </div>
    <div class="" v-else>
      <h1 style="margin-left: auto; margin-right: auto;">Coming soon...</h1>
    </div>
  </div>
</template>
<script>
  import ProductsList from './../../../components/products-list.vue'
  import _ from 'lodash';
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  })
  const categories = {
    'Refrigerator': {
      categoryTypes: ['Single Door', 'Double Door'],
      brand: ['LG', 'Whirlpool', 'Godrej', 'Samsung']

    },
    'Washing Machine': {
      categoryTypes: ['Top Load', 'Front Load'],
      brand: ['LG', 'Whirlpool', 'Godrej']
    }
  }
  export default {
    async asyncData({
      store,
      params
    }) {
      await store.dispatch('products/get')
      const category = _.startCase(params.category.split('-').join(' '))
      const products = store.state.products.products.filter(product => product.category == category)
      return {
        category,
        products
      }
    },
    components: {
      ProductsList
    },
    mounted() {
      for (var category in categories) {
        if (category == this.category) {
          this.categoryTypes = categories[category].categoryTypes
          this.brands = categories[category].brand
        }
      }
    },
    computed: {
      filteredTypeProducts() {
        var filteredList = []
        for (var subCategory in this.selectedCategoryTypes) {
          filteredList = this.products.filter(product => product.specifications.sub_category == this.selectedCategoryTypes[subCategory])
        }
        return filteredList
      },
      filteredBrandProducts() {
        var filteredList = []
        for (var brand in this.selectedBrands) {
          if (this.filteredTypeProducts.length > 0) {
            filteredList = this.filteredTypeProducts.filter(product => product.specifications.brand == this.selectedBrands[brand])
          } else {
            filteredList = this.products.filter(product => product.specifications.brand == this.selectedBrands[brand])
          }
        }
        return filteredList
      },
      filteredProducts() {
        var filteredList = []
        var filteredList = this.filteredBrandProducts
        if (this.filteredBrandProducts.length > 0) {
          return filteredList
        } else {
          return this.filteredTypeProducts
        }
      }
    },
    methods: {
      selectCategoryType(value) {
        var matched = false
        if (this.selectedCategoryTypes.length > 0) {
          var index = this.selectedCategoryTypes.indexOf(this.selectedCategoryTypes.find(category => category == value))
          if (index > -1) {
            this.selectedCategoryTypes.splice(index, 1)
            matched = true
          }
          if (!matched) {
            this.selectedCategoryTypes.push(value)
          }
        } else {
          this.selectedCategoryTypes.push(value)
        }
      },
      selectBrand(value) {
        var matched = false
        if (this.selectedBrands.length > 0) {
          var index = this.selectedBrands.indexOf(this.selectedBrands.find(category => category == value))
          if (index > -1) {
            this.selectedBrands.splice(index, 1)
            matched = true
          }
          if (!matched) {
            this.selectedBrands.push(value)
          }
        } else {
          this.selectedBrands.push(value)
        }
        console.log(this.selectedBrands)
      },
      formatter(amount) {
        return formatter.format(amount)
      },
      categoryImageLink(category, size = '250') {
        let link = 'https://via.placeholder.com/' + size + '/000000/FFFFFF?text=' + category
        return link
      },
      productImageLink(product) {
        let link = this.$axios.defaults.baseURL + 'products/images/' + product.code + '/' + product.images[0].image_name
        return link
      }
    },
    filters: {
      truncate(str, len = 28) {
        _.trim(str);
        return _.truncate(str, {
          'length': len
        });
      }
    },
    data() {
      return {
        filterSubCategory: '',
        categoryTypes: [],
        category: '',
        selectedCategoryTypes: [],
        selectedBrands: [],
        brands: []
      }
    }
  }
</script>
<style>
  .main {
    background-color: #fff;
  }

  .filters {
    text-align: left;
    box-shadow: 0px 2px 2px grey;
    padding: 5px;
    margin: 10px;
    min-width: 180px;
  }

  .product-list {}

  .product-card {
    box-shadow: 0px 1px 1px grey;
    max-height: 290px;
    padding: 10px;
  }

  .list-container-grid {
    display: grid;
    grid-template-columns: 280px auto;
    padding: 20px;
  }

  input {
    width: auto;
  }

  @media only screen and (max-width: 865px) {
    .list-container-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
