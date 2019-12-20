<view>
    <view class="cu-timeline">
        <view class="cu-item text-white" qq:for="{{gamelist}}" qq:for-index="index" qq:for-item="item" >
            <view class="gamecontent content" bindtap="toHistory"  data-id="{{index}}">
                <view class="gameinfo">
                    <view class="date">{{item.timestamp}}</view>
                    <view style="colr: #fefefe;">|</view>
                    <view class="dts">答对 <text class="score"> {{item.score}} </text> 道</view>
                </view>
            </view>
        </view>
    </view>
</view>
