<template>
	<view class="container">
		<view class="tui-news-title">{{detail.title}}</view>
		<view class="tui-sub-info">
			<view class="tui-sub-left">
				<text class="tui-author">{{detail.cate}}</text>
				<text>{{detail.create_time}}</text>
			</view>
			<view class="tui-sub-right">阅读 2453</view>
		</view>
		<view class="tui-news-content">
			<uParse :html="detail.content" ref="article" :tag-style="tagStyle"></uParse>
		</view>
		<!--加载loadding-->
		<tui-loadmore v-if="loadding" :index="3" type="primary"></tui-loadmore>
		<tui-nomore v-if="!pullUpOn" backgroundColor="#fff" text="没有更多评论"></tui-nomore>
		<!--加载loadding-->
		<view class="tui-safearea-bottom"></view>
	</view>
</template>

<script>
import uParse from '@/components/jyf-parser/jyf-parser';
export default {
	components: {
		uParse
	},
	data() {
		return {
			detail:{},
			fabulous: 123,
			isFabulous: false,
			isCollection: false,
			pageIndex: 1,
			loadding: false,
			pullUpOn: true
		}
	},
	onLoad: function(e) {
		let _this = this;
		_this.$request.get('article.detail', {
			id: e.id,
			showLoading:true
		}).then(res => {
			//console.log(res);
			if (res.errno == 0) {
				_this.detail = res.data;
			}
		});
	},
	computed: {
		iconColor() {
			return this.isFabulous ? '#5677fc' : '#333'
		},
		itemIconColor() {
			return function(isFabulous) {
				return isFabulous ? '#5677fc' : '#9a9a9a'
			}
		},
		iconName() {
			return function(isFabulous) {
				return isFabulous ? 'agree-fill' : 'agree'
			}
		}
	},
	methods: {
		btnFabulous: function() {
			this.fabulous = this.isFabulous ? 123 : 124;
			this.isFabulous = !this.isFabulous
		},
		collection: function() {
			this.isCollection = !this.isCollection
			if (this.isCollection) {
				this.tui.toast("收藏成功！");
			}
		},
		btnCmt: function() {
			uni.navigateTo({
				url: '../comment/comment'
			})
		},
		cmtAll: function() {
			uni.navigateTo({
				url: '../commentList/commentList'
			})
		},
		cmtReply: function() {
			uni.navigateTo({
				url: '../commentReply/commentReply'
			})
		}
	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {
		setTimeout(() => {
			uni.stopPullDownRefresh()
		}, 200);
	},
}
</script>

<style>
page {
	background: #fff;
	color: #333;
}

.container {
	padding: 40rpx 30rpx 110rpx 30rpx;
	box-sizing: border-box;
}

.tui-news-title {
	font-size: 48rpx;
	font-weight: 500;
	text-align: justify;
}

.tui-sub-info {
	padding-top: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	color: #999;
}

.tui-author {
	color: #5677fc;
	padding-right: 20rpx;
}

.tui-news-content {
	padding-top: 40rpx;
}

.tui-article {
	/* text-indent: 2em; */
	font-size: 34rpx;
	padding-bottom: 40rpx;
	line-height: 60rpx;
	text-align: justify;
	word-break: break-all;
	word-wrap: break-word;
}

.tui-article-pic {
	width: 100%;
	display: block;
	margin-bottom: 40rpx;
}

.tui-news-source {
	font-size: 24rpx;
	color: #999;
}

.tui-operate-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 60rpx 40rpx;
	box-sizing: border-box;
}

.tui-black {
	color: #333;
	padding-left: 12rpx;
}

.tui-cmt-title {
	font-size: 30rpx;
	font-weight: bold;
	position: relative;
}

.tui-cmt-title::after {
	content: '';
	position: absolute;
	left: -18rpx;
	top: 18%;
	width: 6rpx;
	height: 64%;
	background: #5677fc;
}

.tui-cmtbox {
	padding-bottom: 20rpx;
}

.tui-cmt-cell {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding-top: 44rpx;
}

.tui-avatar {
	width: 64rpx;
	height: 64rpx;
	border-radius: 32rpx;
	display: block;
	flex-shrink: 0;
}

.tui-cmt-detail {
	width: 100%;
	padding-left: 16rpx;
	box-sizing: border-box;
}

.tui-header-box {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	font-size: 30rpx;
}

.tui-cmt-nickname {
	color: #5677fc;
}

.tui-fabulous {
	color: #9a9a9a;
}

.tui-fabulous text {
	padding-right: 4rpx;
	font-size: 24rpx;
}

.tui-cmt-content {
	font-size: 32rpx;
	color: #333;
	text-align: justify;
	padding-top: 8rpx;
	word-break: break-all;
	word-wrap: break-word;
}

.tui-reply-box {
	border-radius: 8rpx;
	overflow: hidden;
	margin-top: 16rpx;
}

.tui-cell-last {
	display: flex;
	align-items: center;
	word-wrap: break-word;
	color: #5677fc;
}
.tui-flex-1 {
	flex: 1;
	width: 100%;
}

.tui-reply-nickname {
	font-size: 24rpx;
	color: #7a7a7a;
	padding-bottom: 8rpx;
}

.tui-footer {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	margin-top: 16rpx;
	color: #9a9a9a;
}

.tui-primary {
	color: #5677fc !important;
}

.tui-ml {
	margin-left: 16rpx;
}

.tui-operation {
	width: 100%;
	height: 100rpx;
	overflow: hidden;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 99999;
	padding-bottom: env(safe-area-inset-bottom);
}

.tui-safearea-bottom {
	width: 100%;
	height: env(safe-area-inset-bottom);
}

.tui-operation::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	border-top: 1rpx solid #eaeef1;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
}

.tui-operation-left {
	display: flex;
	align-items: center;
}

.tui-operation-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	position: relative;
}

.tui-operation-right {
	height: 100rpx;
	box-sizing: border-box;
	padding-top: 0;
}

.tui-right-flex {
	display: flex;
	align-items: center;
	justify-content: center;
}

.tui-btn-comment {
	height: 64rpx;
	width: 84%;
	background: #ededed;
	color: #999;
	border-radius: 8rpx;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	padding-left: 20rpx;
	box-sizing: border-box;
	padding-top: 0;
	margin-left: 30rpx;
}

.tui-col-7 {
	width: 58.33333333%;
}

.tui-col-5 {
	width: 41.66666667%;
}

.tui-share-btn {
	display: block;
	background: none;
	margin: 0;
	padding: 0;
}
</style>
