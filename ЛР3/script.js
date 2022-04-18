function setExRange () {
	let mainEl = document.querySelector(".exRange-main");
	let leftRange = document.querySelector("#left-bound");
	let rightRange = document.querySelector("#right-bound");
	leftRange.value = leftRange.min = rightRange.min = mainEl.dataset.rangeMin;
	rightRange.value = leftRange.max = rightRange.max = mainEl.dataset.rangeMax;
	let el;
	document.querySelector(".custom-range").addEventListener("mousedown",function(e){
		el = e.target.closest(".control-el");
		if(!el) return;
		el.parentNode.addEventListener("mousemove", moving);
		document.body.addEventListener("mouseup", checkUpMouse);
	})
	function checkUpMouse (e)
	{
		el.parentNode.removeEventListener("mousemove", moving);
		document.body.removeEventListener("mouseup", checkUpMouse);
	}
	function parseIntEx (v) {
		return v == "" ? 0 : parseInt(v);
	}
	let collised = false;
	function moving (e)
	{
		let lineSize = document.querySelector(".custrange-line").getBoundingClientRect();
		let elSize = el.getBoundingClientRect();
		if(el.classList.contains("custrange-right-bound")){
			let realOffset = lineSize.right - e.clientX, rangeOffset;
			let maxRange = parseIntEx(rightRange.max), minRange = parseIntEx(rightRange.min);
			if((realOffset < 0 || realOffset > lineSize.width) && collised) return;
			if(realOffset < 0)
			{
				rangeOffset = 0;
				realOffset = 0;
			}
			else if(realOffset > lineSize.width) 
			{
				rangeOffset = maxRange-minRange;
				realOffset = lineSize.width;
			}
			else
			{
				collised = false;
				rangeOffset = (maxRange-minRange)*realOffset/lineSize.width
				if(maxRange - rangeOffset < parseIntEx(leftRange.value))
				{
					rangeOffset = maxRange - parseIntEx(leftRange.value);
					realOffset = lineSize.width*rangeOffset/(maxRange-minRange);
					collised = true;
				}
			}
			el.style.right = realOffset + "px";
			rightRange.value = maxRange-rangeOffset;
			el.firstChild.innerHTML = rightRange.value;
		}
		else {
			let realOffset = e.clientX-lineSize.x, rangeOffset;
			let maxRange = parseIntEx(leftRange.max), minRange = parseIntEx(leftRange.min);
			if((realOffset < 0 || realOffset > lineSize.width) && collised) return;
			if(realOffset < 0)
			{
				rangeOffset = 0;
				realOffset = 0;
			}
			else if(realOffset > lineSize.width) 
			{
				rangeOffset = maxRange-minRange;
				realOffset = lineSize.width;
			}
			else
			{
				collised = false;
				rangeOffset = (maxRange-minRange)*realOffset/lineSize.width
				if(minRange + rangeOffset > parseIntEx(rightRange.value))
				{
					rangeOffset = parseIntEx(rightRange.value) - minRange;
					realOffset = lineSize.width*rangeOffset/(maxRange-minRange);
					collised = true;
				}
			}
			el.style.left = realOffset + "px";
			leftRange.value = rangeOffset + minRange;
			el.firstChild.innerHTML = leftRange.value;
		}
	}
}
function basketDropLoad (objMsgBox)
{
	CartFilter ();
	let el;
	let cloneEl;
	function moving (e) {
		if(e.clientX + cloneEl.offsetWidth/2+10 <= document.documentElement.clientWidth)
			cloneEl.style.left = e.pageX - cloneEl.offsetWidth/2 + 'px';
		if(e.clientY + cloneEl.offsetHeight/2+10 <= document.documentElement.clientHeight)
			cloneEl.style.top = e.pageY - cloneEl.offsetHeight/2 + 'px';
	}
	function dragging (e){
		moving(e);
		if(e.clientX >=  document.documentElement.clientWidth*0.5 && e.clientY <= 350)
			document.querySelector("#basket-drop-area").classList.remove("displayNone");
		else
			document.querySelector("#basket-drop-area").classList.add("displayNone");
	}
	function stopdragging (e)
	{
		if(e.clientX >=  document.documentElement.clientWidth*0.75 && e.clientY <= 250)
		{
			let id = cloneEl.querySelector("button[data-good-id]").dataset.goodId;
			objMsgBox.showMsg("Повідомлення","Товар #"+ id + " додано до корзини","greenStyle");
			addGoodToBasket(id);
		}
		document.querySelector("#basket-drop-area").classList.add("displayNone");
		document.removeEventListener("mousemove",dragging);
		el.classList.remove("opacity0");
		document.removeEventListener("mouseup",stopdragging);
		cloneEl.remove();
	}

	let delay = true;
	let waiting = false;
	document.querySelector("#content-goods").addEventListener("mouseup",function(e){
		if(waiting)
			delay = false;
	});
	document.querySelector("#content-goods").addEventListener("mousedown",function(e){
		waiting = true;
		e.preventDefault();
		setTimeout(function(){
			if(!delay) {
				delay = true;
				return;
			}
			waiting = false;
			el = e.target.closest('.goods');
			if (!el) return;
			cloneEl = el.cloneNode(true);
			cloneEl.classList.add("dragging");
			cloneEl.querySelector(".img-mark-goods").remove();
			el.classList.add("opacity0");
			document.body.appendChild(cloneEl);
			moving(cloneEl,e);
			document.addEventListener("mousemove",dragging);
			document.addEventListener("mouseup",stopdragging);
			
		},200);
	});
}
function statistic (id) {
	if(typeof JSON.parse(data1).find(el => el.id == id) !== 'undefined')
	{
		if(localStorage.getItem("statistic-Operation.System") === null)
			localStorage.setItem("statistic-Operation.System","1");
		else
			localStorage.setItem("statistic-Operation.System",+localStorage.getItem("statistic-Operation.System")+1);
	}
	else if(typeof JSON.parse(data2).find(el => el.id == id) !== 'undefined')
	{
		if(localStorage.getItem("statistic-Office.Applications") === null)
			localStorage.setItem("statistic-Office.Applications","1");
		else
			localStorage.setItem("statistic-Office.Applications",+localStorage.getItem("statistic-Office.Applications")+1);
	}else if(typeof JSON.parse(data3).find(el => el.id == id) !== 'undefined')
	{
		if(localStorage.getItem("statistic-Games") === null)
			localStorage.setItem("statistic-Games","1");
		else
			localStorage.setItem("statistic-Games",+localStorage.getItem("statistic-Games")+1);
	}else if(typeof JSON.parse(data4).find(el => el.id == id) !== 'undefined')
	{
		if(localStorage.getItem("statistic-Multimedia") === null)
			localStorage.setItem("statistic-Multimedia","1");
		else
			localStorage.setItem("statistic-Multimedia",+localStorage.getItem("statistic-Multimedia")+1);
	}else
		alert("stat-error");
}
function addGoodToBasket (id)
{
	statistic(id);
	if(localStorage.getItem("basket-empty") === null)
	{
		localStorage.setItem("basket-empty","false");
		document.querySelector("#basket-point").classList.remove("displayNone");
	}
	if(localStorage.getItem("order-"+id) === null)
		localStorage.setItem("order-"+id,"1");
	else
	{
		let count = parseInt(localStorage.getItem("order-"+id));
		localStorage.setItem("order-"+id,String(count+1));
	}
}
function loadChecks ()
{
	let countChecked = 0;
	document.querySelectorAll("#filter1 > input[type=checkbox]").forEach(function(val){
		if(localStorage.getItem(val.id) == "true")
			countChecked++;
	});
	if(countChecked >= 1)
		document.querySelectorAll("#filter1 > input[type=checkbox]").forEach(function(val){

			if(localStorage.getItem(val.id) == "true")
				val.checked = true;
			else
				val.checked = false;
		});
}
function MsgBox (time = 2000){
	idtimer = null;
	MsgBox.prototype.showMsg = function (title,msg,style = "redStyle")
	{
		document.querySelector("#msg-box").classList.remove(...document.querySelector("#msg-box").classList);
		document.querySelector("#msg-box").classList.add(style);
		document.querySelector("#msg-box-title").innerHTML = title;
		document.querySelector("#msg-box-msg").innerHTML = msg;
		clearTimeout(idtimer)
		idtimer = setTimeout(function(){
			document.querySelector("#msg-box").classList.add("displayNone");
		},time)
	}
}
function ModalWindows (time,objMsgBox)
{
	is_open = false;
	ModalWindows.prototype.setIsOpen = function(bl){
		if(typeof is_open != "boolean")
			return false;
		is_open = bl;
		return true;
	}
	ModalWindows.prototype.getIsOpen = function(){
		return is_open;
	}
	ModalWindows.prototype.closePopupAd = function ()
	{
		enableScroll ();
		document.querySelector("#popup-modal-advertisiment").classList.add("displayNone");
		is_open = false;
	}
	ModalWindows.prototype.showPopupAd = function ()
	{
		if(is_open)
			return;
		is_open = true;
		disableScroll();
		document.querySelector("#popup-advertisiment-close").removeEventListener("click",ModalWindows.prototype.closePopupAd);
		document.querySelector("#popup-modal-advertisiment").classList.remove("displayNone");
		document.querySelector("#popup-advertisiment-close").classList.add("close-but-disable");
		document.querySelector("#popup-advertisiment > img").src = "img/ad/"+ Math.floor(Math.random() * 8.99) +".jpg";
		let time = 3;
		document.querySelector("#ad-popup-timer").innerHTML = time;
		time--;
		let idInterval = setInterval(function(){
			if(time <= 0)
			{
				document.querySelector("#popup-advertisiment-close").classList.remove("close-but-disable");
				document.querySelector("#popup-advertisiment-close").addEventListener("click",ModalWindows.prototype.closePopupAd);
				clearInterval(idInterval);
			}
			document.querySelector("#ad-popup-timer").innerHTML = time;
			time--;
		},1000);

	}
	document.querySelector(".cart-items").addEventListener("click",function(e){
		let el = e.target.closest(".item-count-edit");
		if (!el) return;
		let counter;
		let id = parseInt(el.parentNode.parentNode.dataset.goodId);
		
		let realCount = localStorage.getItem("order-"+id);
		if(realCount === null)
		{
			alert("Something wrong");
			return;
		}
		if (el.classList.contains("item-count-add"))
		{
			counter = el.nextElementSibling;
			realCount++;
			counter.innerHTML = realCount;
			localStorage.setItem("order-"+id,realCount);
		}
		else
		{
			counter = el.previousElementSibling;
			realCount--;
			if (realCount <= 0)
			{
				el.parentNode.parentNode.remove();
				localStorage.removeItem("order-"+id,realCount);
				if(document.querySelector(".cart-items").innerHTML == "")
				{
					localStorage.removeItem("basket-empty");
					document.querySelector("#basket-point").classList.add("displayNone");
					document.querySelector(".empty-cart").classList.remove("displayNone");
				}
			}
			else
			{
				counter.innerHTML = realCount;
				localStorage.setItem("order-"+id,realCount);
			}
		}
		calcSumPriceCart();
	});

	document.getElementById("modal-cart-clean").addEventListener("click",function(){
		let keys = Object.keys(localStorage);
		for(let key of keys)
		{
			key = key.split('-');
			if (key[0] == "order")
				localStorage.removeItem(key[0]+"-"+key[1]);
		}
		localStorage.removeItem("basket-empty");
		document.querySelector("#basket-point").classList.add("displayNone");
		document.querySelector(".cart-items").innerHTML = "";
		document.querySelector(".empty-cart").classList.remove("displayNone");
	});
	document.querySelector("#basket-wrapper").addEventListener("click",function(){
		localStorage.getItem
		document.querySelector("#wrapper-modal-cart").classList.remove("displayNone");
		disableScroll();
		is_open = true;
		loadBasket();
		calcSumPriceCart();
	});
	document.querySelector("#modal-cart-close").addEventListener("click",function(){
		document.querySelector("#wrapper-modal-cart").classList.add("displayNone");
		enableScroll()
		is_open = false;
	});
	document.querySelector("#nonmodal-subscription-close").addEventListener("click",function(){
		document.querySelector("#nonmodal-subscribe-wrapper").classList.add("displayNone");
		is_open = false;
	});

	document.querySelector("#submit-subsription").addEventListener("submit",function(e){
		e.preventDefault();
		localStorage.setItem("subsribed","true");
		localStorage.setItem("subEmail",document.querySelector("#edit-subsription").value);
		document.querySelector("#nonmodal-subscribe-wrapper").classList.add("displayNone");
		objMsgBox.showMsg("Повідомлення","Пошту " + localStorage.getItem("subEmail") + " прив`язано до розсилки!","greenStyle");
		is_open = false;
	});
	if(localStorage.getItem("subsribed") != "true")
	{
		if(is_open)
			return;
		is_open = true;
		document.querySelector("#nonmodal-subscribe-wrapper").classList.remove("displayNone");
	}
	setInterval(this.showPopupAd,time*1000);
}
function loadBasket () {
	let allGoods = JSON.parse(data5);

	let keys = Object.keys(localStorage);
	let htmlblock = "";
	for(let key of keys)
	{
		key = key.split('-');
		if (key[0] == "order")
		  	htmlblock += `<div data-good-id="${key[1]}" class="cart-item">
							<img src="img/goods/${allGoods[key[1]-1].photoName}.${allGoods[key[1]-1].photoType}">
							<p class="cart-item-header">${allGoods[key[1]-1].title}</p>
							<p class="cart-item-price"><span class="cart-price-value">${allGoods[key[1]-1].price}</span> UAH.</p>
							<div class="item-count-module">
								<button class="item-count-add item-count-edit">+</button>
								<span class="item-count-value">${localStorage.getItem(key[0]+"-"+key[1])}</span>
								<button class="item-count-sub item-count-edit">-</button>
							</div>
						</div>`;
	}
	if(htmlblock == "")
		document.querySelector(".empty-cart").classList.remove("displayNone");
	else
	{
		document.querySelector(".cart-items").innerHTML = htmlblock;
		document.querySelector(".empty-cart").classList.add("displayNone");
	}
}
function calcSumPriceCart()
{
	let sum = 0;
	[...document.querySelector(".cart-items").children].forEach(function(el){
		sum += parseInt(el.querySelector(".cart-price-value").innerHTML) * parseInt(el.querySelector(".item-count-value").innerHTML);
	});
	document.querySelector("#cart-sum-price").innerHTML = sum;
}
function CartFilter ()
{
	document.querySelector(".block2-cart-module").addEventListener("click",function(e){
		let el = e.target.closest("p");
		if(!el) return;
		let parEl = el.parentNode;
		let elementsOfCart = [...document.querySelector(".cart-items").children];
		if (parEl.id == "cart-sort-name")
			if(el.classList.contains("filter-asc")){
				elementsOfCart.sort(function(a,b){
					let titleA = a.querySelector(".cart-item-header").innerHTML;
					let titleB = b.querySelector(".cart-item-header").innerHTML;
					if (titleA < titleB)
						return -1;
					else
						return 1;
				});
			}
			else{
				elementsOfCart.sort(function(a,b){
					let titleA = a.querySelector(".cart-item-header").innerHTML;
					let titleB = b.querySelector(".cart-item-header").innerHTML;
					if (titleA > titleB)
						return -1;
					else
						return 1;
				});
			}
		else if (parEl.id == "cart-sort-price")
			if(el.classList.contains("filter-asc")){
				elementsOfCart.sort(function(a,b){
					let priceA = parseInt(a.querySelector(".cart-price-value").innerHTML);
					let priceB = parseInt(b.querySelector(".cart-price-value").innerHTML);
					return priceA - priceB;
				});
			}
			else{
				elementsOfCart.sort(function(a,b){
					let priceA = parseInt(a.querySelector(".cart-price-value").innerHTML);
					let priceB = parseInt(b.querySelector(".cart-price-value").innerHTML);
					return priceB - priceA;
				});
			}
		elementsOfCart = elementsOfCart.reduce((prev_e,e) => prev_e + e.outerHTML,"");
		document.querySelector(".cart-items").innerHTML = elementsOfCart;
	});


}
function disableFunctions (objMsgBox)
{
	document.querySelector("#modal-cart-submit").addEventListener("click",function(){
		objMsgBox.showMsg('Помилка', 'Функціонал не доступний')
	});
	document.querySelectorAll("nav > span").forEach(function(el){
		el.addEventListener("click",function(){
		objMsgBox.showMsg('Помилка', 'Функціонал не доступний')
		});
	});
	document.querySelectorAll("#mobnav > li > span").forEach(function(el){
		el.addEventListener("click",function(){
		objMsgBox.showMsg('Помилка', 'Функціонал не доступний')
		});
	});
}
function setTimer() 
{
	document.querySelector("#time").innerHTML = getTime();
	setInterval(function (){
		document.querySelector("#time").innerHTML = getTime();
	},500);
}
function setButTop ()
{
	document.querySelector("#top-btm").addEventListener("click",toTop);
	window.addEventListener('scroll', function(){
    	if (window.pageYOffset > document.documentElement.clientHeight)
    		document.querySelector("#top-btm").classList.remove("displayNone");
    	else
    		document.querySelector("#top-btm").classList.add("displayNone");
	});
}
function Filter1 (Goods)
{

	let chkBoxes = document.querySelectorAll("#filter1 > input[type=checkbox]");
	let stackgoods = [];
	document.querySelectorAll("#filter1 > input[type=checkbox]").forEach(function (chkBox){
		localStorage.setItem(chkBox.id,chkBox.checked);
		if (chkBox.checked)
			stackgoods = [...stackgoods, ...Goods[+chkBox.dataset.categoryInd]];
	});
	let minPrice = +document.getElementById("left-bound").value;
	let maxPrice = +document.getElementById("right-bound").value;
	stackgoods = stackgoods.filter(good => minPrice <= +good.price && +good.price <= maxPrice);
	let checkedOptionSort = document.querySelector("input[name=sort-type-radbut]:checked").value;
	switch(+checkedOptionSort)
	{
		case 1: stackgoods.sort(function(a,b){
			if(a.title < b.title)
				return -1;
			return 1;
		});break;
		case 2: stackgoods.sort(function(a,b){
			if(a.title < b.title)
				return 1;
			return -1;
		});break;
		case 3: stackgoods.sort(function(a,b){
			return +a.price - +b.price;
		});break;
		case 4: stackgoods.sort(function(a,b){
			return +b.price - +a.price;
		});break;
	}
	setGoods(stackgoods);
	addAdvertisiment();
}

function warrantyAnimation(logo) {
	let start = null;
	let S = t => 10-0.25*Math.pow(t,4)+0.66666667*Math.pow(t,3)-0.5*Math.pow(t,2)-9.91666667*t;
	let R = t => 1-0.25*Math.pow(t,4)+0.66666667*Math.pow(t,3)-0.5*Math.pow(t,2)-0.66666667*t;
	requestAnimationFrame(function animation(time) {
		if(!start) start = time;
		let t = (time-start)/400.0;
		logo.style.top = S(t) +'px';
		logo.style.right = S(t) +'px';
		logo.style.width = 50*R(t) + 'px';
		logo.style.height = 50*R(t) + 'px';
		if(t < 1)
			requestAnimationFrame(animation);
	});
}
function warrantyAnimationReverse (logo) {
	let start = null;
	let S = t => 10-0.25*Math.pow(t,4)+0.66666667*Math.pow(t,3)-0.5*Math.pow(t,2)-9.91666667*t;
	let R = t => 1-0.25*Math.pow(t,4)+0.66666667*Math.pow(t,3)-0.5*Math.pow(t,2)-0.66666667*t;
	requestAnimationFrame(function animation(time) {
		if(!start) start = time;
		let t = (time-start)/400.0;
		logo.style.top = S(1-t) +'px';
		logo.style.right = S(1-t) +'px';
		logo.style.width = 50*R(1-t) + 'px';
		logo.style.height = 50*R(1-t) + 'px';
		if(t < 1)
			requestAnimationFrame(animation);
	});
}
function changAd()
{
	document.querySelectorAll("#ad-wrapper > img").forEach(img => img.src = "img/ad/"+ Math.floor(Math.random() * 8.99) +".jpg");			
}
function preventEvent (event)
{
	event.preventDefault();
}
function preventUpDown (event)
{
	if (event.key == "ArrowUp" || event.key == "ArrowDown")
  		event.preventDefault();
}
function disableScroll ()
{
	document.addEventListener("mousewheel",preventEvent,{passive: false});
	document.addEventListener("wheel",preventEvent,{passive: false});
	document.addEventListener('keydown', preventUpDown);
}
function enableScroll ()
{
	document.removeEventListener("mousewheel",preventEvent);
	document.removeEventListener("wheel",preventEvent);
	document.removeEventListener('keydown', preventUpDown);
}
function setGoods (lists){
	strGoods = '';
	lists.forEach(function(good){
		strGoods += `<div class="goods"><div class="wrapper-img-set-goods"><img class="img-mark-goods" src="img/warranty.png" alt=""><div class="img-set-goods"><img class="img-main-goods" src="img/goods/${good.photoName}.${good.photoType}" alt=""></div></div><h5>${good.title}</h5><p>ціна:<span class="good-price">${good.price} UAH</span></p><button data-good-id="${good.id}">Докладно</button></div>`;
	});			
	document.querySelector("#content-goods").innerHTML = strGoods;
	document.querySelectorAll(".wrapper-img-set-goods").forEach(function(el){
		el.addEventListener("mouseover",function(e){
			if(e.relatedTarget.className == "img-main-goods" || e.relatedTarget.className == "img-mark-goods")
				return;
			warrantyAnimation(el.firstChild)
		});
		el.addEventListener("mouseout",function(e){
			if(e.relatedTarget.className == "img-main-goods" || e.relatedTarget.className == "img-mark-goods")
				return;
			warrantyAnimationReverse(el.firstChild)
		});
	});
}
function toTop ()
{
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -100);
      setTimeout(toTop, 1000/60);
   	}
}
function getTime ()
{
	d = new Date();
	return (0 <= d.getHours() && d.getHours() <= 9 ? "0" :  "") + d.getHours() + " : " + (0 <= d.getMinutes() && d.getMinutes() <= 9 ? "0" :  "") + d.getMinutes() + " : " + (0 <= d.getSeconds() && d.getSeconds() <= 9 ? "0" : "") + d.getSeconds();
}
function addAdvertisiment()
{
	let content = document.querySelectorAll("#content-goods > .goods");
	let wrapperContent = document.querySelector("#content-goods");
	content.forEach(function(val) {
		if(Math.random() < 0.25)
		{
			let ad = document.createElement("div");
			ad.classList.add("ad-good");
			ad.innerHTML = "<span>advertisement</span><img src='img/ad/"+ Math.floor(Math.random() * 8.99) +".jpg'>";
			val.before(ad);
		}
	})


}
