(function(){
	let objMsgBox = new MsgBox();
	let objModalWin =  new ModalWindows(60,objMsgBox);
	disableFunctions (objMsgBox);
	setTimer();
	setButTop();

	document.querySelector("#mob-nav-but").addEventListener("click",function(){
		document.querySelector("#mobnav").classList.toggle("show");
	});
	if(localStorage.getItem("basket-empty") == "false")
		document.querySelector("#basket-point").classList.remove("displayNone");
	let newsMod = new NewsModule(objModalWin);
	newsMod.loadInitNews(2);
	newsMod.addNews();

})();
function dateToStr(date){
	return ("0"+date.getDate()).slice(-2) + "." + ("0" + (date.getMonth()+1)).slice(-2) + "." + date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
}
function NewsModule(modalWin){
	let news;
	let index;
	NewsModule.prototype.loadInitNews =  function (basis_count) {
	index = basis_count;
	news = JSON.parse(newsdata).map(function(news,i){
		let cdate = news.date.split("/").reverse();
		let ctime = news.time.split(":");
		cdate[1] = +cdate[1] - 1;
		return {
			date: new Date(...cdate,...ctime),
			title: news.title,
			imgPath: news.imageName + "." + news.imageType,
			important: news.important,
			text : news.text
		};
	});
	news.sort(function(a,b){
		return a.date > b.date ? -1 : 1;
	});
	document.getElementById("news-bar").innerHTML = news.slice(0,index).reduce(function(prev,cur,index){
		return prev + `<div class="news-item">
				<div class="news-item-image">
					<img src="img/news/${cur.imgPath}">
				</div>
				<div class="news-item-brinfo">
					<p class="news-item-date">${dateToStr(cur.date)}</p>
					<p class="news-item-title ${cur.important ? "news-item-important" : "" }">${cur.title}</p>
				</div>
				<button data-news-id="${index}" class="news-item-bdetails">Докладніше</button>
				<button class="news-item-texthide displayNone">Сховати текст</button>
			</div>`
	},"");
	}
	NewsModule.prototype.addNews = function() {
		if(news.length <= index)
			return false;
		document.getElementById("news-bar").insertAdjacentHTML("beforeend",news.slice(index,++index).reduce(function(prev,cur){
			return prev + `<div class="news-item">
					<div class="news-item-image">
						<img src="img/news/${cur.imgPath}">
					</div>
					<div class="news-item-brinfo">
						<p class="news-item-date">${dateToStr(cur.date)}</p>
						<p class="news-item-title ${cur.important ? "news-item-important" : "" }">${cur.title}</p>
					</div>
					<button data-news-id="${index-1}" class="news-item-bdetails">Докладніше</button>
					<button class="news-item-texthide displayNone">Сховати текст</button>
				</div>`
		},""));
		return true;
	}
	window.addEventListener("scroll",scrollFunc);
	function scrollFunc() {
		if(document.getElementById("news-bar").getBoundingClientRect().bottom<window.innerHeight)
		{
			document.querySelector(".loading").classList.remove("displayNone");
			if(!NewsModule.prototype.addNews())
			{
				window.removeEventListener("scroll",scrollFunc);
				document.querySelector(".loading").classList.add("displayNone");
			}
		}
	}
	document.getElementById("modal-news-close").addEventListener("click",function(e){
		e.target.parentNode.parentNode.classList.add("displayNone");
		modalWin.setIsOpen(false);
	});
	document.getElementById("news-bar").addEventListener("click",function(e){
		let el = e.target.closest(".news-item-bdetails");
		if(!el) return;
		let id = +el.dataset.newsId;
		if(document.documentElement.clientWidth > 600)
		{
		document.querySelector(".news-detail-img").src = "img/news/" + news[id].imgPath;
		document.querySelector(".news-detail-date").innerHTML = dateToStr(news[id].date);
		document.querySelector(".news-detail-title").innerHTML = news[id].title;
		document.querySelector(".news-detail-text").innerHTML = news[id].text;
		document.querySelector(".wrapper-detail-news").classList.remove("displayNone");
		modalWin.setIsOpen(true);
		}
		else
		{
			let ntext = document.createElement("p");
			ntext.classList.add("news-item-text");
			
			ntext.innerHTML = news[id].text;
			el.before(ntext);
			setTimeout(() => ntext.classList.add("news-itemText-show"),1);
			el.classList.add("displayNone");
			el.nextElementSibling.classList.remove("displayNone");
			function hideclick (ev) {
				ntext.classList.remove("news-itemText-show");
				ev.target.classList.add("displayNone");
				ev.target.previousElementSibling.classList.remove("displayNone");
				setTimeout(function(){
					ntext.remove();
					ev.target.removeEventListener("click",hideclick);
				},500);

			}
			el.nextElementSibling.addEventListener("click",hideclick);
		}
	});
}
