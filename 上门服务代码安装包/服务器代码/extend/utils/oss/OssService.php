<?php

namespace utils\oss;


class OssService
{

	/**
	 * 图片oss存储路径
	 * @param  string type 业务号
	 * @return string 
	 */
	public static function setKey($type, $tmpInfo)
	{
		$filepath = app('http')->getName() . '/' . date(config('my.upload_subdir')) . '/' . doOrderSn($type) . '.' . $tmpInfo['extension']; //上传路径
		return $filepath;
	}


	/**
	 * oss开始上传
	 * @param  string tmpInfo 图片临时文件信息
	 * @return string oss返回图片完整路径
	 */
	public static function OssUpload($oss_settings, $tmpInfo)
	{
		switch ($oss_settings['code']) {
			case 'ali';
				$url = \utils\oss\AliOssService::upload($oss_settings, $tmpInfo);	//阿里上传
				break;

			case 'qcloud';
				$url = \utils\oss\QcloudOssService::upload($oss_settings, $tmpInfo);	//腾讯云上传
				break;
			case 'qiniuyun';
				$url = \utils\oss\QnyOssService::upload($oss_settings, $tmpInfo);	//七牛云上传
				break;
		}
		return $url;
	}
}
