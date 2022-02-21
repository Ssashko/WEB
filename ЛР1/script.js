(function(){
	let countBlock = 4;
	for (let i = 0; i < arguments.length; i++) 
		arguments[i]();
	let defaultPropertyDisplay = [];
	for (let i = 1; i < countBlock;i++){
		defaultPropertyDisplay.push(document.getElementById("funcForm"+i).style.display);
		document.getElementById("funcForm"+i).style.display = "none";
	}
	for (let i = 1; i < countBlock;i++){
		document.getElementById("func"+i).addEventListener("click", function() {
			document.getElementById("start_txt").style.display = "none";
			for (let j = 1; j < countBlock;j++)
				document.getElementById("funcForm"+j).style.display = "none";
			document.getElementById("funcForm"+i).style.display = defaultPropertyDisplay[i-1];
		});

	}

})(InitCalc,InitGCD,InitLCM,ModalWinInit,LogoInit);

function InitGCD (){
	document.getElementById("form2Calc").addEventListener("click", function(){
		let numbers = document.getElementById("form2TextEdit").value.split(' ');
		try {
			numbers.forEach(function(val,ind,arr){
				arr[ind] = parseInt(val);
				if(isNaN(arr[ind]))
					throw "Некоректний символ(и): " + val;
			});
		} catch (e) {
			AlertEx("Помилка", e);
			document.getElementById("form2Result").innerHTML = "Результат: <b>помилка</b>";
			return;
		}
		document.getElementById("form2Result").innerHTML = "Результат: <b>" + gcd(numbers) + "</b>";
	});
}
function InitLCM (){
	document.getElementById("form3Calc").addEventListener("click", function(){
		let numbers = document.getElementById("form3TextEdit").value.split(' ');
		try {
			numbers.forEach(function(val,ind,arr){
				arr[ind] = parseInt(val.trim());
				if(isNaN(arr[ind]))
					throw "Некоректний символ(и): " + val;
			});
		} catch (e) {
			AlertEx("Помилка", e);
			document.getElementById("form3Result").innerHTML = "Результат: <b>помилка</b>";
			return;
		}
		document.getElementById("form3Result").innerHTML = "Результат: <b>" + lcm(numbers) + "</b>";
	});
}
function lcm (numbers)
{
	if (numbers.length == 0)
		return 0;
	if (numbers.length == 1)
		return numbers[0];
	return lcm2(numbers.pop(),lcm(numbers));
}
function lcm2 (a, b)
{

	return a*b/gcd([a,b]);
}
function gcd (numbers)
{
	let min = 0
	let countNonZero = 2;
	while(countNonZero > 1)
	{
		countNonZero = 0;
		for(let i=0; i < numbers.length;i++)
			if(numbers[i] != 0) 
			{ 
				countNonZero++;
				if(Math.abs(numbers[i] < numbers[min]))
				min = i;
			}
		for(let i=0; i < numbers.length;i++)
			if (i != min)
				numbers[i]%=numbers[min];
	}
	for(let i=0;i < numbers.length;i++)
		if(numbers[i])
			return numbers[i];
}
function InitCalc (){
	let displayDom  = document.getElementById("infoPanel");
	let States = {
		zeroPermit : 0b0000001,
		pointPermit : 0b0000010,
		digitPermit : 0b0000100,
		scopeOpenPermit : 0b0001000,
		scopeClosePermit : 0b0010000,
		unaryOperationPermit : 0b0100000,
		binaryOperationPermit : 0b1000000,
		countOpenScope : 0,
		IsPointNumber : false,
	}
	States.permits = States.pointPermit | States.digitPermit | States.scopeOpenPermit|States.unaryOperationPermit;
	document.getElementById("btmC").addEventListener("click", function () {
		displayDom.innerHTML = "0";
		States.permits = States.pointPermit | States.digitPermit | States.scopeOpenPermit|States.unaryOperationPermit;
	});
	document.getElementById("btm0").addEventListener("click", function () {
		if ((States.zeroPermit&States.permits) && (States.digitPermit&States.permits))
		{
			displayDom.innerHTML += "0";
			States.permits = States.zeroPermit|States.pointPermit|States.digitPermit|States.scopeClosePermit|States.binaryOperationPermit;

		}
	});
	document.getElementById("btmPoint").addEventListener("click", function () {
		if (States.pointPermit&States.permits && !States.IsPointNumber) {
			displayDom.innerHTML += ".";
			States.permits = States.zeroPermit|States.digitPermit;
			States.IsPointNumber = true;
		}
	});
	document.getElementById("btmOpScope").addEventListener("click", function () {
		if (States.scopeOpenPermit&States.permits){
			if (displayDom.innerHTML == "0")
				displayDom.innerHTML = "";
			displayDom.innerHTML += "(";
			States.permits = States.unaryOperationPermit|States.scopeOpenPermit|States.zeroPermit|States.digitPermit;
			States.countOpenScope++;
			States.IsPointNumber = false;
		}
	});
	document.getElementById("btmClScope").addEventListener("click", function () {
		if (States.scopeClosePermit&States.permits && States.countOpenScope > 0){
			displayDom.innerHTML += ")";
			States.permits = States.binaryOperationPermit|States.scopeClosePermit;
			States.countOpenScope--;
			States.IsPointNumber = false;
		}
	});
	document.getElementById("btmPlus").addEventListener("click", function () {
		if ((States.unaryOperationPermit&States.permits) || (States.binaryOperationPermit&States.permits))
		{
			if((States.unaryOperationPermit&States.permits)&&(displayDom.innerHTML=='0'))
				displayDom.innerHTML = '';
			displayDom.innerHTML += "+";
			States.permits = States.zeroPermit|States.digitPermit|States.scopeOpenPermit;
			States.IsPointNumber = false;
		}
	});
	document.getElementById("btmMinus").addEventListener("click", function () {
		if ((States.unaryOperationPermit&States.permits) || (States.binaryOperationPermit&States.permits)){
			if((States.unaryOperationPermit&States.permits)&&(displayDom.innerHTML=='0'))
				displayDom.innerHTML = '';
			displayDom.innerHTML += "-";
			States.permits = States.zeroPermit|States.digitPermit|States.scopeOpenPermit;
			States.IsPointNumber = false;
		}
	});
		document.getElementById("btmMult").addEventListener("click", function () {
		if (States.binaryOperationPermit&States.permits){
			displayDom.innerHTML += "*";
			States.permits = States.zeroPermit|States.digitPermit|States.scopeOpenPermit;
			States.IsPointNumber = false;
		}
	});
	document.getElementById("btmDiv").addEventListener("click", function () {
		if (States.binaryOperationPermit&States.permits){
			displayDom.innerHTML += "/";
			States.permits = States.zeroPermit|States.digitPermit|States.scopeOpenPermit;
			States.IsPointNumber = false;
		}
	});
	let buttonArrNumericId = {"btm1" : "1","btm2" : "2", "btm3" : "3","btm4" : "4", "btm5" : "5","btm6" : "6" , "btm7" : "7" , "btm8" : "8", "btm9" : "9"};
	for(let id in buttonArrNumericId)
	{
		document.getElementById(id).addEventListener("click", function () {
			if (States.digitPermit&States.permits) {
				if (displayDom.innerHTML == "0")
					displayDom.innerHTML = "";
				displayDom.innerHTML += buttonArrNumericId[id];
				States.permits = States.zeroPermit|States.pointPermit|States.digitPermit|States.scopeClosePermit|States.binaryOperationPermit;
			}
		});
	}
	document.getElementById("btmD").addEventListener("click", function () {
		if (displayDom.innerHTML.length == 1){
			displayDom.innerHTML = "0";
			States.permits = States.pointPermit | States.digitPermit | States.scopeOpenPermit|States.unaryOperationPermit;
		}
		else
		{
			let del_symbol = displayDom.innerHTML.slice(-1);
			if (del_symbol == '.')
				States.IsPointNumber = false;
			else if (del_symbol == "(")
				States.countOpenScope--;
			else if (del_symbol == ")")
				States.countOpenScope++;
			displayDom.innerHTML = displayDom.innerHTML.slice(0,-1);
			prev_symbol = displayDom.innerHTML.slice(-1);
			if (!isNaN(parseInt(prev_symbol)))
				States.permits = States.zeroPermit|States.pointPermit|States.digitPermit|States.scopeClosePermit|States.binaryOperationPermit;
			else if (["+","-","*","/"].indexOf(prev_symbol) != -1)
				States.permits = States.zeroPermit|States.digitPermit|States.scopeOpenPermit;
			else if (prev_symbol == ".")
				States.permits = States.zeroPermit|States.digitPermit;
			else if (prev_symbol == "(")
				States.permits = States.unaryOperationPermit|States.scopeOpenPermit|States.zeroPermit|States.digitPermit;
			else if (prev_symbol == ")")
				States.permits = States.binaryOperationPermit;
		}

	});
	document.getElementById("btmEq").addEventListener("click", function(){
		displayDom.innerHTML = calcExpresion(displayDom.innerHTML);
		if (displayDom.innerHTML == '0')
			States.permits = States.pointPermit | States.digitPermit | States.scopeOpenPermit|States.unaryOperationPermit;
		else if (displayDom.innerHTML == "ERROR" || displayDom.innerHTML  == "NaN" || displayDom.innerHTML  == "undefined")
		{
			displayDom.innerHTML = '0';
			States.permits = States.pointPermit | States.digitPermit | States.scopeOpenPermit|States.unaryOperationPermit;
			AlertEx("Помилка", "Некоректний вираз!");
		}
		else if (displayDom.innerHTML == "Infinity")
		{
			displayDom.innerHTML = '0';
			States.permits = States.pointPermit | States.digitPermit | States.scopeOpenPermit|States.unaryOperationPermit;
			AlertEx("Помилка", " Ділення на нуль!");
		}
		else
			States.permits = States.zeroPermit|States.pointPermit|States.digitPermit|States.scopeClosePermit|States.binaryOperationPermit;

	});
}



function calcExpresion (exp){
	getPriority = (op) => (op == '+' || op == '-' ? 1 : (op == '*' || op == '/' ? 2  : (op == '+~' || op == '-~' ? 3  : 0)));
	calcOp = function(st,op){
		if (op[1] == '~')
		{
			let arg1 = st.pop();
			switch(op)
			{
				case "+~": st.push(arg1);break;
				case "-~": st.push(-arg1);break;
			}
		}
		else
		{
			let arg1 = st.pop(), arg2 = st.pop();
			switch(op)
			{
				case "+": st.push(arg2+arg1);break;
				case "-": st.push(arg2-arg1);break;
				case "*": st.push(arg2*arg1);break;
				case "/": st.push(arg2/arg1);break;
			}
		}
	};
	let opStack = [];
	let numStack = [];
	let unary = true;
	for (let i = 0; i < exp.length; i++){
		if (['+','-','*','/'].indexOf(exp[i]) != -1){
			let op = exp[i];
			if (unary && ['+','-'].indexOf(op)) op += '~';
			while(opStack.length && getPriority(op) <= getPriority(opStack.at(-1)))
			{
				calcOp(numStack,opStack.at(-1));
				opStack.pop();
			}
			opStack.push(op);
			unary = true;
		}
		else if (exp[i] == '('){
			opStack.push('(');
			unary = true;
		}
		else if (exp[i] == ')'){
			while(opStack.at(-1) != '(')
			{
				calcOp(numStack,opStack.at(-1));
				opStack.pop();
			}
			opStack.pop();
			unary = false;
		}
		else{
			let operand = '';
			while ((!isNaN(parseInt(exp[i])) || exp[i] == '.') && i < exp.length)
				operand+=exp[i++];
			i--;
			if(operand != '')
				numStack.push(parseFloat(operand));
			else
				return "ERROR";
			unary = false;
		}
	}
	while(opStack.length){
		calcOp(numStack,opStack.at(-1));
		opStack.pop();
	}
	return(String(numStack.at(-1)));
}

function LogoInit(){
	document.getElementById("logo").addEventListener("click",function(){
		document.getElementById("wrap_info").classList.remove("displayNone");

	});
}

function AlertEx(title , msg){
	document.getElementById("wrap_alert").classList.remove("displayNone");
	document.getElementById("wnd_alert_title").innerHTML = title;
	document.getElementById("wnd_alert_msg").innerHTML = msg;
}
function ModalWinInit(){
	document.getElementById("wnd_alert_close").addEventListener("click",function(){
		document.getElementById("wrap_alert").classList.add("displayNone");
	});
	document.getElementById("wnd_info_close").addEventListener("click",function(){
		document.getElementById("wrap_info").classList.add("displayNone");
	});
}


