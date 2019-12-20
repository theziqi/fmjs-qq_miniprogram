<view>
  <!--<view class="tabs-wrapper">
    <view class="tabs" style="z-index: 1" qq:for="{{tabList}}" qq:key qq:for-item="tab" bindtap="tabSelect" data-index="{{index}}">
        {{tab.title}}
        <view class="{{index === curTab ? 'selected' : ''}}"></view>
    </view>
  </view>-->
  <view hidden class="top2 shadow">
    <view class="{{isInvention ? 'selectedI' : ''}}" bindtap="changetoAdd">我要加词条</view>
    <view class="{{!isInvention ? 'selectedI' : ''}}" bindtap="changetoMine">我贡献的词条</view>
  </view>
  <view class="tab-add" qq:if="{{0 === curTab}}">
    <image src="../../../static/1-beijing-1.jpg" class="background" style="z-index: -1"></image>
    <view class="title">
      请输入发明简史中还未收录的词条
    </view>
    <view class="input-submit">
      <input auto-focus class="input" bindinput="input" value="{{input}}" />
      <view class="submit" bindtap="submit">提交</view>
    </view>
    <view class="divider"></view>
    <view class="thanks">
      感谢您的贡献，
    </view>
    <view class="thanks">
      以下词条正在收集中……
    </view>
    <view qq:for="{{contributionList}}" qq:key qq:for-item="item" class="item">
      <view class="left">
        <view class="label">{{item.recommand}}</view>
      </view>
      <view class="right">{{item.timestamp}}</view>
    </view>
  </view>
  <view class="tab" qq:if="{{1 === curTab}}">
    <view qq:for="{{contributionList}}" qq:key qq:for-item="item" class="item">
      <view class="left">
        <view class="label">{{item.title}}</view>
        <view>
          <text class="year">{{item.year}}</text>
          <text class="other">{{item.other}}</text>
        </view>
      </view>
      <view class="right">{{item.date}}</view>
    </view>
  </view>
</view>
