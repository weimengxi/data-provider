import DataSourceProxy from './agent';

const API = {
    // getMenu: 'api/menu.json',
    getMenu: 'api/test'
}

const DataService = {
    // 获取最常使用的语言
    getMenu: function getMenu() {
        let result = DataSourceProxy.get(API.getMenu);
        return result;
    }
}

const render = function render(data) {
	var $code = document.getElementsByTagName('code');
    $code[0].textContent = data;
}

DataService.getMenu()
    .then(data => {console.log(data); return data.items || []})
    .then(render)
    .catch(err => console.error(err))
