import DataSourceGateway from './data-source-gateway';

const API = {
    getMenu: 'menu.json',
}

const DataService = {
    // 获取最常使用的语言
    getMenu: function getMenu() {
        let result = DataSourceGateway.get(API.getMenu);
        return result;
    }
}

const render = function render(data) {
    var $code = document.getElementsByTagName('code');
    $code[0].textContent = JSON.stringify(data);
}

DataService.getMenu()
    .then(data => {
        console.log(data);
        render(data)
    })
    .catch(err=>{
        console.log(err);
        alert(err.message);
    })