<view hidden="{{isfirst}}" class="container tts" >
    <view style="width: 100%;height: 91rpx;"></view>
    <view style="width: 100%;" >
        <view hidden="{{!isTimeline}}">
            <view class="top">
                <view style="font-size: 38rpx;font-family: AliHYAiHei;">请选择起始时间</view>
                <view class="pglist" id="sda">
                    <view hidden="{{!isInvention}}" class="{{isAD ? 'switchyear' : 'switchyear_S'}}" bindtap="changetoBC">公元前</view>
                    <view class="{{isAD ? 'switchyear_S' : 'switchyear'}}" bindtap="changetoAD">公元后</view>
                    <view style="display: flex;align-items: center;"><input
                            type="number"
                            data-name="startYear"
                            bindinput="updateValue"
                            value="{{startYear}}"
                            style="z-index: 0;width: 100rpx;background-color: white;color: #a7a7a7;text-align: center;border: 1px solid #fcc200;font-family: Source Han Sans CN;"
                        /><view style="margin-left: 10rpx;">年</view></view>
                    <button class="startTlbtn" bindtap="startS">开始探寻</button>
                </view>

            <view class="canvasList" qq:for="{{canvasList}}" qq:for-index="key" qq:for-item="item" hidden="{{hideCanvas}}">
                <canvas canvas-id="timeline-{{key}}" class="t-canvas" bindtouchstart="ctap" data-id="{{key}}" wx:if="{{!radarImg[key]}}"></canvas>
                <image wx:else src="{{radarImg[key]}}" style="width: 260px; height: 180px;" />
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

    </view>


    <view class="cards" hidden="{{isTimeline}}">
            <view class="card" qq:for="{{showList}}" qq:for-index="key"  qq:for-item="item" bindtap="toEntry" data-id="{{item.id}}">
                <view class="card-content">
                    <view style="font-family: AliHYAiHei;font-size: 44rpx;">{{item.title}}</view>
                    <view style="font-size: 26rpx;color: #707070;margin-top: 6rpx;">{{item.show}}</view>
                    <view style="font-size: 28rpx;margin-top: 23rpx;color: #3f3f3f;">{{item.content}}</view>
                    <view class="likelist">
                        <view class="likes">{{item.like}}点赞</view>
                        <view class="likes">{{item.comments}}评论</view>
                    </view>
                </view>
            </view>
    </view>
</view>

    <cover-view class="sTop">
            <cover-view hidden class="top1">
                <cover-view class="searchBar" bindtap='tapInput'>
                    <input style="margin-left: 18rpx;width: 460rpx;font-family: AliHYAiHei;font-size: 36rpx;line-height: 48rpx;z-index: 1000;" value="{{sValue}}" placeholder="搜索你感兴趣的发明" bindinput="updateValue" focus="{{inputFocus}}" bindblur="blurInput" data-name='sValue' bindconfirm="onSearch"></input>
                    <button bindtap="onSearch" style="margin: 0;background: none;"><cover-image src="../../static/1-sousuo.png" style="margin-right: 23rpx;width: 45rpx;height: 45rpx;" ></cover-image></button>
                </cover-view>
            </cover-view>
            <cover-view class="top2 shadow">
                <cover-view hidden>
                    <button bindtap="changeTS">
                        <cover-image src="../../static/1-back-1.png" style="width: 50rpx;height: 36rpx;"></cover-image>
                    </button>
                </cover-view>
                <cover-view class="{{isInvention ? 'selectedI' : ''}}" bindtap="changetoInvention">发明简史<cover-view></cover-view></cover-view>
                <cover-view class="{{!isInvention ? 'selectedI' : ''}}"  bindtap="changetoInternet">互联网简史</cover-view>
            </cover-view>
    </cover-view>
</view>

<view bindtap="changeYDT" style="position: fixed;width: 100%;height: 100%;top: 0;" wx:if="{{isfirst}}">
    <image src="{{yingdaotu}}" style="width: 100%;height: 100%;"></image>
</view>