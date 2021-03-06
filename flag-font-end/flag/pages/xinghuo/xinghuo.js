var app = getApp();

Page({
  data: {
    name:'我要入驻',
    tips: '',
    status: '',
    content:''
  },
    onPullDownRefresh: function () {
        setTimeout(function(){
            wx.stopPullDownRefresh();
        },1000);
    },

  navigationto_coming: function(){
      var that = this;
      var status = this.data.status; // 获取当前页面的data
      if(status == 1|| that.data.name == '我要入驻'){
      wx.navigateTo({
          url: '../xinghuo_coming/xinghuo_coming',
      });
    }
      if(status == 0 && that.data.name == '申请状态'){
      wx.request({
        url: app.globalData.globalUrl + '/space/apply',
        method: 'GET',
        header: { 'Cookie':'JSESSIONID=' + app.globalData.globalSession },
        success: function (res) {
          console.log(res.data);
          if(res.data.data.state == 0){
            wx.showModal({
              title: '提示',
              //此时内容提示应该为res.data.message 不能为null 后面改
              content: '审核中',
              showCancel: false,
              confirmText: '我知道了'
            });
          }
          else if(res.data.data.state == 1){
            wx.showModal({
              title: '提示',
              content: '已通过',
              showCancel: false,
              confirmText: '我知道了'
            });

          }
          else {
            wx.showModal({
              title: '提示',
              content: '已拒绝 ',
              showCancel: false,
              confirmText: '我知道了'
            });
            that.setData({
                name: "我要入驻"
            });

           }
        }
    });
  }
},
  navigationto_comed:function(){
      wx.navigateTo({
          url: '../xinghuo_comed/xinghuo_comed',
      });
  },
  navigation:function(){
      wx.switchTab({
          url: '../index/index',
      });
  },
  onShow: function(){
        var that = this;
        wx.request({
            //判断用户是否存在未删除的入驻申请
            url: app.globalData.globalUrl + '/space/apply',
            method: 'GET',
            header: { 'Cookie':'JSESSIONID=' + app.globalData.globalSession },
            success: function(res){
            // console.log(res.data.status);
            if( res.statusCode == 200 ) { 
                if( res.data.data.state == null){
                    that.setData({
                        status: 1
                    })
                }
                if (res.data.data.state == 0 || res.data.data.state == 1)
                    that.setData({
                        name: '申请状态'
                    });
                if (that.data.status == 2)
                    that.setData({
                        name: "我要入驻"
                    });
            }
            }
      });
        wx.request({
            //获取后台老师上传的数据
            url: app.globalData.globalUrl + '/message/starSpace',
            method: 'GET',
            header: { 'Cookie':'JSESSIONID=' + app.globalData.globalSession },
            success: function( res ){
            if( res.statusCode == 200 ) {  
                that.setData({
                    tips: res.data.data
                });
            }
            }
        });
        // 版本更新
        const updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
                updateManager.onUpdateReady(function () {
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否重启当前小程序？',
                        success: function (res) {
                            if (res.confirm) {
                                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                updateManager.applyUpdate()
                            }
                        }
                    })

                })
            }
            // console.log(res.hasUpdate)
        })

        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
                title: '更新提示',
                content: '对不起！此次更新版本失败，请重启再试！',
            })
        })
  },
  onLoad: function(){
    wx.showShareMenu({
        withShareTicket: true
    });
    
  }
  
});
