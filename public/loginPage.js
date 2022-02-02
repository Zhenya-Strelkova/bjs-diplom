"use strict";

let currentUserForm = new UserForm();
currentUserForm.loginFormCallback = (data) => {
    ApiConnector.login(data, (response) => {
        if (response.success) {
            location.reload();
        } else {
            currentUserForm.setLoginErrorMessage(response.error);
        }
    });

}

currentUserForm.registerFormCallback = (data) => {
    ApiConnector.register(data, (response) => {
        if (response.success) {
            location.reload();
        } else {
            currentUserForm.setRegisterErrorMessage(response.error);
        }
    });

}