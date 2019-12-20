<view>
  <view class="date">
    <view class="year-month">
      <view>{{date.year}}年</view>
      <view>{{date.month}}月</view>
    </view>
    <view class="day">{{date.day}}</view>
  </view>

  <view class="swiper-wrapper" hidden bindtouchstart="touchStart" bindtouchend="touchEnd" bindtouchmove="touchMove">
    <view
      qq:for="{{swiperList}}"
      qq:for-item="item"
      qq:key="item.index"
      style="margin-left: {{item.marginLeft}}rpx;transform: scale({{item.scale}})"
      data-id="{{item.index}}"
      class="swiper-item"
      bindtap="toEntry"
    >
      <view class="card-header"> </view>
      <view class="card-content">
        <view class="question">
          {{item.content}}
        </view>
        <view class="opts">
          <view class="opt" qq:for="{{item.vote}}" qq:for-item="itemv" qq:key="itemv.index">
            {{itemv.title}}
          </view>
        </view>
      </view>
      <view class="card-bottom">
        <image src="../../static/4-jiantou.png" style="width: 38rpx;height: 44rpx;"></image>
      </view>
    </view>
  </view>

  <swiper class="card-swiper swiper-wrapper" circular="true" interval="5000" duration="500" bindchange="cardSwiper" indicator-color="#8799a3" indicator-active-color="#0081ff" current="{{startCur}}">
    <swiper-item qq:for="{{swiperList}}" qq:for-item="item" qq:key="index" data-id="{{index}}" class="{{cardCur==index?'cur':''}}" bindtap="{{item.inuse ? 'toEntry' : ''}}">
      <view class="swiper-item {{item.inuse ? '':'unuse'}}">
        <view class="card-header"> </view>
        <view class="card-content">
          <view class="question">
            {{item.content}}
          </view>
          <view class="opts">
            <view class="opt" qq:for="{{item.vote}}" qq:for-item="itemv" qq:key="itemv.index">
              <view wx:if="{{item.inuse}}">{{itemv.title}}</view>
              <view wx:if="{{!item.inuse}}" style="margin: 0 auto;width: 472rpx;display: flex;justify-content: space-between;">
                <view>{{itemv.title}}</view>

                <view style="font-size: 24rpx;color: #707070;"><text wx:if="{{!(selectId === index)}}">{{itemv.vote}}</text>人</view>
              </view>
            </view>
          </view>
        </view>
        <view class="card-bottom">
          <image src="../../static/4-jiantou.png" style="width: 38rpx;height: 44rpx;"></image>
        </view>
      </view>
    </swiper-item>
  </swiper>
</view>
