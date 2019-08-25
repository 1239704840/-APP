/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.userName = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.userName.length < 0) {
			return callback('请输入账户名');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
	//	var users = JSON.parse(localStorage.getItem('$users') || '[]');
		//验证信息方法

		function authed(loginInfo){
			console.log(JSON.stringify(loginInfo));			
						
			//登陆方法			
			goWebApiPost("http://172.16.100.12:5003/api/Worker/Login", loginInfo, function(ret, textStatus) {
                console.log(JSON.stringify(ret));
                console.log(textStatus);
				if(ret.statusText=="error"){
					return callback("网络错误");
				}else if(ret.statusText=="OK"){
					console.log(ret.responseJSON);
					loginInfo.id=ret.responseJSON;
					console.log(loginInfo.id);
					localStorage.setItem('$loginUser', JSON.stringify(loginInfo));
					console.log(localStorage.toString());
					return owner.createState(loginInfo.userName, callback);
				}
            });
						
			// goWebservices('http://172.16.100.12:5003/api/Worker/Login',loginInfo,function(ret,err){
			// 	console.log(ret)
			// if(ret==true){
			// localStorage.setItem('$loginUser', JSON.stringify(loginInfo));
			// console.log(localStorage.toString());
			// return owner.createState(loginInfo.loginusername, callback);
			// }else if(ret==false){
			// return callback('用户名或密码错误');
			// }
			// });
		}		
        authed(loginInfo); 
		
		// users.some(function(user) {
		// 	var result;
		// 	var paramTag = getWebservicesparamTag(user);//
		// 	goWebservices('isExistUser', paramTag, function(ret,err) {
		// 		console.log(ret);
		// 	});
		// 	return loginInfo.account == "user233" && loginInfo.password == "password";
		// });
		
		
		// //27行属性为true的时候为登陆成功
		// if (authed(loginInfo)) {
		// 	return owner.createState(loginInfo.loginusername, callback);
		// 	console.log(localStorage.toString());
		// } else {
		// 	return callback('用户名或密码错误');
		// }
	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
		}
		/**
		 * 获取本地是否安装客户端
		 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));