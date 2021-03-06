/*jslint node:true, nomen: true*/

'use strict';

var express = require('express'),
    YUI = require('express-yui'),
    Locator = require('locator'),
    LocatorHandlebars = require('locator-handlebars'),
    LocatorMicro = require('locator-micro'),
    app = express();

app.set('view', app.yui.view({
    defaultLayout: 'index'
}));

app.yui.debugMode();
app.yui.setCoreFromAppOrigin();

// serving static yui modules
app.use(YUI['static']());

// creating a page with YUI embeded
app.get('/bar', YUI.expose(), function (req, res, next) {
    res.render('bar', {
        tagline: 'testing with some data for template bar',
        tellme: 'but miami is awesome!'
    });
});

// creating a page with YUI embeded
app.get('/foo', YUI.expose(), function (req, res, next) {
    res.render('foo', {
        tagline: 'testing some data for template foo',
        tellme: 'san francisco is nice!'
    });
});

// locator initialiation
new Locator({
    buildDirectory: 'build'
})
    .plug(LocatorHandlebars.yui())
    .plug(LocatorMicro.yui())
    .plug(app.yui.plugin({
        registerGroup: true,
        registerServerModules: true,
        useServerModules: true
    }))
    .parseBundle(__dirname, {}).then(function (have) {

        // listening for traffic only after locator finishes the walking process
        app.listen(3000, function () {
            console.log("Server listening on port 3000");
        });

    }, function () {
        console.log('error: ', arguments);
    });