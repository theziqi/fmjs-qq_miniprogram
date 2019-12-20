<view class="container">
    <image src="../../static/3-tubiaobeijing.png" style="width: 750rpx;height: 1210rpx;position: absolute;top: 0;z-index: -1;"></image>

    <view hidden>
        <view class="gameTop">
            <image class="avatar" style="width: 86rpx;height: 86rpx;border-radius: 50%;" src="{{avatarUrl}}"></image>
            <button open-type="share" style="margin:0;padding: 0;width: 50rpx;background: none;">
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
                <button bindtap="startivGame" class="startGamebtn">发明类</button>
                <button bindtap="startitGame" class="startGamebtn">互联网</button>
        </view>
    </view>

    <view hidden="{{isEndGame}}">
        <view class="gameTop">
            <image class="avatar" style="width: 86rpx;height: 86rpx;border-radius: 50%;" src="{{avatarUrl}}"></image>
            <view class="{{isClosetoEnd ? 'daojishi_c' : 'daojishi'}}">{{countDownNum}}<text style="color: #fcc200;">s</text></view>
        </view>
        <view class="gameShow">
            <view style="text-align: center;font-family: Source Han Sans CN;font-size: 32rpx;">以下哪个发明出现较早？</view>
            <view style="display: flex;justify-content: space-between;margin-top: 48rpx;">
                <button class="selectAnswer {{showS0}} {{animation0}}" data-id="0" bindtap="{{isfirstaction ? 'selectAnswer' : ''}}">
                    <view class="selectTitle {{selected!=null ? 'selectTitle_c' : ''}}">{{title0}}</view>
                    <view class="selectYear" hidden="{{selected==null}}">{{year0}}</view>
                    <view class="selectTip" hidden="{{selected==null}}">
                        <image style="width: 34rpx;height: 34rpx;" src="{{answer ? yesSrc : noSrc}}"></image>
                    </view>
                </button>
                <button class="selectAnswer {{showS1}} {{animation1}}" data-id="1" bindtap="{{isfirstaction ? 'selectAnswer' : ''}}">
                    <view class="selectTitle {{selected!=null ? 'selectTitle_c' : ''}}">{{title1}}</view>
                    <view class="selectYear" hidden="{{selected==null}}">{{year1}}</view>
                    <view class="selectTip" hidden="{{selected==null}}">
                        <image style="width: 34rpx;height: 34rpx;" src="{{!answer ? yesSrc : noSrc}}"></image>
                    </view>
                </button>
            </view>
            <view style="text-align: center;font-size: 40rpx;color: #fcc200;font-family: AliHYAiHei;line-height: 100rpx;">答对题目：{{score}}</view>
            <view style="color: red !important;text-align: center;font-size: 40rpx;color: #fcc200;font-family: AliHYAiHei;line-height: 100rpx;">答错题目：{{wrongcount}}</view>
        </view>
    </view>

    <view hidden="{{!isEndGame}}">
        <view class="gameTop">
            <image class="avatar" style="width: 86rpx;height: 86rpx;border-radius: 50%;" src="{{avatarUrl}}"></image>
        </view>
        <view class="showResult">
            <view class="t1">恭喜你答对了 <text class="wt">{{score}}</text> 道题目！</view>
            <view class="t1">超过了</view>
            <view style="width: 100%;height: 200rpx;margin-top: 16rpx;"><view class="ranking wt">{{percent}}%</view></view>
            <view class="t1" style="float: right;">的用户</view>
            <view style="display: flex;justify-content: space-between;margin-top: 85rpx;">
                <button class="recBtn" bindtap="rec">再次挑战</button>
                <button class="shareBtn" bindtap="showPoster">分享图片</button>
                <button class="shareBtn" open-type="share">分享链接</button>
            </view>

            <view class="t3">往下滑动回顾发明知识</view>
        </view>
        <view class="review">
            <view style="border-radius: 55rpx;z-index: -1;left: 64rpx;background-color: #4D6596;width: 622rpx;height: {{ 220 + 192 *  history.length}}rpx;position: absolute;"></view>
            <view class="t4">知识回顾</view>
            <view style="display: flex;align-items: center;">
                <view class="triangle"></view>
                <view style="z-index: 1;width: 100%;height: 0;border:1px dashed #ffeedf;"></view>
                <view class="r_triangle"></view>
            </view>
            <view class="reviewlist">
                <view class="reviewlistqustion" qq:for="{{history}}" qq:for-index="key" qq:for-item="item">
                    <view class="reqh">
                        <view class="reqhN">{{key + 1}}</view>
                        <view class="reqhD">
                            <view class="reqhDD"><text class="reqhD1">{{item.tp1.title}}</text><text class="reqhD2">{{item.tp1.year}}</text></view>
                            <view class="reqhDD"><text class="reqhD1">{{item.tp2.title}}</text><text class="reqhD2">{{item.tp2.year}}</text></view>
                        </view>
                        <view class="reqhA">{{item.answer ? '√' : 'X'}}</view>
                    </view>
                    <view style="display: flex;align-items: center;">
                        <view class="triangle"></view>
                        <view style="z-index: 1;width: 100%;height: 0;border:1px dashed #ffeedf;"></view>
                        <view class="r_triangle"></view>
                    </view>
                </view>
            </view>
        </view>
        <view style="width: 100%;height: 150rpx;">
        </view>
        <view hidden style="width: 576rpx;margin: 0 auto;">
            <view class="t5">想了解更多发明简史的详情吗？</view>
            <view class="searchTips">搜索你感兴趣的发明</view>
            <view class="searchBar">
            <input style="width: 460rpx;" value="{{sValue}}" bindinput="updateValue" data-name='sValue' bindconfirm="onSearch"></input>
            <image src="../../static/2-1-sousuo-1.png" style="margin-left: 28rpx;width: 64rpx;height: 64rpx;" bindtap="onSearch"></image>
            </view>
        </view>
    </view>

    <canvas class="shareCanvas" hidden="{{!showPosterImage}}" canvas-id="shareCanvas" style="width:750px;height:937px;top: 100%;left: 100%;">
    </canvas>

    <modal hidden="{{!showPosterImage}}" bindcancel="cancel" bindconfirm="confirm">
        <view style="text-align: center;">
            <image src="{{postUrl}}" style="width: 400rpx;height: 500rpx;margin: 0 auto;"></image>
        </view>
    </modal>
    
</view>