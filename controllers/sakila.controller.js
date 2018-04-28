var model = require('../models/model');

module.exports = {
    getActors:              getActors,
    getCategories:          getCategories,
    getLanguages:           getLanguages,
    getLogs:                getLogs,
    filterByTitle:          filterByTitle,
    filterByCategory:       filterByCategory,
    filterByActor:          filterByActor,
    filterByDescription:    filterByDescription,
    filterByLanguage:       filterByLanguage,
    addLog:                 addLog
}

function getActors() {
    return model.query("SELECT * From actor");
}

function getCategories() {
    return model.query("SELECT * From category");
}

function getLanguages() {
    return model.query("SELECT * FROM language");
}

function getLogs() {
    return model.query("SELECT * FROM search_log");
}

function addLog(log){
    return model.query(`INSERT INTO search_log (search_type, search_value, search_result, search_time) VALUES ('${log.search_type}', '${log.search_value}', '${log.search_result}', '${log.search_time}')`);
}

function filterByCategory(filterData) {
    return model.query("SELECT film.film_id, title, description, fc.name AS category_name, release_year, length, rating, language.name AS language_name, fa.first_name, fa.last_name FROM film JOIN (SELECT category.category_id, film_category.film_id, category.name FROM category JOIN film_category ON film_category.category_id = category.category_id) as fc ON film.film_id = fc.film_id JOIN language ON film.language_id = language.language_id JOIN (SELECT film_actor.film_id, actor.first_name, actor.last_name FROM actor JOIN film_actor ON film_actor.actor_id = actor.actor_id) as fa ON film.film_id = fa.film_id WHERE fc.name = '"+ filterData.search_value+"'")
    .then(result => {return mapResult(result[0]);})
    .then(resultMap => { return convertMapToList(resultMap);})
}

function filterByTitle(filterData) {
    return model.query("SELECT film.film_id, title, description, fc.name AS category_name, release_year, length, rating, language.name AS language_name, fa.first_name, fa.last_name FROM film JOIN (SELECT category.category_id, film_category.film_id, category.name FROM category JOIN film_category ON film_category.category_id = category.category_id) as fc ON film.film_id = fc.film_id JOIN language ON film.language_id = language.language_id JOIN (SELECT film_actor.film_id, actor.first_name, actor.last_name FROM actor JOIN film_actor ON film_actor.actor_id = actor.actor_id) as fa ON film.film_id = fa.film_id WHERE title LIKE '%" + filterData.search_value + "%'")
        .then(result => { return mapResult(result[0]);})
        .then(resultMap => { return convertMapToList(resultMap);})
}

function filterByActor(filterData) {
    return model.query("SELECT film.film_id, title, description, fc.name AS category_name, release_year, length, rating, language.name AS language_name, fa.first_name, fa.last_name FROM film JOIN (SELECT category.category_id, film_category.film_id, category.name FROM category JOIN film_category ON film_category.category_id = category.category_id) as fc ON film.film_id = fc.film_id JOIN language ON film.language_id = language.language_id JOIN (SELECT film_actor.film_id, actor.first_name, actor.last_name FROM actor JOIN film_actor ON film_actor.actor_id = actor.actor_id) as fa ON film.film_id = fa.film_id")
    .then(result => {return mapResult(result[0]);})
    .then(resultMap => { return filterResultByActor(resultMap, filterData.search_value); })
}

function filterResultByActor(resultMap, actorFullName){
    var results = [];
    Object.keys(resultMap).forEach(filmId => {
        if(resultMap[filmId].actors.includes(actorFullName)){
            results.push(resultMap[filmId]);
        }
    })
    return Promise.resolve(results);
}

function filterByLanguage(filterData) {
    return model.query("SELECT film.film_id, title, description, fc.name AS category_name, release_year, length, rating, language.name AS language_name, fa.first_name, fa.last_name FROM film JOIN (SELECT category.category_id, film_category.film_id, category.name FROM category JOIN film_category ON film_category.category_id = category.category_id) as fc ON film.film_id = fc.film_id JOIN language ON film.language_id = language.language_id JOIN (SELECT film_actor.film_id, actor.first_name, actor.last_name FROM actor JOIN film_actor ON film_actor.actor_id = actor.actor_id) as fa ON film.film_id = fa.film_id WHERE language.name = '"+ filterData.search_value+"'")
        .then(result => { return mapResult(result[0]);})
        .then(resultMap => { return convertMapToList(resultMap);})
}

function filterByDescription(filterData) {
    return model.query("SELECT film.film_id, title, description, fc.name AS category_name, release_year, length, rating, language.name AS language_name, fa.first_name, fa.last_name FROM film JOIN (SELECT category.category_id, film_category.film_id, category.name FROM category JOIN film_category ON film_category.category_id = category.category_id) as fc ON film.film_id = fc.film_id JOIN language ON film.language_id = language.language_id JOIN (SELECT film_actor.film_id, actor.first_name, actor.last_name FROM actor JOIN film_actor ON film_actor.actor_id = actor.actor_id) as fa ON film.film_id = fa.film_id WHERE description LIKE '%" + filterData.search_value + "%'")
        .then(result => {return mapResult(result[0]);})
        .then(resultMap => { return convertMapToList(resultMap);})
}

function mapResult(result) {
    var resultMap = {};
    result.forEach(row => {
        resultMap[row.film_id] = resultMap[row.film_id] || {
            length: row.length,
            category_name: row.category_name,
            language_name: row.language_name,
            rating: row.rating,
            release_year: row.release_year,
            title: row.title,
            description: row.description,
            film_id: row.film_id

        };
        resultMap[row.film_id].actors = resultMap[row.film_id].actors || [];
        resultMap[row.film_id].actors.push(row.first_name+' '+row.last_name);
    });
    return Promise.resolve(resultMap);
}

function convertMapToList(resultMap){
    var results = Object.keys(resultMap).map(filmId => {
        return resultMap[filmId];
    })
    return Promise.resolve(results);
}