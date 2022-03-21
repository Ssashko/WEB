(function(){
	let Goods = [], allGoods;
	Goods[0] = JSON.parse(data1);
	Goods[1] = JSON.parse(data2);
	Goods[2] = JSON.parse(data3);
	Goods[3] = JSON.parse(data4);
	allGoods = JSON.parse(data5);
	let objMsgBox = new MsgBox();
	let objModalWin =  new ModalWindows(30,objMsgBox);
	changAd();
	loadChecks();
	Filter1(Goods);
	disableFunctions (objMsgBox);
	setTimer();
	setButTop();
	console.log(localStorage);
	document.querySelector("#find-goods").addEventListener("click",function(){
  		Filter1(Goods);
	});
	document.querySelector("#content-goods").addEventListener("click",function(){
		let id = event.target.closest('button');
		if (!id) return;
		objModalWin.showModalGood(allGoods[id.dataset.goodId-1]);
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
})();
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
	ModalWindows.prototype.showModalGood = function (good)
	{
		if(is_open)
			return;
		is_open = true;
		document.querySelector("#wrapper-modal-good").classList.remove("displayNone");
		document.querySelector("#modal-goods-img").src = "img/goods/" + good.photoName + "." + good.photoType;
		document.querySelector("#modal-goods-title").innerHTML = good.title;
		document.querySelector("#modal-description-good").innerHTML = good.text;
		document.querySelector("#modal-good-price").innerHTML = good.price;
		disableScroll ();
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
	document.querySelector("#modal-goods-close").addEventListener("click",function(){
		document.querySelector("#wrapper-modal-good").classList.add("displayNone");
		enableScroll ();
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
function disableFunctions (objMsgBox)
{
	document.querySelector("#modal-buy-good").addEventListener("click",function(){
		objMsgBox.showMsg('Помилка', 'Функціонал не доступний')
	});
	document.querySelectorAll("nav > a").forEach(function(el){
		el.addEventListener("click",function(){
		objMsgBox.showMsg('Помилка', 'Функціонал не доступний')
		});
	});
	document.querySelectorAll("#mobnav > li > a").forEach(function(el){
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
			stackgoods.push(Goods[+chkBox.dataset.categoryInd]);
	});
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
	lists.forEach(list => list.forEach(function(good){
		strGoods += `<div class="goods"><div class="wrapper-img-set-goods"><img class="img-mark-goods" src="img/warranty.png" alt=""><div class="img-set-goods"><img class="img-main-goods" src="img/goods/${good.photoName}.${good.photoType}" alt=""></div></div><h5>${good.title}</h5><p>ціна:<span class="good-price">${good.price} UAH</span></p><button data-good-id="${good.id}">Докладно</button></div>`;
	}));			
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
