/// <reference path="/Scripts/jquery-1.10.2-vsdoc.js" />


ChatStatus = {
    LoggedOut : 0,
    Authenticating : 1,
    LoggedIn : 2
}

var strUsername = null;
var strPassword = "";
var auth;
var chatRef;
var chat;
var $btnSubmit;
var chatStatus = ChatStatus.LoggedOut;
var $logOut;

//function LogOut() {
//    chatStatus = ChatStatus.LoggedOut;
//    strUsername = null;
//    //curAuth.logout();
//    $(".chat-login-form").show();
//    $("#firechat-wrapper").hide();
//    $btnSubmit.css("background-image", "url(../images/submit.png)");
//    console.log("Logged out!");
//}

function ShowChat() { 
    var strLogOut = "";
    strLogOut = '<div class="tenth dropdown" style="" title="Αποσύνδεση">';
    strLogOut += '    <a class="btn full dropdown-toggle" data-toggle="dropdown" href="">';
    strLogOut += '    <span class="icon power-off"></span>';
    strLogOut += strUsername;
    strLogOut += '</div>';
    $logOut = $(strLogOut);
    $logOut.on("click", function () {
        //LogOut();
        window.location.replace("/Chat");
    });
    $("#firechat-header .clearfix:first").append($logOut);
    $("#firechat-btn-create-room-prompt").hide();
    $(".chat-login-form").hide();
    $("#firechat-wrapper").show();
    $btnSubmit.css("background-image", "url(../images/submit.png)");
    chatStatus = ChatStatus.LoggedIn;

}

function StopAuthentication() { 
    $btnSubmit.css("background-image", "url(../images/submit.png)");
    chatStatus = ChatStatus.LoggedOut;
    strUsername == null;
    strPassword = "";
}

function StartAuthentication() { 
    $btnSubmit.css("background-image", "url(../images/ajax-loader.gif)");
    chatStatus = ChatStatus.Authenticating;
}

function CreateChat() {
    chatRef = new Firebase('https://ptyxiouxos-chat.firebaseio.com');
    chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));
    auth = new FirebaseSimpleLogin(chatRef, function (error, user) {
        if (error) {
            // an error occurred while attempting login
            console.log(error);
            //alert(error.code);
            if (error.code == "INVALID_PASSWORD") {
                alert("Σφάλμα στα στοιχεία του χρήστη")
                StopAuthentication();
            }
        }
        else {
            if (user) {
                if (strUsername == null)
                    auth.logout();
                else
                    if (user.provider == "anonymous" && strUsername != null) {
                        $("#firechat-btn-create-room-prompt").hide(); // Hide Create room button
                        chat.setUser(user.id, strUsername);
                        setTimeout(function () {
                            //chat._chat.enterRoom('-JQ9asTxA9xl10tUTq6d');
                            //chat._chat.resumeSession();
                            ShowChat();

                        }, 500);
                    }
                    else
                        if (user.provider == "password") {
                            chat.setUser(user.id, strUsername);
                            setTimeout(function () {
                                //chat._chat.enterRoom('-JQ9asTxA9xl10tUTq6d');
                                //chat._chat.resumeSession();
                                ShowChat();

                            }, 500);
                        }
            }
            //    else 
            //        console.log("logged out!!");
        }
    });

}

function Login() { 
    var strName = $("#userName").val().trim();
    strPassword = $("#passWord").val().trim();
    if (chatStatus == ChatStatus.LoggedOut && strName != "") { 
        if (strName.toLowerCase() == "sakis" || strName.toLowerCase() == "pavlos") {
            if (strPassword == "")
                $("#passWord").show().focus();
            else {
                var strEmail;
                strEmail = (strName.toLowerCase() == "sakis") ? "petsossakis@gmail.com" : "toukiloglou@gmail.com";
                strUsername = strName;
                StartAuthentication();
                auth.login('password', {
                    email: strEmail,
                    password: strPassword
                });             
            }
        }
        else { 
            $("#passWord").hide();
            strPassword = "";
            StartAuthentication();
            var userRef = chatRef.child("user-names-online/" + strName.toLowerCase());
            userRef.once('value', function (snapshot) {
                if (snapshot.val() != null) {
                    alert('Ο χρήστης υπάρχει ήδη.');
                    StopAuthentication()
                } else {
                    strUsername = strName;
                    auth.login('anonymous');
                }
            });
        }
    }
}

$(function () {

    CreateChat();


    $(".chat-login-form").show();

    $("#chatIcon").on("click", function () {
        $(".chat-icon").animate({
            "margin-top": "50px"
        }, "fast", function () {
            $(".chat-user-data").fadeIn();
        });
    });
    $btnSubmit = $(".chat-user-name .submit");
    $btnSubmit.on("click", function () {
        Login();
    });
    $("#userName").on("keydown", function (event) {
        if (event.which == 13)
            Login();
    });
    $("#passWord").on("keydown", function (event) {
        if (event.which == 13)
            Login();
    });
});
