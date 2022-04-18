(function(){
	setExRange();
	let Goods = [], allGoods;
	Goods[0] = JSON.parse(data1);
	Goods[1] = JSON.parse(data2);
	Goods[2] = JSON.parse(data3);
	Goods[3] = JSON.parse(data4);
	allGoods = JSON.parse(data5);
	let objMsgBox = new MsgBox();
	ModalWindows.prototype.showModalGood = function (goods,id)
	{
		if(is_open)
			return;
		objModalWin.setIsOpen(true);
		let good = goods[id-1];
		document.querySelector("#wrapper-modal-good").classList.remove("displayNone");
		document.querySelector("#modal-goods-img").src = "img/goods/" + good.photoName + "." + good.photoType;
		document.querySelector("#modal-goods-title").innerHTML = good.title;
		document.querySelector("#modal-description-good").innerHTML = good.text;
		document.querySelector("#modal-good-price").innerHTML = good.price;
		document.querySelector("#modal-buy-good").setAttribute("data-good-id",id);
		
		disableScroll ();
	}
	let objModalWin =  new ModalWindows(600,objMsgBox);
	changAd();
	loadChecks();
	Filter1(Goods);
	disableFunctions (objMsgBox);
	setTimer();
	setButTop();
	document.querySelector("#find-goods").addEventListener("click",function(){
  		Filter1(Goods);
	});
	document.querySelector("#content-goods").addEventListener("click",function(){
		let id = event.target.closest('button');
		if (!id) return;
		objModalWin.showModalGood(allGoods,id.dataset.goodId);
	});
	document.querySelector("#filter1").addEventListener("click",function(ev){
		let id = event.target.closest('input');
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
	basketDropLoad(objMsgBox);
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