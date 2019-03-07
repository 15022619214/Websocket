// pages/talk/talk.js
const app = getApp();
const util = require('../../utils/util.js')
var socketTask;
var socketOpen = false;
var userSocketList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userSocketList: [],
    sendMessage: '',
    height: 0,
    findU: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.onSocketOpen(function(res) {
      socketOpen = true;
      console.log('监听**[连接已打开]')
      console.log(res);
    })

    wx.onSocketClose(function() {
      socketOpen = false;
      console.log('监听**[连接已关闭]')
      console.log(res);
    })

    wx.onSocketError(function(res) {
      socketOpen = false;
      console.log('监听**[连接异常]')
      console.log(res);
    })

    var this_ = this;
    wx.onSocketMessage(function(res) {
      console.log('监听**[服务器返回消息]')
      userSocketList = this_.data.userSocketList;
      var json = JSON.parse(res.data);
      if (json.usercode == app.globalData.userCode) {
        json.use = 1;
      } else {
        json.use = 2;
      }
      userSocketList.push(json);
      this_.setData({
        userSocketList: userSocketList,
        findU: 'msg' + (userSocketList.length - 1)
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!socketOpen) {
      this.webSocket();
    }
    var this_ = this;
    wx.getSystemInfo({
      success: function(res) {
        this_.setData({
          height: res.windowHeight - 50,
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  webSocket: function() {
    socketTask = wx.connectSocket({
      url: app.globalData.webUrl,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log('已创建连接');
        console.log(res);
      },
      fail: function(err) {
        console.log('连接异常');
        console.log(err);
      }
    })
  },

  tasKform: function(res) {
    var this_ = this;
    let sendMsg = {
      usercode: app.globalData.userCode,
      userImg: app.globalData.userInfo.avatarUrl,
      msg: res.detail.value.taskval,
      msgTime: util.formatTime(new Date()),
      use: 0
    }
    wx.sendSocketMessage({
      data: JSON.stringify(sendMsg),
      success: function(res) {
        this_.setData({
          sendMessage: ''
        })
      }
    })
  }
})