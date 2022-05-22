+function() {
    const regExpPassword = /^(?=.{0,29}\d)(?=.{0,29}[!@#$%^&*])(?=.{0,29}[a-z])(?=.{0,29}[A-Z])[0-9a-zA-Z!@#$%^&*]{6,30}$/;
    const regExpLogin = /^[A-Za-z_]\w{2,29}$/;
    const regExpCaptcha = /^\d{6}$/;
    let objMsgBox = new MsgBox();
    
    document.getElementById("logSubmit").addEventListener("click",function(e){
        e.preventDefault();
        let login = document.getElementById("logLogin").value;
        let pass = document.getElementById("logPass").value;
        let captcha = document.getElementById("logCaptcha").value;
        if (!regExpPassword.test(pass)) 
            objMsgBox.showMsg("Помилка","Пароль повинен містити від 6 до 30 символів та містити спецсимвол (!@#$%^&*) малу та велику латинські літери, цифру");
        else if (!regExpLogin.test(login))
            objMsgBox.showMsg("Помилка","Логін повинен містити від 3 до 30 символів: 1 символ - буква латиського алфавіту та _, з 2-го символу також цифра");
        else if (!regExpCaptcha.test(captcha))
            objMsgBox.showMsg("Помилка","Капча - 6-цифрове число");
        else
            {
                const params = {
                    method : "POST",
                    body: JSON.stringify({"mode":"login", "login" : login, "pass" : pass, "captcha" : captcha}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                fetch("auth",params).then(response => response.json())
                .then(jsonData => {
                    objMsgBox.showMsg(jsonData.title,jsonData.message,jsonData.type);
                    if(jsonData.redirect == "1")
                        setTimeout(() => window.location.href = "/", 2000);
                    else
                        document.getElementById("logCaptchaReload").click();    
                });
            }

    });
    document.querySelector(".form1").addEventListener("click",function(e){
        let el = e.target.closest("i");
        if(!el) return;
        if(el.classList.contains("showPass"))
        {
            el.nextElementSibling.classList.remove("displayNone");
            el.classList.add("displayNone");
            el.previousElementSibling.type = "text";
            
        }
        else if(el.classList.contains("hidePass"))
        {
            el.previousElementSibling.classList.remove("displayNone");
            el.classList.add("displayNone");
            el.previousElementSibling.previousElementSibling.type = "password"; 
        }
    });
    document.getElementById("logCaptchaReload").addEventListener("click",function(){
        document.querySelector(".captcha-wrapper > img").src = "captchaEmpty";
        document.querySelector(".captcha-wrapper > img").src = "captcha";
    });
}();
