<?php
// +----------------------------------------------------------------------
// | 应用设置
// +----------------------------------------------------------------------

use think\facade\Env;

return [
    // 应用地址
    'app_host'         => Env::get('app.host', ''),
    // 应用的命名空间
    'app_namespace'    => '',
    // 是否启用路由
    'with_route'       => true,
    // 是否启用事件
    'with_event'       => true,

    // 默认应用
    'default_app'      => 'index',
    // 默认时区
    'default_timezone' => 'Asia/Shanghai',

    'auto_multi_app' => true,

    // 应用映射（自动多应用模式有效）
    'app_map'          => [
		//'manage'	=> 'admin',
	],
    // 域名绑定（自动多应用模式有效）
    'domain_bind'      => [
		//'admin.samcms.com'	=> 'admin',
		//'api.samcms.com'	=> 'api',
	],
    // 禁止URL访问的应用列表（自动多应用模式有效）
    'deny_app_list'    => [],
	
    // 异常页面的模板文件
    'exception_tmpl'   => app()->getThinkPath() . 'tpl/think_exception.tpl',

	'dispatch_success_tmpl' => app()->getRootPath() . 'extend/tpl/dispatch_jump.tpl',

    // 错误显示信息,非调试模式有效
    'error_message'    => '页面错误！请稍后再试～',
    // 显示错误信息
    'show_page_trace'   => false,
    'show_error_msg'   => true,
];
