<template>
	<view class="container">
	<!-- #ifdef MP -->
	<view v-if="dataList.length > 0">
		<view class="live-wrapper-b">
			<navigator class="live-item-b" v-for="(item,index) in dataList" :key="index"
				:url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + item.room_id+'&custom_params='+custom_params"
				hover-class="none" :style="[{'background':bg},{'box-shadow':`0px 1px 20px ${boxShadow}`}]">
				<view class="img-box">
					<view class="label bgblue" v-if="item.live_status == 102">
						<view class="txt">预告</view>
						<view class="msg">{{item.show_time}}</view>
					</view>
					<view class="label bggary" v-if="item.live_status==103">
						<image src="/static/images/live-02.png" mode="" style="width: 20rpx; height: 20rpx;"></image>
						<text>回放</text>
					</view>
					<view class="label bgred" v-if="item.live_status==101">
						<image src="/static/images/live-01.png" mode="" style="width: 21rpx; height: 22rpx;"></image>
						<text>进行中</text>
					</view>
					<image :src="item.share_img"></image>
				</view>
				<view class="info">
					<view class="title line1">{{item.name}}</view>
					<view class="people">
						<image :src="item.anchor_img" alt="">
							<text>{{item.anchor_name}}</text>
					</view>
				</view>
			</navigator>
		</view>
	</view>
	<!-- #endif -->
	<tui-tabbar :current="current" backgroundColor="#FFFFFF" color="#666" selectedColor="#EB0909">
	</tui-tabbar>
	</view>
</template>

<script>
	var app = getApp();
	export default {
		data() {
			return {
				current: '',
				dataList: [],
				cityName: '',
				navH: "",
				is_switch: false,
				where: {
					cid: 0,
					keyword: '',
					priceOrder: '',
					salesOrder: '',
					news: 0,
					page: 1,
					limit: 10,
					latitude: "",
					longitude: ""
				},
				price: 0,
				stock: 0,
				nows: false,
				loadend: false,
				loading: false,
				bottommenulist: [],
				host_product: "",
				title: "",
				position: "",
				latitude: "",
				longitude: "",
				cid: ""
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			const _this = this;
			// #ifdef MP-WEIXIN
			this.current = "/" + this.__route__;
			// #endif
			//#ifdef H5
			this.current = this.$route.path;
			//#endif

			_this.$request.post('Config.audit', {
				samkey: (new Date()).valueOf()
			}).then(res => {
				if (res.data.is_submitaudit != 1) {
					uni.setNavigationBarTitle({
						title: "直播"
					});
				}
			});
			
			_this.get_data_list();
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			
			this.where.page = 1;
			this.loadend = false;
			this.dataList = [];
			this.get_data_list();
			uni.stopPullDownRefresh();
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.get_data_list();
		},
		methods: {
			onChangePosition: function(e) {
				const _this = this;
				uni.chooseLocation({
					success(res) {
						_this.cityName = res.name;
						uni.setStorageSync('cityName', _this.cityName);
						_this.position = res.address;
						_this.where.latitude = res.latitude;
						_this.where.longitude = res.longitude;
						
						_this.loadend = false;
						_this.latitude = res.latitude;
						_this.longitude = res.longitude;
						_this.get_data_list(true);
					}

				});
			},

			Changswitch: function() {
				var that = this;
				that.is_switch = !this.is_switch;
			},
			searchSubmit: function(e) {
				var that = this;
				that.where.keyword = e.detail.value;
				that.where.page = 1;
				that.loadend = false;
				this.get_data_list(true);
			},
			//点击事件处理
			set_where: function(e) {
				this.cid = e.currentTarget.dataset.cid;
				this.loadend = false;
				this.where.page = 1;
				
				this.get_data_list(true);
			},
			//设置where条件
			setWhere: function() {
				this.where.salesOrder = 'asc';

				if (this.cid) {
					this.where.cid = this.cid;
				}
			},
			get_data_list: function(isPage) {
				var that = this;
				this.setWhere();
				if (that.loadend) return;
				if (that.loading) return;
				if (isPage === true) 
				{
					that.dataList = [];
					that.where.page =1;
				}

				//console.log(that.where);
				that.$request.post('Liveroom.index', that.where).then(res => {
					var dataList = res.data;
					console.log(dataList);
					var loadend = dataList.length < that.where.limit;
					that.where.page = that.where.page + 1;
					that.loadend = loadend;
					that.loading = false;
					that.dataList = that.dataList.concat(res.data.data);
				});
			}
		}
	};
</script>
<style lang="scss">
	.live-wrapper {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: 16rpx;

		image {
			width: 100%;
			height: 400rpx;
		}

		.live-top {
			z-index: 20;
			position: absolute;
			left: 0;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			width: 180rpx;
			height: 54rpx;
			border-radius: 0rpx 0px 18rpx 0px;

			image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
				/* #ifdef H5 */
				display: block;
				/* #endif */
			}
		}

		.live-title {
			position: absolute;
			left: 0;
			bottom: 6rpx;
			width: 100%;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			font-size: 30rpx;
			color: #fff;
			background: rgba(0, 0, 0, 0.35);
		}

		&.mores {
			width: 100%;

			.item {
				position: relative;
				width: 320rpx;
				display: inline-block;
				border-radius: 16rpx;
				overflow: hidden;
				margin-right: 20rpx;

				image {
					width: 320rpx;
					height: 180rpx;
					border-radius: 16rpx;
					object-fit: cover;
				}

				.live-title {
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					font-size: 22rpx;
				}

				.live-top {
					width: 120rpx;
					height: 36rpx;
					font-size: 22rpx;

					image {
						width: 20rpx;
						height: 20rpx;
					}
				}
			}
		}
	}

	.live-wrapper-a {
		padding: 0rpx 20rpx 0;

		.live-item-a {
			display: flex;
			background: #fff;
			margin-bottom: 20rpx;
			border-radius: 16rpx;
			overflow: hidden;

			&:last-child {
				margin-bottom: 0;
			}

			.img-box {
				position: relative;
				width: 340rpx;
				height: 270rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 15rpx 20rpx;

				.title {
					font-size: 30rpx;
					color: #333;
				}

				.people {
					display: flex;
					align-items: center;
					color: #999;
					font-size: 24rpx;
					margin-top: 10rpx;

					image {
						width: 32rpx;
						height: 32rpx;
						border-radius: 50%;
						margin-right: 10rpx;
					}
				}

				.goods-wrapper {
					display: flex;

					.goods-item {
						position: relative;
						width: 96rpx;
						height: 96rpx;
						margin-right: 20rpx;
						overflow: hidden;
						border-radius: 16rpx;

						&:last-child {
							margin-right: 0;
						}

						image {
							width: 100%;
							height: 100%;
							border-radius: 16rpx;
						}

						.bg {
							position: absolute;
							left: 0;
							top: 0;
							width: 100%;
							height: 100%;
							border-radius: 16rpx;
							background: rgba(0, 0, 0, 0.3);
						}

						text {
							position: absolute;
							left: 0;
							bottom: 0;
							width: 100%;
							height: 60rpx;
							line-height: 70rpx;
							color: #fff;
							background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.75) 100%);
						}

						.num {
							display: flex;
							align-items: center;
							justify-content: center;
							position: absolute;
							left: 0;
							top: 0;
							width: 100%;
							height: 100%;
							background: rgba(0, 0, 0, 0.3);
							color: #fff;
							font-size: 28rpx;
						}
					}
				}

				.empty-goods {
					width: 96rpx;
					height: 96rpx;
					border-radius: 6rpx;
					background-color: #B2B2B2;
					color: #fff;
					font-size: 20rpx;
					text-align: center;
					line-height: 96rpx;
				}
			}
		}

		&.live-wrapper-c {
			.live-item-a {
				display: flex;
				flex-direction: column;

				.img-box {
					width: 100%;
					border-radius: 8px 8px 0 0;
				}

				.info {
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex-direction: initial;

					.left {
						width: 69%;
					}

					.goods-wrapper {
						flex: 1;
					}
				}
			}
		}
	}

	.live-wrapper-b {
		padding: 20rpx 20rpx 0;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.live-item-b {
			width: 345rpx;
			background-color: #fff;
			border-radius: 16rpx;
			overflow: hidden;
			margin-bottom: 20rpx;
			overflow: hidden;

			.img-box {
				position: relative;

				image {
					width: 100%;
					height: 190rpx;
				}
			}

			.info {
				display: flex;
				flex-direction: column;
				padding: 20rpx;

				.title {
					font-size: 30rpx;
					color: #333;
				}

				.people {
					display: flex;
					margin-top: 10rpx;
					color: #999;

					image {
						width: 36rpx;
						height: 36rpx;
						border-radius: 50%;
						margin-right: 10rpx;
					}
				}
			}
		}
	}

	.label {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 20rpx;
		top: 20rpx;
		border-radius: 22rpx 0px 22rpx 22rpx;
		font-size: 24rpx;
		color: #fff;

		image {
			margin-right: 10rpx;
		}

		text {
			font-size: 22rpx;
		}
	}

	.bgred {
		width: 132rpx;
		height: 38rpx;
		background: linear-gradient(270deg, #F5742F 0%, #FF1717 100%)
	}

	.bggary {
		width: 108rpx;
		height: 38rpx;
		background: linear-gradient(270deg, #999999 0%, #666666 100%)
	}

	.bgblue {
		width: 220rpx;
		height: 38rpx;
		// background: rgba(0,0,0,0.36);
		background: linear-gradient(80deg, #2FA1F5 0%, #0076FF 5%, rgba(0, 0, 0, 0.36) 100%);
		overflow: hidden;

		.txt {
			position: relative;
			left: -5rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 38px;
			height: 100%;
			text-align: center;
			// background: linear-gradient(270deg, #2FA1F5 0%, #0076FF 100%);
		}
	}

	.title-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		font-size: 32rpx;

		.more {
			display: flex;
			align-items: center;
			justify-content: center;

			font-size: 26rpx;
			color: #666;

			.iconfont {
				font-size: 26rpx;
				margin-top: 8rpx;
			}
		}
	}

	.empty-txt {
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 24rpx;
		color: #999;
	}
</style>
