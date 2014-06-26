var strUsername;
var auth;
var chatRef;
var chat;
var authenticating = false;

function createChat() {
    auth = new FirebaseSimpleLogin(chatRef, function (error, user) {
        if (error) {
            // an error occurred while attempting login
            console.log(error);
            alert(error.code);
        }
        else {
            if (user) {
                if (strUsername == null) {
                    auth.logout();
                    return;
                }
                if (user.provider == "anonymous") {
                    chat.setUser(user.id, strUsername);
                    setTimeout(function () {
                        //chat._chat.enterRoom('-JQ9asTxA9xl10tUTq6d');
                        //chat.resumeSession();
                        $("#firechat-btn-create-room-prompt").hide();
                        $(".chat-login-form").hide();
                        $("#firechat-wrapper").show();
                        authenticating = false;
                    }, 500);
                }
                else
                    if (user.provider == "password") {
                        chat.setUser(user.id, user.email);
                    }
            }
        }
    });
    console.log(auth);
}

$(function () {
    chatRef = new Firebase('https://ptyxiouxos-chat.firebaseio.com');
    chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));
    createChat();


    $("#chatIcon").on("click", function () {
        $(".chat-icon").animate({
            "margin-top": "50px"
        }, "fast", function () {
            $(".chat-user-data").fadeIn();
        });

        //$( ".chat-login-form" ).animate({ "left": "+=50px" }, "slow" );
    });

    $(".chat-user-name .submit").on("click", function () {
        var strName = $("#userName").val().trim();
        var $btnSubmit = $(this);
        if (!authenticating && strName != "") {
            var userRef = chatRef.child("user-names-online/" + strName.toLowerCase());
            $btnSubmit.css("background-image", "url(../images/ajax-loader.gif)");
            authenticating = true;
            userRef.once('value', function (snapshot) {
                if (snapshot.val() != null) {
                    alert('Ο χρήστης υπάρχει ήδη.');
                    $btnSubmit.css("background-image", "url(../images/submit.png)");
                    authenticating = false;
                } else {
                    strUsername = strName;
                    auth.login('anonymous');
                }
            });


        }
    });
    //auth.login('anonymous');
    //auth.login('password', {
    //    email: 'petsossakis@gmail.com',
    //    password: 'sak200174'
    //});   

});
