(async function(){
	document.querySelector("#mob-nav-but").addEventListener("click",function(){
		document.querySelector("#mobnav").classList.toggle("show");
	});
	let canvas1 = document.querySelector("#canvas1");
	let canvas2 = document.querySelector("#canvas2");
	let canvas3 = document.querySelector("#canvas3");
	let data = await fetch("advert").then(response => response.json())
	.then(jsonData => {
		if(jsonData.mtype == "alert")
			objMsgBox.showMsg(jsonData.title,jsonData.message,jsonData.type);
		else if(jsonData.mtype == "ok")
			return jsonData["data"];
	});
	if(!data.length)
		data.push(new Point(0,0));
	data.forEach(function(v,i,a){
		a[i].y = parseFloat(v.y);
	});
	BuildGraphic(canvas1,data,10,100);
	BuildHistogram(canvas2,data,10,100);
	BuildPieChart(canvas3,data,100);
	fileLoading();
	document.getElementById("adminDelGood").addEventListener("click",function(e){
		e.preventDefault();
		let id = this.previousElementSibling.value;
		const params = {
			method : "DELETE",
			body: JSON.stringify({"id" : id}),
			headers: {
				'Content-Type': 'application/json'
			}
		};
		fetch("goodEdit", params).then(response => response.json())
		.then(jsonData => {
			objMsgBox.showMsg(jsonData.title,jsonData.message,jsonData.type);
		});
	});
	document.getElementById("adminAddGood").addEventListener("click",async function(e){
		e.preventDefault();
		let tfile = document.getElementById("adminAddGood-file").files[0];
		let url;
		if(typeof tfile == "undefined")
			url = "";
		else
			url = await UploadFile(tfile);
		let name = document.getElementById("adminAddGood-name").value;
		let describe = document.getElementById("adminAddGood-desc").value;
		let price = document.getElementById("adminAddGood-price").value;
		let category = document.getElementById("adminAddGood-category").value;
		const params = {
			method : "POST",
			body: JSON.stringify({
				"title" : name,
				"text" : describe,
				"price" : price,
				"category" : category,
				"photoName" : url.split(".")[0],
				"photoType" : url.split(".")[1]
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		};
		fetch("goodEdit", params).then(response => response.json())
		.then(jsonData => {
			objMsgBox.showMsg(jsonData.title,jsonData.message,jsonData.type);
		});

	});
	document.getElementById("adminChangeGood").addEventListener("click",async function(e){
		e.preventDefault();
		let tfile = document.getElementById("adminChangeGood-file").files[0];
		let url;
		if(typeof tfile == "undefined")
			url = ".";
		else
			url = await UploadFile(tfile);
		let id = document.getElementById("adminChangeGood-id").value;
		let name = document.getElementById("adminChangeGood-name").value;
		let describe = document.getElementById("adminChangeGood-desc").value;
		let price = document.getElementById("adminChangeGood-price").value;
		let category = document.getElementById("adminChangeGood-category").value;
		const params = {
			method : "PUT",
			body: JSON.stringify({
				"id" : id,
				"title" : name,
				"text" : describe,
				"price" : price,
				"category" : category,
				"photoName" : url.split(".")[0],
				"photoType" : url.split(".")[1]
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		};
		fetch("goodEdit", params).then(response => response.json())
		.then(jsonData => {
			objMsgBox.showMsg(jsonData.title,jsonData.message,jsonData.type);
		});

	});
})();
function Point(vx,vy) {
	return {
		x: vx,
		y: vy
	};
}


async function UploadFile (file)
{
	const form = new FormData();
	form.append('image', file);
	let url;
	return fetch("photoUpload",{method : "POST", body : form}).then(response => response.json())
	.then(jsonData => {
		if(jsonData.status == "error")
			return null;
		else
			return jsonData.url;
	});
} 
function fileLoading () {
	document.querySelectorAll(".fileUpdate-submit").forEach(el => {
		el.addEventListener("click",function(e){
			e.preventDefault();
			let fl = el.previousElementSibling.previousElementSibling;
			fl.addEventListener("change",function(){
				if(fl.files.length)
				{
					var freader = new FileReader();
					freader.onload = () => {
						fl.previousElementSibling.style.backgroundImage = "url('"+ freader.result +"')";	
					};	
					el.previousElementSibling.innerHTML = fl.value;
					fl.previousElementSibling.style.backgroundImage = "url('/img/loading.gif')";
					freader.readAsDataURL(fl.files[0]);
				}
				else 
				{
					el.previousElementSibling.innerHTML = "Назва файла";
					fl.previousElementSibling.style.backgroundImage = "url('/img/file_upload_def.png')";
				}

			});
			fl.click();
		})
	});
}
function BuildHistogram (canvas,data, markcount = 10,textfield = 20){
	let ctx = canvas.getContext('2d');
	let width = canvas.width;
	let height = canvas.height;
	data.sort(function(a,b) {
		return a.x - b.x;
	});
	let maxy = data.reduce((prev, cur) => Math.max(prev,cur.y),data[0].y);
	let miny = data.reduce((prev, cur) => Math.min(prev,cur.y),data[0].y);
	ctx.fillStyle = "black";
	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.moveTo(20,20);
	ctx.lineTo(20,height-20);
	ctx.lineTo(height-20,height-20);
	ctx.stroke();

	ctx.fillStyle = "red";
	ctx.lineWidth = 1;
	ctx.beginPath();
	let markHeigth = (height-40)/markcount;
	let curVal;
	for(let i=0;i < markcount;i++)
	{
		ctx.moveTo(10,markHeigth*i+20);
		ctx.lineTo(20,markHeigth*i+20);
		curVal = miny+((maxy-miny)/markcount)*(markcount-i);
		ctx.fillText(curVal.toFixed(2),2,markHeigth*i+20,18);
	}
	ctx.fillText(miny.toFixed(2),2,height-20,18);
	let markWidth = (width-40)/data.length;
	for(let i=1;i <= data.length;i++)
	{
		ctx.moveTo(markWidth*i+20,height-10);
		ctx.lineTo(markWidth*i+20,height-20);
		ctx.fillText(data[i-1].x,markWidth*i-markWidth*0.5-textfield/4,height-10,textfield);
	}
	ctx.fillStyle = "blue"; 
	for(let i=1;i <= data.length;i++)
	{
		let coord = ((width-40)/data.length)*i+20;
		curVal = ((height-40)/(maxy-miny))*(data[i-1].y-miny);
		ctx.fillRect(coord-markWidth*0.8,height-20-curVal,markWidth*0.6,curVal+1);
	}
	ctx.stroke();
}
function BuildGraphic (canvas,data, markcount = 10, textfield = 20){
	let ctx = canvas.getContext('2d');
	let width = canvas.width;
	let height = canvas.height;
	data.sort(function(a,b) {
		return a.x - b.x;
	});
	let maxy = data.reduce((prev, cur) => Math.max(prev,cur.y),data[0].y);
	let miny = data.reduce((prev, cur) => Math.min(prev,cur.y),data[0].y);
	ctx.fillStyle = "black";
	ctx.lineWidth = 2;

	ctx.beginPath();
	ctx.moveTo(20,20);
	ctx.lineTo(20,height-20);
	ctx.lineTo(height-20,height-20);
	ctx.stroke();

	ctx.fillStyle = "red";
	ctx.lineWidth = 1;
	ctx.beginPath();
	let markHeigth = (height-40)/markcount;
	let curVal;
	for(let i=0;i < markcount;i++)
	{
		ctx.moveTo(10,markHeigth*i+20);
		ctx.lineTo(20,markHeigth*i+20);
		curVal = miny+((maxy-miny)/markcount)*(markcount-i);
		ctx.fillText(curVal.toFixed(2),2,markHeigth*i+20,18);
	}
	ctx.fillText(miny.toFixed(2),2,height-20,18);
	let markWidth = (width-40)/data.length;
	for(let i=1;i <= data.length;i++)
	{
		ctx.moveTo(markWidth*i+20,height-10);
		ctx.lineTo(markWidth*i+20,height-20);
		ctx.fillText(data[i-1].x,markWidth*i,height,textfield);
	}
	ctx.fillStyle = "green";
	ctx.moveTo((width-40)/data.length+20,height-20-((height-40)/(maxy-miny))*(data[0].y-miny));
	for(let i=1;i <= data.length;i++)
	{
		let coord = ((width-40)/data.length)*i+20;
		curVal = ((height-40)/(maxy-miny))*(data[i-1].y-miny);
		ctx.lineTo(coord,height-20-curVal);
	}
	ctx.stroke();
}
function BuildPieChart (canvas,data,textfield = 20){
	let ctx = canvas.getContext('2d');
	let width = canvas.width;
	let height = canvas.height;
	let radius = Math.min(width,height)/4;
	let sum = data.reduce((prev,cur) => prev+cur.y,0);
	let previousAngle = 0;
	const colours = ["#32a852","#c9c418","#182ac9","#b82870", "#28bdb8", "#d15b3b"];
	data.forEach(function(el,i){
		let fraction = el.y/sum;
		let curAngle = previousAngle + fraction*2*Math.PI;
		let gradient = ctx.createRadialGradient(width/2,height/2, 5, width/2,height/2, radius); 
		gradient.addColorStop(0,"white"); 
		gradient.addColorStop(1,colours[i%colours.length]); 
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.moveTo(width/2,height/2);
		ctx.arc(width/2,height/2,radius,previousAngle,curAngle);
		ctx.lineTo(width/2,height/2);
		ctx.fill();
		let coord = getCenterTriangle(width/2,height/2,width/2 + radius*Math.cos(previousAngle),height/2 + radius*Math.sin(previousAngle),width/2 + radius*Math.cos(curAngle), height/2 + radius*Math.sin(curAngle));
		ctx.font = 'bold 12pt Roboto';
		ctx.fillStyle = "red";
		ctx.fillText(el.x,coord[0],coord[1],textfield);
		ctx.stroke();
		previousAngle = curAngle;
	})
}
function getCenterTriangle (x1,y1,x2,y2,x3,y3) {
	let z1 = (x1+x2-2*x3)/(y1+y2-2*y3);
	let z2 = (x3+x2-2*x1)/(y3+y2-2*y1);
	let y = (z2*y1-z1*y3+x3-x1)/(z2-z1);
	let x = z1*y-z1*y3+x3;
	return [x,y];
}