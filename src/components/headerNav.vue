<template>
  <header class="header">
    <symbol id="icon-cart" viewBox="0 0 38 32">
      <title>cart</title>
      <path class="path1"
        d="M37.759 0h-4.133c-0.733 0.004-1.337 0.549-1.434 1.255l-0.546 4.342c-0.081 0.484-0.496 0.849-0.997 0.849-0.005 0-0.009-0-0.014-0h-27.604c-0.003 0-0.007-0-0.011-0-1.674 0-3.031 1.357-3.031 3.031 0 0.34 0.056 0.666 0.159 0.971l2.52 8.062c0.385 1.194 1.486 2.043 2.785 2.043 0.126 0 0.25-0.008 0.372-0.023l22.983 0.002c0.515 0.131 0.626 0.768 0.626 1.283 0.005 0.044 0.009 0.095 0.009 0.146 0 0.501-0.294 0.933-0.718 1.134l-22.439 0.003c-0.354 0-0.642 0.287-0.642 0.642s0.287 0.642 0.642 0.642h22.745l0.131-0.071c0.919-0.392 1.551-1.287 1.551-2.33 0-0.058-0.002-0.116-0.006-0.173 0.021-0.108 0.033-0.24 0.033-0.376 0-1.072-0.732-1.973-1.724-2.23l-23.357-0.004c-0.063 0.008-0.135 0.013-0.209 0.013-0.719 0-1.332-0.455-1.566-1.093l-2.53-8.095c-0.048-0.154-0.076-0.332-0.076-0.515 0-0.973 0.782-1.764 1.752-1.778h27.657c1.159-0.004 2.112-0.883 2.232-2.011l0.547-4.345c0.010-0.083 0.078-0.147 0.161-0.152l4.133-0c0.354 0 0.642-0.287 0.642-0.642s-0.287-0.642-0.642-0.642z">
      </path>
      <path class="path2"
        d="M31.323 9.69c-0.022-0.003-0.048-0.004-0.074-0.004-0.328 0-0.598 0.248-0.633 0.567l-0.809 7.268c-0.003 0.022-0.004 0.048-0.004 0.074 0 0.328 0.248 0.598 0.567 0.633l0.074 0c0.001 0 0.003 0 0.004 0 0.327 0 0.596-0.246 0.632-0.563l0.809-7.268c0.003-0.022 0.004-0.048 0.004-0.074 0-0.328-0.248-0.598-0.567-0.633z">
      </path>
      <path class="path3"
        d="M27.514 25.594c-1.769 0-3.203 1.434-3.203 3.203s1.434 3.203 3.203 3.203c1.769 0 3.203-1.434 3.203-3.203s-1.434-3.203-3.203-3.203zM27.514 30.717c-1.060 0-1.92-0.86-1.92-1.92s0.86-1.92 1.92-1.92c1.060 0 1.92 0.86 1.92 1.92s-0.86 1.92-1.92 1.92z">
      </path>
      <path class="path4"
        d="M9.599 25.594c-1.769 0-3.203 1.434-3.203 3.203s1.434 3.203 3.203 3.203c1.769 0 3.203-1.434 3.203-3.203s-1.434-3.203-3.203-3.203zM9.599 30.717c-1.060 0-1.92-0.86-1.92-1.92s0.86-1.92 1.92-1.92c1.060 0 1.92 0.86 1.92 1.92s-0.86 1.92-1.92 1.92z">
      </path>
    </symbol>
    <div class="navbar">
      <div class="navbar-left-container">
        <a href="/">
          <img class="navbar-brand-logo" src="static/logo.png"></a>
      </div>
      <div class="navbar-right-container" style="display: flex;">
        <div class="navbar-menu-container">
          <a v-if="login" href="/" class="navbar-link">{{ userName }}</a>
          <span class="navbar-link"></span>
          <a v-if="!login" href="javascript:void(0)" class="navbar-link" @click="dialogFormVisible = true">Login</a>
          <a v-if="login" href="javascript:void(0)" class="navbar-link" @click="logOut">Logout</a>
          <el-dialog title="请登录" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
            <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px"
              class="demo-ruleForm">
              <el-form-item label="用户名" prop="name">
                <el-input type="name" v-model="ruleForm2.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                <el-button @click="resetForm('ruleForm2')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-button style="display:none;" :plain="true" @click="open2">成功</el-button>
          <el-button style="display:none;" :plain="true" @click="open4">错误</el-button>
          <div class="navbar-cart-container">
            <span v-if="cartCount>0" class="navbar-cart-count">{{cartCount}}</span>
            <a class="navbar-link navbar-cart-link" href="/cart">
              <svg class="navbar-cart-logo">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

  </header>
</template>

<script>
  export default {
    name: "",
    data() {
      var validateName = (rule, value, callback) => {
        if (value.trim() === "") {
          callback(new Error("请输入用户名"));
        } else {
          this.$ajax.post('/users/username', {
              userName: value
            })
            .then(res => {
              if (res.data.status == 1) {
                callback();
              } else {
                callback(new Error(res.data.msg));
              }
            })
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value.trim() === "") {
          callback(new Error("请输入密码"));
        } else {
          this.$ajax.post('/users/userpwd', {
              userPwd: value
            })
            .then(res => {
              if (res.data.status == 1) {
                callback();
              } else {
                callback(new Error(res.data.msg));
              }
            })
        }
      };
      return {
        dialogFormVisible: false,
        ruleForm2: {
          name: "",
          pass: ""
        },
        formLabelWidth: "120px",
        rules2: {
          pass: [{
            validator: validatePass,
            trigger: "blur"
          }],
          name: [{
            validator: validateName,
            trigger: "blur"
          }]
        },
        error: '',
        success: '',
        login: false,
        userName: ''
      };
    },
    computed:{
        cartCount(){
            return this.$store.state.cartCount;
        }
    },
    methods: {
      submitForm(formName) {
        this.dialogFormVisible = false;
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              userName: this.ruleForm2.name,
              userPwd: this.ruleForm2.pass
            };
            this.$ajax
              .post("/users/login", params)
              .then(res => {
                if (res.data.status == 1) {
                  this.login = true;
                  this.userName = res.data.result.userName;
                  this.getCartCount();
                  this.success = "登陆成功"
                  this.open2()
                } else {
                  this.error = "登陆失败"
                  this.open4();
                }
              })
              .catch(err => {
                this.error = "服务器出错，登陆失败"
                this.open4();
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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
      keepLogin() {
        this.$ajax.get('/users/isLogin').then(res => {
          if (res.data.status == 1) {
            this.login = true;
            this.userName = res.data.result.userName;
            this.getCartCount();
          } else {
            // this.error = "请先登录"
            // this.open4()
          }
        }).catch(err => {
          this.error = "服务器出错"
          this.open4()
        })
      },
      logOut(){
          this.$ajax.get('/users/logOut').then(res => {
            //   console.log(res)
              if(res.data.status == 1){
                  this.login = false;
              }
          }).catch(err => {

          })
      },
      getCartCount(){
          this.$ajax.get('/users/cartCount').then(res=>{
            //   console.log(res)
              if(res.data.status ==1){
                  this.$store.commit('initCartCount',res.data.result)
              }
          }).catch(err=>{
              console.log(err)
          })
      }
    },
    mounted(){
        this.keepLogin()
    }
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
