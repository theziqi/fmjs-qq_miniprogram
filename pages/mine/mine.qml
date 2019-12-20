<view>
  <!-- 积分规则模态框 -->
  <view class="cu-modal {{showCreditRule ? 'show' : ''}}">
    <view class="cu-dialog rule">
      <view class="cu-bar justify-end">
        <view class="action">
          <text class="cuIcon-close" style="font-size: 40rpx; font-weight: 800" bindtap="closeCreditRule"></text>
        </view>
      </view>
      <view>
        <image src="../../static/rule.png" style="width: 527rpx;height: 866rpx;z-index: 30;"></image>
      </view>
    </view>
  </view>
  <!-- 签到对话框 -->
  <view class="{{showSignin ? 'signin' : 'hidden'}}">今天已经签到过了</view>
  <!-- 活动报名模态框 -->
  <view class="cu-modal {{showActivity ? 'show' : ''}}">
    <view class="cu-dialog activity">
      <view class="cu-bar justify-end">
        <view class="action">
          <text class="cuIcon-close" style="font-size: 40rpx; font-weight: 800" bindtap="closeSignup"></text>
        </view>
      </view>
      <view class="signin-title">
        <text hidden="{{isInvited}}">参与活动需要填写以下信息，以便我们联系到您</text>
        <text hidden="{{!isInvited}}">通过邀请码和QQ群号入群</text>
      </view>
      <view hidden="{{isInvited}}" class="signin-form">
        <form bindsubmit="infoSubmit">
          <view class="form-line">
            <view class="line-title">姓名</view>
            <input class="line-input" name="name" />
          </view>
          <view class="form-line">
            <view class="line-title">手机</view>
            <input class="line-input" name="phonenumber" type="number" />
          </view>
          <view class="form-line">
            <view class="line-title">QQ号</view>
            <input class="line-input" name="qqnumber" type="number" />
          </view>
          <button class="line-btn" formType="submit">确认报名</button>
        </form>
      </view>
      <view hidden="{{!isInvited}}">
        <view class="form-line">
          <view class="line-title">邀请码</view>
          <input class="line-input" value="{{invitenumber}}"/>
        </view>
        <view hidden class="form-line">
          <view class="line-title">QQ群</view>
          <input class="line-input" value="{{qqgroupnumber}}" />
        </view>
        <button class="line-btn" wx:if="{{isInvitedWriter}}" bindtap="copyCode" style="font-size: 30rpx;" open-type="openGroupProfile" group-id="{{qqgroupnumber}}">复制邀请码进群</button>
      </view>
    </view>
  </view>
  <view class="header">
    <button wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo">获取头像昵称</button>
    <block wx:else>
      <image class="bgpic" src="../../static/0-beijing-1.jpg"></image>
      <image class="gravatar" src="{{userInfo.avatarUrl}}" mode="cover"></image>
      <view class="userinfo">
        <view class="nickname">{{user.nickname}}</view>
        <view class="level">等级：{{touxian[user.level]}}</view>
        <view class="points">
          <view>积分：{{user.points}} </view>
          <image src="../../static/5-guize.png" bindtap="showCreditRule" style="margin-left: 20rpx;width: 50rpx;height: 50rpx;"></image>
        </view>
        
      </view>
      <view>
        <form bindsubmit="signin" report-submit='true'>
        <view  class="siginbox">
          <view>
            <button class="calendar" style="background: none;margin:0;padding:0;width: 86rpx;height: 86rpx;" form-type="submit">
            <image style="width: 86rpx;height: 86rpx;" src="{{signin ? signinsrc : nosigninsrc}}"></image>
        </button>
        </view>
          <view class="points" style="margin-top: 20rpx;">连续签到{{continous}}天</view>
          </view>
        </form>
      </view>
    </block>
  </view>
  <view class="item-list">
    <view class="item" qq:for="{{itemList}}" qq:for-item="item" bindtap="toOtherPage" data-route="{{item.route}}">
      <image class="icon" src="{{item.icon}}"></image>
      <view class="desc">{{item.desc}}</view>
    </view>
    <button class="item tucao" style="padding-left: 0;" open-type="feedback">
      <image class="icon" src="../../static/5-tucao@2x.png"></image>
      <view class="desc">吐个槽</view>
    </button>
  </view>
  <view class="swiper-wrapper">
    <view class="desc">点击图片参与活动</view>
    <view style="position: relative">
      <swiper indicator-dots="true" current="{{curActivity}}" style="height: 360rpx">
        <block qq:for="{{imgUrls}}" qq:key="index">
          <swiper-item>
            <image src="{{item}}" mode="scaleToFill" style="width: 750rpx; height: 360rpx" bindtap="showActivity" data-id="{{index}}" />
          </swiper-item>
        </block>
      </swiper>
      <image src="../../static/5-shangyizhang@2x.png" style="visibility: {{curActivity > 0 ? '' : 'hidden'}}" class="left-img" bindtap="toLeft"></image>
      <image src="../../static/5-xiayizhang@2x.png" style="visibility: {{curActivity < imgUrls.length - 1 ? '' : 'hidden'}}" class="right-img" bindtap="toRight"></image>
    </view>
  </view>
</view>
