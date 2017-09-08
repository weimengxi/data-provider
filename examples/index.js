import DataSourceProxy from './agent';

const API = {
    // getMenu: 'api/menu.json',
    getMenu: 'api/menu',
    listDealUntreated: 'order/rule/get',
    listDealApproved: 'deal/approvelist'
}

const DataService = {
    // 获取最常使用的语言
    getMenu: function getMenu() {
        let result = DataSourceProxy.get(API.getMenu);
        return result;
    },
    listDealUntreated: function listDealUntreated() {
        let ruleinfo = {
            a: 1,
            b: ['bb', 'bc']
        }
        let result = DataSourceProxy.post(API.listDealUntreated,  ruleinfo );
        return result;
    },
    listDealApproved: function listDealApproved(params) {
        let result = DataSourceProxy.post(API.listDealApproved, { pn: 2 });
        return result;
    }
}

const render = function render(data) {
    var $code = document.getElementsByTagName('code');
    $code[0].textContent = data;
}

DataService.listDealUntreated()
    .then(data => { console.log(data); return data.items || [] })
    .then(render)
    .catch(err => console.error(err))

// DataService.listDealApproved()
//     .then(data => { console.log(data); return data.items || [] })
//     .then(render)
//     .catch(err => console.error(err))