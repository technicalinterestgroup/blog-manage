<template>
<iv-form ref="loginForm" :model="form" :rules="ruleslogin" @keydown.enter.native="handleSubmit">
    <iv-form-item prop="user">
        <iv-input v-model="form.username" placeholder="请输入用户名">
            <span slot="prepend">
            <iv-icon :size="16" type="ios-person"></iv-icon>
            </span>
        </iv-input>
    </iv-form-item>
    <iv-form-item prop="password">
        <iv-input type="password" v-model="form.password" placeholder="请输入密码">
            <span slot="prepend">
            <iv-icon :size="14" type="ios-lock"></iv-icon>
            </span>
        </iv-input>
    </iv-form-item>
    <iv-form-item prop="verification">
        <iv-input type="text" v-model="form.verification" placeholder="请输入验证码">
            <span slot="prepend">
            <iv-icon :size="14" type="ios-medical"></iv-icon>
            </span>
        </iv-input>
    </iv-form-item>
    <iv-form-item prop="pic">
      <img align="left" height="40" width="120" :src="base64Img"/>
      <div ><a style="font-size: 12px; height: 35px; margin-top: 12px; float: right;position: absolute;right: 0;top: 0;" @click="convert" type='text'>看不清，换一张</a></div>
    </iv-form-item>
    <iv-form-item>
        <iv-button @click="handleSubmit" type="primary" long>登录</iv-button>
    </iv-form-item>
</iv-form>
</template>

<script>
export default {
  name: 'LoginForm',
  data () {
    return {
      form: {
        username: '',
        password: '',
        verification: ''
      },
      token: '',
      base64Img: '',
      ruleslogin: { // 校验表单规则
        username: [ // FormItem标签中的 prop 属性预期值
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [ // FormItem标签中的 prop 属性预期值
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '6位数密码', trigger: 'blur' }
        ],
        verification: [ // FormItem标签中的 prop 属性预期值
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { type: 'string', min: 4, message: '4位验证码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.convert()
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        // this.$refs.loginForm.validate : 获取表单校验结果; 校验正确-> valid为True; 校验失败-> valid为False;
        if (valid) {
          this.$emit('on-success-valid', {
            username: this.form.username.trim(), // 将this.form.username和this.form.password传给父组件的on-success-valid参数
            password: this.form.password.trim(), // 并使用 username 和 password 接受
            img: this.form.verification,
            token: this.token
          })
        }
      })
    },
    convert: function () {
      this.$axios.get('/view/captcha')
        .then(res => {
          if (res.data.code === '000000') {
            this.base64Img = res.data.data.img
            this.token = res.data.data.token
          }
        })
    },
    base64ImgtoFile: function (dataurl, filename = 'file') {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
    }
  }
}
</script>
