Page({
  data: {
    //店铺经纬度
    latitude: 28.218651,
    longitude: 112.918801,
    //标记点
    markers: [{
      id: 0,
      name: "清新风",
      address: "湖南工商大学萃雅食堂",
      latitude:  28.218651,
      longitude: 112.918801,
      width: 50,
      height: 50
    }]

  },
  //拨打电话
  Call() {
    wx.makePhoneCall({
      phoneNumber: '2501902696' //仅为示例，这个号码也是石头哥的微信号
    })
  },
  //复制微信
  Copy() {
    wx.setClipboardData({
      data: '2501902696',
    })
  },
  //导航
  navRoad(event) {
    console.log(event)
    wx.getLocation({ //获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: event.currentTarget.dataset.marker.latitude, //要去的纬度-地址
          longitude: event.currentTarget.dataset.marker.longitude, //要去的经度-地址
          name: event.currentTarget.dataset.marker.name,
          address: event.currentTarget.dataset.marker.address
        })
      },
      fail: res => {
        console.log('授权失败', res)
        wx.showModal({
          title: '需要授权位置信息',
          success: res => {
            if (res.confirm) {
              wx.openSetting()
            }
          }
        })
      }
    })
  }
})