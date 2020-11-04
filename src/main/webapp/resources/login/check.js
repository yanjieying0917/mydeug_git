window.onload = function() {
	var flag = true;
	document.getElementById("img").addEventListener("dblclick", function() {
		if(flag) {
			document.getElementById("img").src = "img/check2.jpg";
			flag = false;
		} else {
			document.getElementById("img").src = "img/check.jpg";
			flag = true;
		}
	});
	
	document.getElementById("log_btn").addEventListener("click", function() {
		var isSuccess = true;
		
		if(document.getElementById("name").value == "") {
			alert("用户名不能为空");
			isSuccess = false;
		}

		if(document.getElementById("password").value == "" || document.getElementById("checkpassword").value == "") {
			alert("密码不能为空");
			isSuccess = false;
		}

		if(document.getElementById("password").value != document.getElementById("checkpassword").value ) {
			alert("请确认密码");
			isSuccess = false;
		}

		if ((flag && document.getElementById("loginform-verifycode").value != 7364) || (!flag && document.getElementById("loginform-verifycode").value != 8713))
		{
			alert("验证码有误");
			isSuccess = false;
		}
		
		if (isSuccess)
		{
			alert(document.getElementById("name").value+"注册成功");
		}
	});

	document.getElementById("name").addEventListener("blur", function() {
		if(document.getElementById("name").value == "") {
			document.getElementById("err1").innerHTML = "用户名不能为空";
		} else {
			document.getElementById("err1").innerHTML = "";
		}
	});

	document.getElementById("password").addEventListener("blur", function() {
		if(document.getElementById("password").value == "") {
			document.getElementById("err2").innerHTML = "密码不能为空";
		} else {
			document.getElementById("err2").innerHTML = "";
		}
	});

	document.getElementById("checkpassword").addEventListener("blur", function() {
		if(document.getElementById("checkpassword").value == "") {
			document.getElementById("err3").innerHTML = "密码不能为空";
		} else {
			document.getElementById("err3").innerHTML = "";
		}
	});

	document.getElementById("email").addEventListener("blur", function() {
		if(document.getElementById("email").value == "") {
			document.getElementById("err4").innerHTML = "邮箱不能为空";
		} else {
			document.getElementById("err4").innerHTML = "";
		}
	});

	document.getElementById("tel").addEventListener("blur", function() {
		if(document.getElementById("tel").value == "") {
			document.getElementById("err5").innerHTML = "电话号码不能为空";
		} else {
			document.getElementById("err5").innerHTML = "";
		}
	});

	document.getElementById("data").addEventListener("blur", function() {
		if(document.getElementById("data").value == "") {
			document.getElementById("err6").innerHTML = "出生日期不能为空";
		} else {
			document.getElementById("err6").innerHTML = "";
		}
	});
}