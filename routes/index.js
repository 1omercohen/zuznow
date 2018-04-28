var express = require('express');
var controllers = require('../controllers/index');
var router = express.Router();


router.get('/actors', function(req, res){
    return controllers.sakilaCtrl.getActors()
        .then(ans => { return res.status(200).json(ans[0]); })
});

router.get('/categories', function(req, res){
    return controllers.sakilaCtrl.getCategories()
        .then(ans => { return res.status(200).json(ans[0]); })
});

router.get('/languages', function(req, res){
    return controllers.sakilaCtrl.getLanguages()
        .then(ans => { return res.status(200).json(ans[0]); })
});

router.get('/logs', function(req, res){
    return controllers.sakilaCtrl.getLogs()
        .then(ans => { return res.status(200).json(ans[0]); })
});

router.post('/logs/create', function(req, res){
    return controllers.sakilaCtrl.addLog(req.body)
        .then(() => { return res.status(200); })
    
})

router.post('/:type', function(req, res){
    var type = req.params.type.replace(':','');
    var functionName = `filterBy${type}`;
    return controllers.sakilaCtrl[functionName](req.body)
        .then(ans => { return res.status(200).json(ans);})
});

module.exports = router;