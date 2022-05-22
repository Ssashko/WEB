(async function(){
	let objModalWin = new ModalWindows(60,objMsgBox);

	disableFunctions (objMsgBox);
	setTimer();
	setButTop();
    await fetch("accountEngine").then(response => response.json())
    .then(jsonData => {
        if(jsonData["mtype"] == "alert")
        {

        }
        else if(jsonData["mtype"] == "ok")
        {
            document.getElementById("account-info-id").innerHTML = "# " + jsonData["userdata"]["id"];
            document.getElementById("account-info-login").innerHTML = jsonData["userdata"]["login"];
            document.getElementById("account-info-email").innerHTML = jsonData["userdata"]["email"];
            let statusU;
            switch(jsonData["userdata"]["privilege"])
            {
                case "0": statusU = "Користувач";break;
                case "1": statusU = "Адміністратор";
            }
            document.getElementById("account-info-privilege").innerHTML = statusU;
            let ordersInfo = jsonData["ordersinfo"].reduce((sum, cur) => {
                sum += "<p>" + "# " + cur["id"] + "</p>";
                sum += "<p>" + cur["date"] + "</p>";
                sum += "<p>" + cur["time"] + "</p>";
                sum += "<p>" + cur["status"] + "</p>";
                return sum;
            },"");
            document.getElementById("orders-info").insertAdjacentHTML("beforeend",ordersInfo);
        }
        else
            alert("something wrong");


    });
	document.querySelector("#mob-nav-but").addEventListener("click",function(){
		document.querySelector("#mobnav").classList.toggle("show");
	});
	if(localStorage.getItem("basket-empty") == "false")
		document.querySelector("#basket-point").classList.remove("displayNone");

})();