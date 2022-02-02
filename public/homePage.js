"use strict";

//Кнопка выхода из личного кабинета
let logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        }
    });
};

//Подгрузка информации о текущем пользователе
ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

//Подгрузка курса валют
let ratesBoard = new RatesBoard();
function ratesBoardCall() {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}
ratesBoardCall();
setInterval(ratesBoardCall, 60000);

//Работа с избранным
let favoritesWidget = new FavoritesWidget();
//Подгрузка списка избранных пользователей
ApiConnector.getFavorites((response) => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});
//Добавление пользователя в список избранных
favoritesWidget.addUserCallback = (user) => {
    ApiConnector.addUserToFavorites(user, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, 'Пользователь добавлен');
        } else favoritesWidget.setMessage(response.success, response.error);
    });
};
//Удаление пользователя из списка избранных
favoritesWidget.removeUserCallback = (user) => {
    ApiConnector.removeUserFromFavorites(user, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, 'Пользователь удален');
        } else favoritesWidget.setMessage(response.success, response.error);
    });
};

//Операции с деньгами
let moneyManager = new MoneyManager();
//Пополнение своего баланса
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            favoritesWidget.setMessage(response.success, 'Баланс пополнен');
        } else favoritesWidget.setMessage(response.success, response.error);
    });
};
//Конвертирование валюты
moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            favoritesWidget.setMessage(response.success, 'Конвертирование валюты выполнено');
        } else favoritesWidget.setMessage(response.success, response.error);
    });
};
//Перевод валюты
moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, (response) => {
        console.log(response);
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            favoritesWidget.setMessage(response.success, 'Перевод завершен');
        } else favoritesWidget.setMessage(response.success, response.error);
    });
};