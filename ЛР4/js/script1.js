(function(){
	setExRange();
	ModalWindows.prototype.showModalGood = async function (id)
	{
		if(is_open)
			return;
		const params = {
			method : "POST",
			body: JSON.stringify({"good_load_type" : "single","id" : id}),
			headers: {
				'Content-Type': 'application/json'
			}
		}
		let good = await fetch("goodEngine", params).then(response => response.json())
		.then(jsonData => {
			if(jsonData.mtype == "alert")
				objMsgBox.showMsg(jsonData.title,jsonData.message,jsonData.type);
			else if (jsonData.mtype == "update")
				return jsonData;
			else
				alert("Something wrong");
			
		});
		objModalWin.setIsOpen(true);
		document.querySelector("#wrapper-modal-good").classList.remove("displayNone");
		document.querySelector("#modal-goods-img").src = "img/goods/" + good.photoName + "." + good.photoType;
		document.querySelector("#modal-goods-title").innerHTML = good.title;
		document.querySelector("#modal-description-good").innerHTML = good.text;
		document.querySelector("#modal-good-price").innerHTML = good.price;
		document.querySelector("#modal-buy-good").setAttribute("data-good-id",id);
		
		disableScroll ();
	}
	loadChecks();
	Filter1();
	basketDropLoad(objMsgBox);
	let objModalWin =  new ModalWindows(600,objMsgBox);
	
	changAd();
	disableFunctions (objMsgBox);
	setTimer();
	setButTop();
	document.querySelector("#find-goods").addEventListener("click",function(){
  		Filter1();
	});
	document.querySelector("#content-goods").addEventListener("click",function(ev){
		let id = ev.target.closest('button');
		if (!id) return;
		objModalWin.showModalGood(id.dataset.goodId);
	});
	document.querySelector("#filter1").addEventListener("click",function(ev){
		let id = ev.target.closest('input');
		if(!id || id.type != "checkbox" || id.checked)
			return;
		let count = 0;
		document.querySelectorAll("#filter1 > input[type=checkbox]").forEach(chkBox => {if (chkBox.checked) count++;});
		if (count == 0)
				ev.preventDefault();
	});
	document.querySelector("#mob-nav-but").addEventListener("click",function(){
		document.querySelector("#mobnav").classList.toggle("show");
	});
	
	document.querySelector("#modal-buy-good").addEventListener("click",function(e){
		let id = e.target.dataset.goodId;
		addGoodToBasket(id);
		objMsgBox.showMsg("Повідомлення","Товар #"+ id + " додано до корзини","greenStyle");
	});
	if(localStorage.getItem("basket-empty") == "false")
		document.querySelector("#basket-point").classList.remove("displayNone");
	

	document.querySelector("#modal-goods-close").addEventListener("click",function(){
		document.querySelector("#wrapper-modal-good").classList.add("displayNone");
		enableScroll ();
		objModalWin.setIsOpen(false);
	});


})();