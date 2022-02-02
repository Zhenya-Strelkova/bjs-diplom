"use strict";

//----------------ДЕКОРАТОРЫ----------------------------------------------
//Декоратор функции-callback - проверки успешности запроса
function decoratorCallbackSuccess(funcSuccess, funcError) {
    function wrapper(response) {
        if (response.success) {
            funcSuccess(response);
        } else {
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

//Декоратор вызова к серверу без использования данных
function decoratorApiConnectWithoutData(methodName, funcCallback) {
    function wrapper() {
        ApiConnector[methodName](funcCallback);
    }
    return wrapper;
}

function decoratorSetMessage(func, message) {
    function wrapper(response) {
        if (func) func(response);
        if (response.success) {
            favoritesWidget.setMessage(response.success, message);
        } else favoritesWidget.setMessage(response.success, response.error);
    }
    return wrapper;
}

//------------------ПОДГРУЗКА НАЧАЛЬНЫХ ДАННЫХ СТРАНИЦЫ------------------------------------
//действия в случае успешного выхода
function reloadPage() {
    location.reload();
}

//Кнопка выхода из личного кабинета
let logoutButton = new LogoutButton();
logoutButton.action =
    decoratorApiConnectWithoutData('logout', decoratorCallbackSuccess(reloadPage));

//Подгрузка информации о текущем пользователе
function showProfileSuccess(response) {
    ProfileWidget.showProfile(response.data);
}
decoratorApiConnectWithoutData('current', decoratorCallbackSuccess(showProfileSuccess))();

//Подгрузка курса валют
let ratesBoard = new RatesBoard();
function getStocksSuccess(response) {
    ratesBoard.clearTable();
    ratesBoard.fillTable(response.data);
}
const ratesBoardCall = decoratorApiConnectWithoutData('getStocks', decoratorCallbackSuccess(getStocksSuccess));
ratesBoardCall();
setInterval(ratesBoardCall, 60000);

//---------------------РАБОТА С ИЗБРАННЫМ-------------------------------------
let favoritesWidget = new FavoritesWidget();

//Подгрузка списка избранных пользователей
function getFavoritesSuccess(response) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
}
decoratorApiConnectWithoutData('getFavorites', decoratorCallbackSuccess(getFavoritesSuccess))();

//Добавление пользователя в список избранных
favoritesWidget.addUserCallback =
    decoratorApiConnectWithData('addUserToFavorites',
        decoratorCallbackSuccess(decoratorSetMessage(getFavoritesSuccess, 'Пользователь добавлен'), decoratorSetMessage()));

//Удаление пользователя из списка избранных
favoritesWidget.removeUserCallback =
    decoratorApiConnectWithData('removeUserFromFavorites',
        decoratorCallbackSuccess(decoratorSetMessage(getFavoritesSuccess, 'Пользователь удален'), decoratorSetMessage()));

//--------------------ОПЕРАЦИИ С ДЕНЬГАМИ-------------------------------
let moneyManager = new MoneyManager();

//Пополнение своего баланса
moneyManager.addMoneyCallback =
    decoratorApiConnectWithData('addMoney',
        decoratorCallbackSuccess(decoratorSetMessage(showProfileSuccess, 'Баланс пополнен'), decoratorSetMessage()));

//Конвертирование валюты
moneyManager.conversionMoneyCallback =
    decoratorApiConnectWithData('convertMoney',
        decoratorCallbackSuccess(decoratorSetMessage(showProfileSuccess, 'Конвертирование валюты выполнено'),
            decoratorSetMessage()));

//Перевод валюты
moneyManager.sendMoneyCallback =
    decoratorApiConnectWithData('transferMoney',
        decoratorCallbackSuccess(decoratorSetMessage(showProfileSuccess, 'Перевод завершен'), decoratorSetMessage()));
