<view class="container">
    <view class="top">
        <view style="font-size: 38rpx;font-family: AliHYAiHei;">请选择起始时间</view>
        <view class="pglist" id="sda">
            <view class="{{isAD ? 'switchyear' : 'switchyear_S'}}" bindtap="changetoBC">公元前</view>
            <view class="{{isAD ? 'switchyear_S' : 'switchyear'}}" bindtap="changetoAD">公元后</view>
            <view style="display: flex;align-items: center;"
                ><input
                    type="number"
                    data-name="startYear"
                    bindinput="updateValue"
                    value="{{startYear}}"
                    style="width: 100rpx;background-color: white;color: #a7a7a7;text-align: center;border: 1px solid #fcc200;font-family: Source Han Sans CN;"
                /><view style="margin-left: 10rpx;">年</view></view
            >
            <view class="startTlbtn" bindtap="startS">开始探寻</view>
        </view>
        <view style="margin-top: 28rpx;margin-bottom: 30rpx;width: 100%;display: flex;justify-content: flex-end;"
            ><image src="../../static/2-sousuo-1.png" style="width: 64rpx;height: 64rpx;text-align: right;" bindtap="toSearch"></image
        ></view>
    </view>

    <view class="canvasList" qq:for="{{canvasList}}" qq:for-index="key" qq:for-item="item">
        <canvas canvas-id="timeline-{{key}}" class="t-canvas" bindtouchstart="ctap" data-id="{{key}}"></canvas>
    </view>
</view>
<cover-view class="slide">
    <button bindtap="toTop" style="background: none;margin: 0;">
        <cover-image src="../../static/2-1-huidaodingbu.png" style="width: 64rpx;height: 54rpx;"></cover-image>
    </button>
    <button hidden="{{isIOS}}" style="background: none;margin: 0;" bindtouchstart="upStart" bindtouchend="upEnd">
        <cover-image src="../../static/2-1-huanye.png" style="width: 64rpx;height: 46rpx;"></cover-image>
    </button>
    <button hidden="{{isIOS}}" style="background: none;margin: 0;" bindtouchstart="downStart" bindtouchend="downEnd">
        <cover-image src="../../static/2-1-huanye-1.png" style="width: 64rpx;height: 46rpx;"></cover-image>
    </button>
</cover-view>
