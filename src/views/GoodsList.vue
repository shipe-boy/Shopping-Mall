<!--  -->
<template>
  <div>
    <crumb>
      <span>Goods</span>
    </crumb>
    <symbol id="icon-arrow-short" viewBox="0 0 25 32">
      <title>arrow-short</title>
      <path class="path1"
        d="M24.487 18.922l-1.948-1.948-8.904 8.904v-25.878h-2.783v25.878l-8.904-8.904-1.948 1.948 12.243 12.243z">
      </path>
    </symbol>
    <symbol id="icon-status-ok" viewBox="0 0 32 32">
        <title>status-ok</title>
        <path class="path1" d="M22.361 10.903l-9.71 9.063-2.998-2.998c-0.208-0.209-0.546-0.209-0.754 0s-0.208 0.546 0 0.754l3.363 3.363c0.104 0.104 0.241 0.156 0.377 0.156 0.131 0 0.261-0.048 0.364-0.143l10.087-9.414c0.215-0.201 0.227-0.539 0.026-0.754s-0.539-0.226-0.754-0.026z"></path>
        <path class="path2" d="M16 30.933c-8.234 0-14.933-6.699-14.933-14.933s6.699-14.933 14.933-14.933c8.234 0 14.933 6.699 14.933 14.933s-6.699 14.933-14.933 14.933zM16 0c-8.822 0-16 7.178-16 16 0 8.823 7.178 16 16 16s16-7.177 16-16c0-8.822-7.178-16-16-16z"></path>
      </symbol>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortBy">Price
            <svg class="icon icon-arrow-short" :class="{'sort-up' : sort}">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPrice">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" :class="{'cur': priceLevel == 'all'}" @click="filterPrice('all')">All</a>
              </dd>
              <dd v-for="(item,index) in setFilterPrice" :key="index">
                <a href="javascript:void(0)" :class="{'cur': priceLevel == index}"
                  @click="filterPrice(index)">{{ item.startPrice }} - {{ item.endPrice }}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList" :key="index">
                  <div class="pic">
                    <a href="javascript:;"><img v-lazy='"http://localhost:3000" + item.productImg' alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName }}</div>
                    <div class="price">{{ item.salePrice }}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
                infinite-scroll-distance="20">
                <img v-if="loading" src="./../assets/loading-svg/loading-spinning-bubbles.svg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 响应式遮罩层 -->
    <div class="md-overlay" v-show="overlayFlag" @click="closePrice"></div>
    <!-- 信息提示框 -->
    <el-button style="display:none;" :plain="true" @click="open2">成功</el-button>
    <el-button style="display:none;" :plain="true" @click="open4">错误</el-button>

    <modal :mdShow="mdShow" @close="closeMd">
        <p slot="message">
            <svg v-if="mdBtnToGo" class="icon icon-status-ok">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
            </svg>
            {{mdMsg}}
        </p>
        <div slot="btn-group">
            <a class="btn btn--m" href="javascript:;" @click="mdShow = false">{{mdBtnMsg}}</a>
            <router-link v-if="mdBtnToGo" class="btn btn--m" href="javascript:;" to="/cart">{{mdBtnToGo}}</router-link>
        </div>
    </modal>
  </div>
</template>

<script>
import Modal from '../components/modal'
  export default {
    name: 'GoodsList',
    components:{
        Modal
    },
    data() {
      return {
        goodsList: [],
        sort: true,
        page: 1,
        pageSize: 8,
        loading: false,
        priceLevel: 'all',
        setFilterPrice: [{
            startPrice: 0,
            endPrice: 100
          },
          {
            startPrice: 100,
            endPrice: 500
          },
          {
            startPrice: 500,
            endPrice: 1000
          },
          {
            startPrice: 1000,
            endPrice: 5000
          }
        ],
        filterBy: false, //响应式的价格区间
        overlayFlag: false, //响应式的遮罩
        busy: true, //false启用加载，true关闭加载
        error: '',
        success: '',
        mdShow: false,
        mdMsg: '',
        mdBtnMsg:'',
        mdBtnToGo:'',
      }
    },
    methods: {
      getGoodsList(flag) {
        let params = {
          sort: this.sort ? 1 : -1,
          page: this.page,
          pageSize: this.pageSize,
          priceLevel: this.priceLevel
        }
        this.loading = true;
        this.$ajax.get('/goods', {
            params
          })
          .then(res => {
            this.loading = false;
            if (res.data.status == 1) {
              if (flag) { //分页时  数据要累加
                this.goodsList = this.goodsList.concat(res.data.result);

                if (res.data.result.length == 0) {
                  this.busy = true;
                } else {
                  this.busy = false;
                }

              } else {
                this.goodsList = res.data.result;
                this.busy = false;
              }
            }
            // console.log(res.data)
          }).catch(err => {
            console.log(err)
          })
      },
      sortBy() {
        this.sort = !this.sort;
        this.page = 1;
        this.getGoodsList();
      },
      filterPrice(index) {
        this.priceLevel = index;
        this.page = 1;
        this.getGoodsList();
        this.closePrice()
      },
      loadMore() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true)
        }, 500);
      },
      closePrice() { //遮罩
        this.overlayFlag = false;
        this.filterBy = false;
      },
      showFilterPrice() {
        this.overlayFlag = true;
        this.filterBy = true;
      },
      addCart(productId) {
        this.$ajax.post('/goods/addCart', {
            productId
          })
          .then(res => {
            // console.log(res)
            this.mdMsg = res.data.msg; // 模态框信息
            if (res.data.status == 1) {  //加入成功
                this.mdBtnMsg = '继续购物';
                this.mdBtnToGo = "查看购物车";
                this.$store.commit('cartCount',1)
            } else if (res.data.status == 1001) { //用户未登录
                this.mdBtnMsg = '关闭';
                this.mdBtnToGo = "";
            } else {  //服务器出错
                this.mdBtnMsg = '关闭';
                this.mdBtnToGo = "";
            }
            this.mdShow = true;   //显示模态框
          }).catch(err => {
            this.error = '服务器出错';
            this.open4()
          })
      },
      open2() {
        this.$message({
          message: this.success,
          type: 'success'
        });
      },
      open4() {
        this.$message.error(this.error);
      },
      closeMd(){
          this.mdShow = false;
      }
    },
    mounted() {
      this.getGoodsList()
    }
  }

</script>
<style scoped>
  .load-more {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .icon-arrow-short{
    transition: .3s;
  }
  .sort-up{
      transform: rotate(180deg);
  }
</style>
