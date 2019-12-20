<view hidden="{{!(!isStartGame && !isEndGame)}}">
    <view class="gameTop">
        <image class="avatar" style="width: 86rpx;height: 86rpx;border-radius: 50%;" src="{{avatarUrl}}"></image>
        <button class="animation-{{animation}}" open-type="share" style="margin:0;padding: 0;width: 50rpx;background: none;" bindtap="anishare">
            <image src="../../static/3-zhuanfa-1.png" style="width: 50rpx;height: 36rpx;"></image>
        </button>
    </view>
    <view>
        <image class="logo" src="../../static/game-logo.png"></image>
    </view>
    <view class="gameRule">
        <view style="color: #fcc200;font-size: 28rpx;">游戏规则：</view>
        <view style="margin-top: 13rpx;">在下面两类简史中选择你喜欢的一类，在两种发明中选择出现较早的那一种，看看45s内你能答对多少道，游戏错误题目上限为10道~</view>
    </view>
    <view style="margin: 23rpx auto;width: 550rpx;display: flex;justify-content: space-around;">
        <button bindtap="startivGame" class="startGamebtn {{animation}}">发明类</button>
        <button bindtap="startitGame" class="startGamebtn">互联网</button>
    </view>
</view>
