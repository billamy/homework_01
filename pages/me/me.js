/**
 * 作者：编程小石头
 * 微信：2501902696
 */
const app = getApp();
Page({
    // 页面的初始数据
    data: {
        isShowUserName: false,
        userInfo: null,
    },

    //退出登录
    tuichu() {
        wx.setStorageSync('user', null)
        this.setData({
            userInfo: null,
            isShowUserName: false
        })
    },
    goToMyOrder: function () {
        wx.navigateTo({
            url: '../myOrder/myOrder',
        })
    },

    goToMyComment: function () {
        wx.navigateTo({
            url: '../mycomment/mycomment?type=1',
        })
    },

    change() {
        wx.navigateTo({
            url: '../change/change',
        })
    },
    //去管理员页
    goAdmin() {
        wx.navigateTo({
            url: '../admin/admin',
        })
    },
    //去评论页面
    goCommentPage() {
        wx.navigateTo({
            url: '/pages/mycomment/mycomment?type=' + 1,
        })
    },
    //去我的排号页
    goToPaiHao() {
        wx.navigateTo({
            url: '/pages/paihao/paihao',
        })
    },
    onShow(options) {
        var user = app.globalData.userInfo;
        if (user && user.nickName) {
            this.setData({
                isShowUserName: true,
                userInfo: user,
            })
        }
    },

    /**
     * 获取头像昵称相关
     */


    /**
     * 关闭/打开弹框
     */
    closeTank(e) {

        if (!this.data.userInfo_tank) {
            wx.cloud.database().collection('user')
                .get({
                    success: res => {
                        console.log("用户信息====", res);
                        if (res.data.length) {
                            this.setData({
                                userInfo: res.data[0],
                                userInfo_tank: false,
                                isShowUserName: true
                            })
                            app.globalData.userInfo = res.data[0]
                            wx.setStorageSync('user', res.data[0]);
                        } else {
                            console.log("还未注册====", res)
                            this.setData({
                                userInfo_tank: true
                            })
                        }
                    }
                })
        } else {
            this.setData({
                userInfo_tank: false
            })
        }

    },
    /**
     * 获取头像
     */
    onChooseAvatar(e) {
        console.log(e);
        this.setData({
            avatarUrl: e.detail.avatarUrl
        })
    },
    /**
     * 获取用户昵称
     */
    getNickName(e) {
        console.log(e);
        this.setData({
            nickName: e.detail.value
        })
    },

    /**
     * 提交
     */
    submit(e) {
        if (!this.data.avatarUrl) {
            return wx.showToast({
                title: '请选择头像',
                icon: 'error'
            })
        }
        if (!this.data.nickName) {
            return wx.showToast({
                title: '请输入昵称',
                icon: 'error'
            })
        }
        this.setData({
            userInfo_tank: false
        })
        wx.showLoading({
            title: '正在注册',
            mask: 'true'
        })
        let tempPath = this.data.avatarUrl

        let suffix = /\.[^\.]+$/.exec(tempPath)[0];
        console.log(suffix);

        //上传到云存储
        wx.cloud.uploadFile({
            cloudPath: 'userimg/' + new Date().getTime() + suffix, //在云端的文件名称
            filePath: tempPath, // 临时文件路径
            success: res => {
                console.log('上传成功', res)
                let fileID = res.fileID
                wx.hideLoading()
                wx.cloud.database().collection('user')
                    .add({
                        data: {
                            avatarUrl: fileID,
                            nickName: this.data.nickName
                        }
                    }).then(res => {
                        let user = {
                            avatarUrl: fileID,
                            nickName: this.data.nickName
                        }
                        // 注册成功
                        console.log('注册成功')
                        wx.setStorageSync('user', user);
                        app.globalData.userInfo = user
                        this.setData({
                            userInfo: user,
                            isShowUserName: true
                        })
                    }).catch(res => {
                        console.log('注册失败', res)
                        wx.showToast({
                            icon: 'error',
                            title: '注册失败',
                        })
                    })

            },
            fail: err => {
                wx.hideLoading()
                console.log('上传失败', res)
                wx.showToast({
                    icon: 'error',
                    title: '上传头像错误',
                })
            }
        })
    },
})