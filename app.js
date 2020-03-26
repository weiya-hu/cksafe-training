//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    let islogin=wx.getStorageSync('islogin')
    if(!islogin){
      wx.setStorageSync('islogin', false)
    }
    
    
  },
  onShow() {
    this.globalData.isshowggao=true
    console.log(this.globalData.isshowggao)
    //强制更新
    try {
      //使用更新对象之前判断是否可用
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启当前应用？',
                success(res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用applyUpdate应用新版本并重启
                    updateManager.applyUpdate()
                  }
                },
                fail(res) {
                  console.log(res)
                }
              })
            })
            // 新版本下载失败时执行
            updateManager.onUpdateFailed(function () {
              wx.showModal({
                title: '发现新版本',
                content: '请删除当前小程序，重新搜索打开...',
              })
            })
          }
        })
      } else {

        //如果小程序需要在最新的微信版本体验，如下提示
        wx.showModal({
          title: '更新提示',
          content: '当前微信版本过低，请升级到最新微信版本后重试。'
        })
      }
    } catch (e) {
      console.log(e)
    }
  },
  questUrl(url,method, data) {
    wx.showLoading({
      title: '',
    })
    //返回一个Promise对象
    return new Promise(function (resolve, reject) {
      wx.request({
        // url: 'https://kaijin.zhoumc.cn/'+url,
        url: 'http://192.168.100.132:8080/'+url,
        method: method,
        data: data,
        //在header中统一封装报文头，这样不用每个接口都写一样的报文头定义的代码
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          wx.hideLoading();
          //这里可以根据自己项目服务端定义的正确的返回码来进行，接口请求成功后的处理，当然也可以在这里进行报文加解密的统一处理
          if (res.data) {
            resolve(res);
          } else {
            //如果出现异常则弹出dialog
            wx.showModal({
              title: '提示',
              content: res.data.errCode + '系统异常',
              confirmColor: '#118EDE',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            });
          }
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '服务器暂时无法连接',
            icon: 'loading',
            duration: 2000
          })
          reject(res);
        }
      });
    });
  },
  questUrl_noloading(url, method, data) {
    
    //返回一个Promise对象
    return new Promise(function (resolve, reject) {
      wx.request({
        // url: 'https://kaijin.zhoumc.cn/'+url,
        url: 'http://192.168.100.132:8080/' + url,
        method: method,
        data: data,
        //在header中统一封装报文头，这样不用每个接口都写一样的报文头定义的代码
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          //这里可以根据自己项目服务端定义的正确的返回码来进行，接口请求成功后的处理，当然也可以在这里进行报文加解密的统一处理
          if (res.data) {
            resolve(res);
          } else {
            //如果出现异常则弹出dialog
            wx.showModal({
              title: '提示',
              content: res.data.errCode + '系统异常',
              confirmColor: '#118EDE',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            });
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '服务器暂时无法连接',
            icon: 'loading',
            duration: 2000
          })
          reject(res);
        }
      });
    });
  },
  
  globalData: {
    exercisePostPaperFlag:true,//答题交卷开关，避免接口还没有返回多次点击交卷生效
    url:'http://192.168.100.132:8080/',
    imgurl:'http://192.168.100.132:8080/jeecg-boot/sys/common/view/',
    // url:'https://kaijin.zhoumc.cn/',
    // imgurl:'https://kaijin.zhoumc.cn/jeecg-boot/sys/common/view/',
    isshowggao:true
  }
})