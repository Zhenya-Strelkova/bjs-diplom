"use strict";

//Декоратор функции-callback - проверки успешности запроса
function decoratorCallbackSuccess(funcSuccess, funcError) {
    function wrapper(response) {
        if (response.success) {
            funcSuccess(response);
        } else if (funcError) {
            funcError(response);
        }
    }
    return wrapper;
}

//Декоратор вызова к серверу с использованием данных
function decoratorApiConnectWithData(methodName, funcCallback) {
    function wrapper(data) {
        ApiConnector[methodName](data, funcCallback);
    }
    return wrapper;
}

//действия в случае успешного входа/регистрации
function reloadPage() {
    location.reload();
}

//действия в случае неуспешного входа
function loginError(response) {
    currentUserForm.setLoginErrorMessage(response.error);
}

//действия в случае неуспешной регистрации
function registerError(response) {
    currentUserForm.setRegisterErrorMessage(response.error);
}

let currentUserForm = new UserForm();
currentUserForm.loginFormCallback =
    decoratorApiConnectWithData('login', decoratorCallbackSuccess(reloadPage, loginError));
currentUserForm.registerFormCallback =
    decoratorApiConnectWithData('register', decoratorCallbackSuccess(reloadPage, registerError));
