<template>
	<view class="container" style="background-color: #ffffff;padding-bottom: 100rpx;">
		<form @submit="bindSave">
			<view v-if="config.logo" class="login-logo">
				<image style="width: 300rpx;height: 300rpx;" :src="config.logo"></image>
			</view>
			<view class="tui-form">
				<view v-if="memberconfig.sms_status==1" class="tui-view-input">
					<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
						<view class="tui-cell-input">
							<tui-icon name="mobile" color="#6d7a87" :size="20"></tui-icon>
							<input name="userphone" v-model="phone" :adjust-position="false" placeholder="手机号"
								placeholder-class="tui-phcolor" type="text" />
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
						<view class="tui-cell-input">
							<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
							<input name="captcha" v-model="captcha" :adjust-position="false" placeholder="验证码"
								placeholder-class="tui-phcolor" type="text" />
							<button class="code font-num" :class="disabled === true ? 'on' : ''" :disabled='disabled'
								@click="makecaptcha">
								{{verifyCodetext}}
							</button>
						</view>
					</tui-list-cell>
				</view>
				<view v-else class="tui-view-input">
					<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
						<view class="tui-cell-input">
							<tui-icon name="people" color="#6d7a87" :size="20"></tui-icon>
							<input name="username" :adjust-position="false" placeholder="手机号/用户名"
								placeholder-class="tui-phcolor" type="text" />
						</view>
					</tui-list-cell>
					<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
						<view class="tui-cell-input">
							<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
							<input name="password" :adjust-position="false" placeholder="密   码" :password="true"
								placeholder-class="tui-phcolor" type="text" />
						</view>
					</tui-list-cell>
				</view>
				<view class="tui-btn-box">
					<button form-type="submit" class="btn86"
						:style="'background:'+ pagestyleconfig.appstylecolor">登录</button>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view v-if="ptype=='member' && memberconfig.close_getPhone!=1" class="tui-wxloginbtn-box">
					<tui-button :disabledGray="true" @click="phonemodal=true" height="86rpx" type="white"
						shape="circle">自动登录
					</tui-button>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<tui-modal :show="phonemodal" @cancel="phonemodalcancel" :custom="true" fadeIn>
					<view class="tui-modal-custom">
						<view class="tui-prompt-title">你可以使用自动登录</view>
						<view class="tui-modal__btn">
							<view class="tui-box">
								<button :style="'background:'+ pagestyleconfig.appstylecolor" class="tui-btn-danger"
									open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">自动登录</button>
							</view>
							<view class="tui-box" v-if="ptype=='member' && memberconfig.sms_status==1">
								<tui-button type="white" shape="circle" height="80rpx" :size="26"
									@click="phonemodalcancel">手机验码证登录</tui-button>
							</view>
							<view class="tui-box" v-else>
								<tui-button type="white" shape="circle" height="80rpx" :size="26"
									@click="phonemodalcancel">账号密码登录</tui-button>
							</view>
						</view>
					</view>
				</tui-modal>
				<!-- #endif -->
			</view>
		</form>
		<membetreg :show="membetregshow" :stylecolor="pagestyleconfig.appstylecolor" @loginnextpage="loginnextpage"
			@close="membetregClose"></membetreg>
	</view>
</template>

<script>
	import membetreg from "@/components/views/membetreg/membetreg"
	export default {
		components: {
			membetreg
		},
		data() {
			return {
				ptype: "",
				membetregshow: false,
				pagestyleconfig: [],
				gotopage: '',
				config: {},
				memberconfig: {},
				phone: '',
				captcha: '',
				disabled: false,
				phonemodal: false,
				verifyCodetext: "获取验证码"
			};
		},
		onLoad(e) {
			var _this = this;
			if (e.ptype) {
				this.ptype = e.ptype;
			}
			if (e.gotopage) {
				this.gotopage = e.gotopage;
				uni.setStorageSync("gotopage", this.gotopage);
			} else {
				this.gotopage = uni.getStorageSync('gotopage')
			}

			_this.$request.post('config', {
				mo: 'pagestyle'
			}).then(res => {
				if (res.errno == 0) {
					_this.pagestyleconfig = res.data
				}
			});

			_this.$util.getUserInfo(function(userInfo) {
				console.log(userInfo);
			})

			_this.$request.post('config', {
				samkey: (new Date()).valueOf()
			}).then(res => {
				if (res.errno == 0) {
					if (res.data) {
						_this.config = res.data
					}
				}
			});

			_this.$request.post('config', {
				mo: 'member'
			}).then(res => {
				if (res.errno == 0) {
					if (res.data) {
						_this.memberconfig = res.data
						if (_this.memberconfig.close_getPhone != 1) {
							_this.phonemodal = true
						}
					}
				}
			});
		},
		methods: {
			bindSave: function(e) {
				var _this = this;
				const username = e.detail.value.username;
				const password = e.detail.value.password;
				const userphone = e.detail.value.userphone;
				const captcha = e.detail.value.captcha;

				if (!userphone) {
					if (!username) {
						uni.showToast({
							title: '请输入用户名',
							icon: 'none'
						});
						return;
					}

					if (!password) {
						uni.showToast({
							title: '请输入密码',
							icon: 'none'
						});
						return;
					}

				} else {
					if (!captcha) {
						uni.showToast({
							title: '请输入验证码',
							icon: 'none'
						});
						return;
					}
				}
				_this.$request.post('login.index', {
					ptype: _this.ptype,
					username: username,
					password: password,
					userphone: userphone,
					captcha: captcha
				}).then(res => {
					if (res.errno != 0) {
						console.log(res);
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						return;
					} else {
						uni.setStorageSync("uid", res.data.id);
						uni.setStorageSync("uuid", res.data.uuid);
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						_this.reg();
					}
				});
			},
			loginnextpage() {
				var _this = this;
				let url = '/pages/index/index';
				if (_this.ptype == 'member' && _this.gotopage) {
					url = _this.gotopage
				}
				this.sam.navigateTo(url);
			},
			reg() {
				this.membetregshow = true;
			},
			membetregClose() {
				this.membetregshow = false;
			},
			phonemodalcancel() {
				this.phonemodal = false
			},
			// 获取手机号
			getPhoneNumber(e) {
				console.log(e);
				var _this = this;
				_this.$request.post('login.getphonenumber', {
					ptype: _this.ptype,
					code: e.detail.code
				}).then(res => {
					if (res.errno == 0) {
						if (res.data.id > 0) {
							uni.setStorageSync("telephone", res.data.telephone);
							this.phonemodal = false
							_this.reg();
						}
					}
				});
			},
			makecaptcha() {
				let _this = this;
				if (!_this.phone) {
					uni.showToast({
						title: '请填写手机号码！',
						icon: 'none'
					});
					return;
				}
				if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(_this.phone))) {
					uni.showToast({
						title: '请输入正确的手机号码！',
						icon: 'none'
					});
					return;
				}

				_this.$request.post('login.captcha', {
					phone: _this.phone
				}).then(res => {
					console.log(res);
					if (res.errno == 0) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						_this.sendCode();
					}
				});
			},
			sendCode() {
				if (this.disabled) return;
				this.disabled = true;
				let n = 60;
				this.verifyCodetext = "剩余 " + n + "s";
				const run = setInterval(() => {
					n = n - 1;
					if (n < 0) {
						clearInterval(run);
					}
					this.verifyCodetext = "剩余 " + n + "s";
					if (this.verifyCodetext < "剩余 " + 0 + "s") {
						this.disabled = false;
						this.verifyCodetext = "重新获取";
					}
				}, 1000);
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
	};
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}

	.container {
		.login-logo {
			margin-left: auto;
			margin-right: auto;
			text-align: center;
		}

		.tui-status-bar {
			width: 100%;
			height: var(--status-bar-height);
		}

		.bottom {
			height: 86rpx;
			border-radius: 43rpx;
		}

		.tui-header {
			width: 100%;
			padding: 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
		}

		.tui-page-title {
			width: 100%;
			font-size: 48rpx;
			font-weight: bold;
			color: $uni-text-color;
			line-height: 42rpx;
			padding: 40rpx;
			box-sizing: border-box;
		}

		.tui-form {
			padding-top: 50rpx;

			.tui-view-input {
				width: 100%;
				box-sizing: border-box;
				padding: 0 40rpx;

				.tui-cell-input {
					width: 100%;
					display: flex;
					align-items: center;
					padding-top: 48rpx;
					padding-bottom: $uni-spacing-col-base;

					input {
						flex: 1;
						padding-left: $uni-spacing-row-base;
					}
				}
			}

			.tui-cell-text {
				width: 100%;
				padding: $uni-spacing-col-lg $uni-spacing-row-lg;
				box-sizing: border-box;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.tui-color-primary {
					color: $uni-color-primary;
				}

				.tui-regbutton {
					margin-left: auto;
					margin-right: auto;
					background-color: #ffffff;
					font-size: 28rpx;
					color: $uni-color-primary;
				}

				.tui-regbutton text {
					color: #666;
				}
			}

			.tui-btn-box {
				width: 100%;
				padding: 0 $uni-spacing-row-lg;
				box-sizing: border-box;
				margin-top: 60rpx;
			}

			.tui-wxloginbtn-box {
				width: 100%;
				padding: 0 $uni-spacing-row-lg;
				box-sizing: border-box;
				margin-top: 40rpx;
			}
		}

		.tui-login-way {
			width: 100%;
			font-size: 26rpx;
			color: $uni-color-primary;
			display: flex;
			justify-content: center;
			position: fixed;
			left: 0;
			bottom: 80rpx;

			view {
				padding: 12rpx 0;
			}
		}

		.tui-auth-login {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-bottom: 80rpx;
			padding-top: 20rpx;

			.tui-icon-platform {
				width: 90rpx;
				height: 90rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				margin-left: 40rpx;

				&::after {
					content: '';
					position: absolute;
					width: 200%;
					height: 200%;
					transform-origin: 0 0;
					transform: scale(0.5, 0.5) translateZ(0);
					box-sizing: border-box;
					left: 0;
					top: 0;
					border-radius: 180rpx;
					border: 1rpx solid $uni-text-color-placeholder;
				}
			}

			.tui-login-logo {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.code {
			font-size: 32rpx;
		}

		.code.on {
			color: #b9b9bc !important;
		}

		.tui-modal-custom {
			padding-top: 60rpx;
			padding-bottom: 50rpx;
			text-align: center;
		}

		.tui-prompt-title {
			padding-bottom: 20rpx;
			font-size: 34rpx;
		}

		.tui-modal__btn {
			align-items: center;
			justify-content: space-between;
		}

		.tui-box {
			padding: 15rpx 20rpx;
			box-sizing: border-box;
		}

		.btn86 {
			height: 86rpx;
			line-height: 86rpx;
			border-radius: 98rpx;
			color: #fff;
		}

		.tui-btn-danger {
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 98rpx;
			color: #fff;
		}
	}
</style>