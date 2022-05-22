+function() {
    const regExpPassword = /^(?=.{0,29}\d)(?=.{0,29}[!@#$%^&*])(?=.{0,29}[a-z])(?=.{0,29}[A-Z])[0-9a-zA-Z!@#$%^&*]{6,30}$/;
    const regExpLogin = /^[A-Za-z_]\w{2,29}$/;
    const regExpEmail = /^[A-Za-z_.][A-Za-z0-9_.]{2,29}@[A-Za-z][A-Za-z0-9.]*\.[A-Za-z][A-Za-z0-9]*$/;
    const regExpCaptcha = /^\d{6}$/;
    
    document.getElementById("regSubmit").addEventListener("click",function(e){
        e.preventDefault();
        let login = document.getElementById("regLogin").value;
        let email = document.getElementById("regEmail").value;
        let pass = document.getElementById("regPass").value;
        let passR = document.getElementById("regPassRepeat").value;
        let captcha = document.getElementById("regCaptcha").value;
        console.log(pass);
        if (!regExpPassword.test(pass)) 
            objMsgBox.showMsg("Помилка","Пароль повинен містити від 6 до 30 символів та містити спецсимвол (!@#$%^&*) малу та велику латинські літери, цифру");
        else if (!regExpLogin.test(login))
            objMsgBox.showMsg("Помилка","Логін повинен містити від 3 до 30 символів: 1 символ - буква латиського алфавіту та _, з 2-го символу також цифра");
        else if (!regExpEmail.test(email))
            objMsgBox.showMsg("Помилка","Некоректний e-mail");
        else if (pass != passR) 
            objMsgBox.showMsg("Помилка","Паролі не збігаються!");
        else if (!regExpCaptcha.test(captcha))
            objMsgBox.showMsg("Помилка","Капча - 6-цифрове число");
        else
            {
                const params = {
                    method : "POST",
                    body: JSON.stringify({"mode":"register", "login" : login, "pass" : pass, "email" : email, "captcha" : captcha}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                fetch("auth",params).then(response => response.json())
                .then(jsonData => {
                    objMsgBox.showMsg(jsonData.title,jsonData.message,jsonData.type);
                    if(jsonData.redirect == "1")
                        setTimeout(() => window.location.href = "login", 2000);
                    else
                        document.getElementById("regCaptchaReload").click();
                        
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
    document.getElementById("regCaptchaReload").addEventListener("click",function(){
        document.querySelector(".captcha-wrapper > img").src = "captchaEmpty";
        document.querySelector(".captcha-wrapper > img").src = "captcha";
    });
}();
