<template>
  <div class="main">
    <div class="slider-container" style="position:relative;">
      <div class="slider-view">
        <div class="slide" ref="slide" v-for="slide in slides" :key="slide.index">
          <img :src="slide.slide" alt="">
        </div>
      </div>
      <button type="button" v-on:click="previous()" style="position: absolute; top: 40%; left:10px; background-color: #fff; border: none; padding:20px;" name="previousButton"><i class="fa fa-arrow-left" aria-hidden="true"></i></button>
      <button type="button" v-on:click="next()" style="position: absolute; top: 40%; right:10px; background-color: #fff; border: none; padding:20px;" name="nextButton"><i class="fa fa-arrow-right" aria-hidden="true"></i></button>
    </div>
    <div v-if="DealsProducts.length > 0">
      <h1 style="margin-top: 50px; text-align: center;">Best Deals at Best Prices</h1>
      <VerticalList :products="DealsProducts"></VerticalList>
    </div>
    <div class="categories">
      <div style="padding-top: 30px;" class="refrigerator-grid">
        <nuxt-link to="/category/refrigerator">
          <div class="refrigerator-banner">
            <img src="/refrigerators.png" alt="">
          </div>
        </nuxt-link>
        <div class="refrigerator-list">
          <VerticalList :products="Refrigerators"></VerticalList>
        </div>
      </div>
      <div style="padding-top: 30px;" class="washing-machine-grid">
        <div class="washing-machine-list">
          <VerticalList :products="WashingMachines"></VerticalList>
        </div>
        <nuxt-link to="/category/washing-machine">
          <div class="washing-machine-banner">
            <img src="/washing-machines.png" alt="">
          </div>
        </nuxt-link>
      </div>
    </div>
    <div class="cta-section">
    </div>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'

  import VerticalList from './../components/vertical-list.vue'
  export default {
    components: {
      VerticalList
    },
    computed: mapState({
      DealsProducts(state) {
        return state.products.products.filter(product => product.discount_percentage > 0)
      },
      Refrigerators(state) {
        return state.products.products.filter(product => product.category == 'Refrigerator')
      },
      WashingMachines(state) {
        return state.products.products.filter(product => product.category == 'Washing Machine')
      }
    }),
    created() {
      setInterval(this.next, 4000)
    },
    methods: {
      next() {
        this.$store.dispatch('sliders/next')
      },
      previous() {
        this.$store.dispatch('sliders/previous')
      }
    },
    data() {
      return {
        slides: this.$store.state.sliders.slides,

      }
    }
  }
</script>

<style>
  .main {
    background-color: #fff;
  }

  .slider-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .slider-view {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;

    width: 100%;
  }

  .slide {
    flex: 0 0 20em;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 1s ease-in-out;
  }

  .refrigerator-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas: "ref-banner ref-list";
  }

  .refrigerator-banner {
    grid-area: ref-banner;
  }

  .refrigerator-list {
    grid-area: ref-list;
    overflow: hidden;
  }

  .washing-machine-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: "wash-list wash-banner";
  }

  .washing-machine-banner {
    grid-area: wash-banner;
  }

  .washing-machine-list {
    grid-area: wash-list;
    overflow: hidden;
  }

  .cta-section {
    position: relative;
    background: #EBEBEB;
    width: 100%;
    height: 300px;
  }

  @media only screen and (max-width: 414px) {
    .slide img {
      width: 100%;
    }

    .refrigerator-banner img {
      width: 100%
    }

    .refrigerator-grid {
      grid-template-areas: "ref-banner ref-banner""ref-list ref-list"
    }

    .washing-machine-banner img {
      width: 100%
    }

    .washing-machine-grid {
      grid-template-columns: "1fr auto";
      grid-template-areas: "wash-banner wash-banner""wash-list wash-list"
    }
  }
</style>
