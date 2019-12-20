<view class="review">
    <view style="border-radius: 55rpx;z-index: -1;left: 64rpx;background-color: #4D6596;width: 622rpx;height: {{ 220 + 192 *  history.length}}rpx;position: absolute;"></view>
    <view class="t4">{{date}}</view>
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
