<view>
    <button wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo">获取头像昵称</button>
    <block wx:else>
        <image class="userinfo-avatar" src="{{userInfo.avatarUrl}}" mode="cover"></image>
    </block>
    <button class="animation-scale-up">123</button>
</view>
