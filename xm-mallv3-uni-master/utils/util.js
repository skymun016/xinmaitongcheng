/**
 * 数据处理
 **/
const utils = {
	//去空格
	trim: function(value) {
		return value.replace(/(^\s*)|(\s*$)/g, "");
	},
	regexAddressBean: function(address) {
		
		var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;
		var citystr;
		var addressBean = {
			REGION_PROVINCE: null,
			REGION_COUNTRY: null,
			REGION_CITY: null
		};

		var REGION_PROVINCE = regex.exec(address);
		if (REGION_PROVINCE) {
			addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
			citystr = address;
		}

		if (!addressBean.REGION_PROVINCE) {
			regex = /^(.*?(省|自治区))(.*?)$/;
			REGION_PROVINCE = regex.exec(address);
			addressBean.REGION_PROVINCE = REGION_PROVINCE[1];
			citystr = REGION_PROVINCE[3];
		}

		regex = /^(.*?[市]|.*?地区|.*?特别行政区)(.*?[市区县])(.*?)$/g;
		var cityarray;
		cityarray = regex.exec(citystr);

		if (cityarray) {
			addressBean.REGION_CITY = cityarray[1];
			addressBean.REGION_COUNTRY = cityarray[2];
		} else {
			regex = /^(.*?[市]|.*?地区|.*?特别行政区)/;
			cityarray = regex.exec(citystr);
			addressBean.REGION_CITY = cityarray[1];
		}

		return addressBean;
	},
	//内容替换
	replaceAll: function(text, repstr, newstr) {
		return text.replace(new RegExp(repstr, "gm"), newstr);
	},
	//格式化手机号码
	formatNumber: function(num) {
		return num.length === 11 ? num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') : num;
	},
	//金额格式化
	rmoney: function(money) {
		return parseFloat(money).toFixed(2).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,')
			.replace(
				/\,$/, '').split('').reverse().join('');
	},
	//日期格式化
	formatDate: function(formatStr, fdate) {
		if (fdate) {
			if (~fdate.indexOf('.')) {
				fdate = fdate.substring(0, fdate.indexOf('.'));
			}
			fdate = fdate.toString().replace('T', ' ').replace(/\-/g, '/');
			var fTime, fStr = 'ymdhis';
			if (!formatStr)
				formatStr = "y-m-d h:i:s";
			if (fdate)
				fTime = new Date(fdate);
			else
				fTime = new Date();
			var month = fTime.getMonth() + 1;
			var day = fTime.getDate();
			var hours = fTime.getHours();
			var minu = fTime.getMinutes();
			var second = fTime.getSeconds();
			month = month < 10 ? '0' + month : month;
			day = day < 10 ? '0' + day : day;
			hours = hours < 10 ? ('0' + hours) : hours;
			minu = minu < 10 ? '0' + minu : minu;
			second = second < 10 ? '0' + second : second;
			var formatArr = [
				fTime.getFullYear().toString(),
				month.toString(),
				day.toString(),
				hours.toString(),
				minu.toString(),
				second.toString()
			]
			for (var i = 0; i < formatArr.length; i++) {
				formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
			}
			return formatStr;
		} else {
			return "";
		}
	},
	rgbToHex: function(r, g, b) {
		return "#" + utils.toHex(r) + utils.toHex(g) + utils.toHex(b)
	},
	toHex: function(n) {
		n = parseInt(n, 10);
		if (isNaN(n)) return "00";
		n = Math.max(0, Math.min(n, 255));
		return "0123456789ABCDEF".charAt((n - n % 16) / 16) +
			"0123456789ABCDEF".charAt(n % 16);
	},
	hexToRgb(hex) {
		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
}

module.exports = {
	trim: utils.trim,
	regexAddressBean: utils.regexAddressBean,
	replaceAll: utils.replaceAll,
	formatNumber: utils.formatNumber,
	rmoney: utils.rmoney,
	formatDate: utils.formatDate,
	rgbToHex: utils.rgbToHex,
	hexToRgb: utils.hexToRgb
}
