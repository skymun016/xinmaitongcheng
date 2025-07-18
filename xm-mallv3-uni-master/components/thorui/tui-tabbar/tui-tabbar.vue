<template>
	<view class="tui-tabbar"
		:class="{ 'tui-tabbar-fixed': isFixed, 'tui-unlined': unlined, 'tui-backdrop__filter': backdropFilter }"
		:style="{ background: backgroundColor, zIndex: isFixed ? zIndex : 'auto' }">
		<block v-for="(item, index) in tabBar" :key="index">
			<view class="tui-tabbar-item" :class="{ 'tui-item-hump': item.hump }"
				:style="{ backgroundColor: item.hump && !backdropFilter ? backgroundColor : 'none' }"
				@tap="tabbarSwitch(index, item)">
				<view class="tui-icon-box" :class="{ 'tui-tabbar-hump': item.hump }">
					<image :src="current == item.pagePath ? item.selectedIconPath : item.iconPath"
						:class="[item.hump ? '' : 'tui-tabbar-icon']"></image>
					<view :class="[item.isDot ? 'tui-badge-dot' : 'tui-badge']"
						:style="{ color: badgeColor, backgroundColor: badgeBgColor }" v-if="item.num">
						{{ item.isDot ? '' : item.num }}
					</view>
				</view>
				<view class="tui-text-scale" :class="{ 'tui-text-hump': item.hump }"
					:style="{ color: current == item.pagePath ? selectedColor : color }">{{ item.text }}</view>
			</view>
		</block>
		<view :style="{ background: backgroundColor }" :class="{ 'tui-hump-box': hump }"
			v-if="hump && !unlined && !backdropFilter"></view>
	</view>
</template>

<script>
export default {
	name: 'tuiTabbar',
	props: {
		//当前索引
		current: {
			type: String,
			default: ''
		},
		//当前索引
		mo: {
			type: String,
			default: ''
		},
		pageid: {
			type: String,
			default: '-1'
		},
		//是否需要中间凸起按钮
		hump: {
			type: Boolean,
			default: false
		},
		//固定在底部
		isFixed: {
			type: Boolean,
			default: true
		},
		//tabbar
		// "pagePath": "/pagesA/my/my", 页面路径
		// "text": "thor", 标题
		// "iconPath": "thor_gray.png", 图标地址
		// "selectedIconPath": "thor_active.png", 选中图标地址
		// "hump": true, 是否为凸起图标
		// "num": 2,   角标数量
		// "isDot": true,  角标是否为圆点
		// "verify": true  是否验证  （如登录）

		//角标字体颜色
		badgeColor: {
			type: String,
			default: '#fff'
		},
		//角标背景颜色
		badgeBgColor: {
			type: String,
			default: '#F74D54'
		},
		unlined: {
			type: Boolean,
			default: false
		},
		//是否开启高斯模糊效果[仅在支持的浏览器有效果]
		backdropFilter: {
			type: Boolean,
			default: false
		},
		//z-index
		zIndex: {
			type: [Number, String],
			default: 99
		}
	},
	data() {
		return {
			tabBar: [],
			//字体颜色
			color: '#666',
			//字体选中颜色
			selectedColor: '#5677FC',
			//背景颜色
			backgroundColor: '#FFFFFF',
		};
	},
	watch: {
		current() { },
		mo() { }
	},
	mounted() {
		let _this = this
		_this.$request.post('bottommenu.list', {
			mo: _this.mo,
			pageid: _this.pageid
		}).then(res => {
			if (res.errno == 0) {
				_this.color = res.data.color;
				_this.selectedColor = res.data.selectedColor;
				_this.backgroundColor = res.data.backgroundColor;
				_this.tabBar = res.data.list;
			}
		})
	},

	methods: {
		tabbarSwitch(index, link) {
			var pagePath = link.pagePath;
			if (link.ptype == 'customurl') {
				if (link.zdyLinktype == 'wxapp') {
					uni.navigateToMiniProgram({
						appId: link.zdyappid,
						path: pagePath
					})
				} else if (link.zdyLinktype == 'web') {
					this.sam.navigateTo("/pages/webview/h5?url=" + pagePath);
				} else {
					this.sam.navigateTo(pagePath);
				}
			} else {
				if (pagePath.indexOf("?") != -1) {
					pagePath = pagePath + '&from=bottom'
				} else {
					pagePath = pagePath + '?from=bottom'
				}
				this.sam.navigateTo(pagePath);
			}
		}
	}
};
</script>

<style scoped>
.tui-tabbar {
	width: 100%;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
}

.tui-backdrop__filter {
	/* Safari for macOS & iOS */
	-webkit-backdrop-filter: blur(15px);
	/* Google Chrome */
	backdrop-filter: blur(15px);
}

.tui-tabbar-fixed {
	position: fixed;
	left: 0;
	bottom: 0;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	box-sizing: content-box !important;
}

.tui-tabbar::before {
	content: ' ';
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	transform: scaleY(0.5) translateZ(0);
	transform-origin: 0 0;
	display: block;
	z-index: 3;
}

.tui-tabbar-item {
	height: 100%;
	flex: 1;
	display: flex;
	text-align: center;
	align-items: center;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	padding: 10rpx 0;
	box-sizing: border-box;
	z-index: 5;
}

.tui-icon-box {
	position: relative;
}

.tui-item-hump {
	height: 98rpx;
}

.tui-tabbar-icon {
	width: 52rpx;
	height: 52rpx;
	display: block;
}

.tui-hump-box {
	width: 120rpx;
	height: 120rpx;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	top: -50rpx;
	border-radius: 50%;
	z-index: 4;
}

.tui-hump-box::after {
	content: ' ';
	height: 200%;
	width: 200%;
	border: 1px solid #b2b2b2;
	position: absolute;
	top: 0;
	left: 0;
	transform: scale(0.5) translateZ(0);
	transform-origin: 0 0;
	border-radius: 120rpx;
	box-sizing: border-box;
	display: block;
}

.tui-unlined::after {
	height: 0 !important;
}

.tui-tabbar-hump {
	width: 100rpx;
	height: 100rpx;
	position: absolute;
	left: 50%;
	-webkit-transform: translateX(-50%) rotate(0deg);
	transform: translateX(-50%) rotate(0deg);
	top: -40rpx;
	-webkit-transition: all 0.2s linear;
	transition: all 0.2s linear;
	border-radius: 50%;
	z-index: 5;
}

.tui-tabbar-hump image {
	width: 100rpx;
	height: 100rpx;
	display: block;
}

.tui-hump-active {
	-webkit-transform: translateX(-50%) rotate(135deg);
	transform: translateX(-50%) rotate(135deg);
}

.tui-text-scale {
	font-weight: bold;
	transform: scale(0.8);
	font-size: 25rpx;
	line-height: 28rpx;
	transform-origin: center 100%;
}

.tui-text-hump {
	position: absolute;
	left: 50%;
	bottom: 10rpx;
	transform: scale(0.8) translateX(-50%);
	transform-origin: 0 100%;
}

.tui-badge {
	position: absolute;
	font-size: 24rpx;
	height: 32rpx;
	min-width: 20rpx;
	padding: 0 6rpx;
	border-radius: 40rpx;
	right: 0;
	top: -5rpx;
	transform: translateX(70%);
	display: flex;
	align-items: center;
	justify-content: center;
}

.tui-badge-dot {
	position: absolute;
	height: 16rpx;
	width: 16rpx;
	border-radius: 50%;
	right: -4rpx;
	top: -4rpx;
}
</style>
