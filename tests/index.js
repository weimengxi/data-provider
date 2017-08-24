var OrgsDataService = require('../examples/OrgsDataService');

OrgsDataService.getTopLanguages()
.then(data => console.log(data))
.catch(err => console.error(err))