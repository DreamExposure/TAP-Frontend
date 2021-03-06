function signIn() {
	let bodyRaw = {
		"email": document.getElementById("sign-in-email").value,
		"password": document.getElementById("sign-in-password").value,
		"gcap": grecaptcha.getResponse(0)
	};

	$.ajax({
		url: "https://api.startapped.com/v1/account/login",
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		dataType: "json",
		data: JSON.stringify(bodyRaw),
		success: function (json) {
			//Save credentials
			saveCredentials(json.credentials, document.getElementById("sign-in-remember").checked);

			window.location.replace("/hub");
		},
		error: function (jqXHR, textStatus, errorThrown) {
			showSnackbar(JSON.parse(jqXHR.responseText).message);

			grecaptcha.reset();
		}
	});
}