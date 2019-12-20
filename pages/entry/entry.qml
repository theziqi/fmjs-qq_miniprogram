<view id="j_page">
    <view class="container">
        <view class="imgTop" wx:if="{{!isVote}}">
            <image style="width: 750rpx;height: 640rpx;" src="https://fmjs-1300735296.cos.ap-chengdu.myqcloud.com/img/{{title}}.jpg"></image>
        </view>
        <view class="e_content" wx:if="{{!isVote}}">
            <view class="contentTop">
                <view>
                    <view style="font-family: AliHYAiHei;font-size: 56rpx;">{{title}}</view>
                    <view style="font-size: 32rpx;color: grey;margin-top: 10rpx;">{{show}}</view>
                </view>
                <view style="display: flex;align-items: center;">
                    <button bindtap="changeLike" class="dsd">
                        <image src="{{isLike ? likeSrc : unlikeSrc}}" style="width: 50rpx;height: 50rpx;"></image>
                        <view>点赞 {{likeCount}}</view>
                    </button>
                    <button bindtap="onShare" class="dsd" open-type="share">
                        <image style="width: 50rpx;height: 36rpx;margin: 8rpx 0;" src="../../static/2-2-zhuanfa-1.png"></image>
                        <view>分享 {{shareCount}}</view>
                    </button>
                </view>
            </view>
            <view style="font-size: 28rpx;margin-top: 42rpx;font-family: Source Han Sans CN;line-height: 48rpx;">
                <rich-text nodes="{{content}}" hidden="{{!isshowAll}}"></rich-text>
                <view bindtap="showAll" hidden="{{isshowAll}}">{{convert_content}}<text style="color: blue;"> ... 展开全文</text></view>
            </view>
        </view>
        <view class="v_content" wx:if="{{isVote}}">
            <view class="title">{{title}}</view>
            <view class="opts">
                <view class="{{selectId === item.tpid ? 'opt_s' : 'opt' }}" qq:for="{{vote}}" qq:for-item="item" qq:key="index" data-tpid="{{item.tpid}}" bindtap="makeChoice">
                    <view wx:if="{{!isVoted}}">{{item.title}}</view>
                    <view wx:if="{{isVoted}}" style="width: 472rpx;display: flex;justify-content: space-between;">
                        <view>{{item.title}} <text wx:if="{{selectId === item.tpid}}">√</text></view>

                        <view style="font-size: 24rpx;color: #707070;"
                            ><text wx:if="{{selectId === item.tpid}}">{{item.vote + 1 }}</text><text wx:if="{{!(selectId === item.tpid)}}">{{item.vote}}</text>人</view
                        >
                    </view>
                </view>
            </view>
        </view>
        <view style="height:6px;border:none;border-top:1rpx solid #2d4068;width: 100%;"></view>
        <view>
            <view style="font-family: Source Han Sans CN;font-size: 20px;color: #2d4068;">评论</view>
            <view class="commentlist">
                <view class="comment" qq:for="{{cmlist}}" qq:for-index="key" qq:for-item="item">
                    <view class="commentContent">
                        <view class="nickname">{{item.nickname}}: <text class="text">{{item.comment}}</text></view>
                        <button class="delete" hidden="{{!item.delete}}" style="color: red;" bindtap="deleteComment" data-id="{{item.resid}}">删除</button>
                    </view>
                </view>
            </view>
            <view style="height: 60rpx;"></view>
        </view>
        <view class="sendComment">
            <input class="sCinput" placeholder="请输入评论" value="{{cmValue}}" data-name="cmValue" bindinput="updateValue" />
            <button class="sCbtn" bindtap="sendComment" disabled="{{disable}}">发布</button>
        </view>
    </view>
</view>
