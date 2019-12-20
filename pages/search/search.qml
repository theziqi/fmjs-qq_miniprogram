<view class="container">
        <view hidden="{{isEntries}}">
            <view class="searchTips">搜索你感兴趣的发明</view>
            <view class="searchBar">
                <input style="width: 460rpx;" value="{{sValue}}" bindinput="updateValue" bindfocus="inputing" bindblur="uninputed" data-name='sValue'></input>
                <image src="../../static/2-1-sousuo-1.png" style="margin-left: 28rpx;width: 64rpx;height: 64rpx;" bindtap="onSearch"></image>
            </view>
        </view>
        <view class="cards">
            <view class="card" qq:for="{{showList}}" qq:for-index="key"  qq:for-item="item" bindtap="toEntry" data-id="{{item.id}}">
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
        <view class="bottom" hidden="true">
            <image src="../../static/2-1-luyin-1.png" style="width: 34rpx;height: 50rpx;margin: 0 8rpx;"></image>
            <view>按住说话，搜索一下</view>
        </view>
</view>

