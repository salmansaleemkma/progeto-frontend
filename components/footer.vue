<template>
  <div class="">
    <div class="footer">
      <div class="" class="main-footer-grid">
        <div class="main-sub-footer">
          <h4>SUPPORT</h4>
          <nuxt-link to="" class="footer-links">FAQ</nuxt-link><br>
          <nuxt-link to="" class="footer-links">Payments</nuxt-link><br>
          <nuxt-link to="" class="footer-links">Cancellations</nuxt-link><br>
          <nuxt-link to="" class="footer-links">Shipping</nuxt-link><br>
        </div>
        <div class="main-sub-footer">
          <h4>POLICY</h4>
          <nuxt-link to="/terms-of-use" class="footer-links">Terms of Use</nuxt-link><br>
          <nuxt-link to="/privacy-policy" class="footer-links">Privacy Policy</nuxt-link>
        </div>
        <div class="main-sub-footer">
          <h4>ABOUT US</h4>
        </div>
        <div class="main-sub-footer">
          <h4>SOCIAL</h4>
          <a href="https://www.facebook.com/progeto.in/" class="footer-links">facebook</a>
        </div>

      </div>
      <div class="sub-footer">
        <p style="margin: 12px 30px; color: #fff;">Progeto.in &copy; 2019.</p>
      </div>
    </div>
  </div>
</template>

<style media="screen">
  .footer {
    position: relative;
    background: #0e072d;
    width: 100%;
  }

  .main-footer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 50px 30px;
    color: white;
  }

  .main-sub-footer {
    padding: 10px;
  }

  .main-sub-footer h4 {
    margin-bottom: 10px;
    width: 50%;
    border-bottom: solid 4px #7f6fc1;
  }

  .sub-footer {
    position: absolute;
    bottom: 0;
    background: #000;
    ;
    width: 100%;
    height: 40px;
  }

  .footer-links {
    padding-top: 5px;
    color: white;
  }

  @media only screen and (max-width: 414px) {
    .main-footer-grid {
      grid-template-columns: 1fr;
    }

    .main-sub-footer h4 {
      width: auto;
    }
  }
</style>
