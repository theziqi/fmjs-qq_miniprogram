<view>
    <view class="cards">
        <view class="card" qq:for="{{showList}}" qq:for-index="key" qq:for-item="item" bindtap="toEntry" data-id="{{item.id}}" data-type="{{item.type}}">
            <view class="card-content">
                <view style="font-family: AliHYAiHei;">{{item.title}}</view>
                <view style="font-size: 15px;color: #707070;margin-top: 6rpx;">{{item.show}}</view>
                <view style="font-size: 15px;margin-top: 23rpx;">{{item.content}}</view>
                <view class="likelist">
                    <view class="likes">{{item.like}}点赞</view>
                    <view class="likes">{{item.comments}}评论</view>
                </view>
            </view>
            <view class="card-img">
                <image style="width: 258rpx;height: 150rpx;" src="https://fmjs-1300735296.cos.ap-chengdu.myqcloud.com/img/{{item.title}}.jpg"></image>
            </view>
        </view>
    </view>
</view>
