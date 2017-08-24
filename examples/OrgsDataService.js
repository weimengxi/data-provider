// var  DataSourceGateway = require('../dist/DataSourceGateway');
var  DataSourceGateway = require('../src');


const API = {
    getTopLanguages: 'orgs/g-bbfe/top_languages'
}

const OrgsDataService = {
	// 获取最常使用的语言
	getTopLanguages: function getTopLanguages() {
	    let result = DataSourceGateway.get(API.getTopLanguages);
	    return result;
	},
}

module.exports = OrgsDataService;

