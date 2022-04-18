(function(){
	document.querySelector("#mob-nav-but").addEventListener("click",function(){
		document.querySelector("#mobnav").classList.toggle("show");
	});
	console.log(localStorage);
	let canvas1 = document.querySelector("#canvas1");
	let canvas2 = document.querySelector("#canvas2");
	let canvas3 = document.querySelector("#canvas3");
	let keys = Object.keys(localStorage);
	let data = [];
	for(let key of keys)
	{
		key = key.split('-');
		if (key[0] == "statistic")
		{
			let x = key[1].split('.').join(' ');
			let y = +localStorage.getItem(key[0]+"-"+key[1]);
			data.push(new Point(x,y));
		}
	}
	if(!data.length)
		data.push(new Point(0,0));
	BuildGraphic(canvas1,data,10,100);
	BuildHistogram(canvas2,data,10,100);
	BuildPieChart(canvas3,data,100);
})();
function Point(vx,vy) {
	return {
		x: vx,
		y: vy
	};
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