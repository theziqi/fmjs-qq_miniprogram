<view class="container">
  <image src="../../static/1-tubiaobeijing.png" style="width: 750rpx;height: 1210rpx;position: absolute;top: 0;"></image>
  <view class="userinfo">
    <button hidden wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo">获取头像昵称</button>
    <block wx:else>
      <image hidden class="userinfo-avatar" src="{{userInfo.avatarUrl}}" mode="cover"></image>
    </block>
    <view class="showt">
      <view>
        <image bindtap="toTimeline" src="../../static/index-logo.png" class="ictn"></image>
      </view>
      <view hidden class="ibtn" bindtap="toTimeline"><image src="../../static/1-anniu-1.png" style="position: absolute;width: 624rpx;height: 96rpx;z-index: 0;"></image><view style="z-index: 1;">探寻简史</view></view>
      <view hidden class="ibtn" bindtap="toGame"><image src="../../static/1-anniu-1.png" style="position: absolute;width: 624rpx;height: 96rpx;z-index: 0;"></image><view style="z-index: 1;">小游戏</view></view>
    </view>
  </view>
</view>
