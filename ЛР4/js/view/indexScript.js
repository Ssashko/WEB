+function(){
    let authprivilege = getCookieVal("auth");
    if(authprivilege == "0" || authprivilege == "1")
    {
        document.querySelectorAll(".onlyGuest").forEach(function(v){
            v.classList.add("displayNone");
        });
        document.querySelectorAll(".onlyUser").forEach(function(v){
            v.classList.remove("displayNone");
        });
        document.querySelectorAll(".userLogout").forEach(el => 
        {
            el.addEventListener("click",function(e){
            e.preventDefault();
            const params = {
                method : "POST",
                body: JSON.stringify({"mode":"relogin"}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            fetch("auth",params).then(response => response.json())
            .then(jsonData => {
                objMsgBox.showMsg(jsonData.title,jsonData.message,jsonData.type);
                if(jsonData.redirect == "1")
                    setTimeout(() => window.location.href = "/", 2000);
             
            });
            });
        });
    }
    if(authprivilege != "1")
    {
        document.querySelectorAll(".onlyAdmin").forEach(function(v){
            v.classList.add("displayNone");
        });
    }

    
        
}();

function getCookieVal (key)
{
    let pairs = document.cookie.split(";");
    for(let pair of pairs)
    {
        let value = pair.split("=");
        value = [decodeURIComponent(value[0].trim()), decodeURIComponent(value[1].trim())];
        if(value[0] == key)
        return value[1];
    }
    return null;
}