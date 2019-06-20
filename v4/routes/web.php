<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::namespace('Publics')->group(function () {
	Route::get('/start', 'DocsController@start');
	Route::get('/start.html', 'DocsController@start');
});

Route::namespace('Admin')->group(function () {
    Route::get('/admin/index', 'ManageController@index');
    Route::get('/admin/category', 'DocsController@categoryList');
    Route::get('/admin/category/editor/{id}', 'DocsController@categoryEditor');
    Route::post('/admin/category/editor/{id}', 'DocsController@categoryUpdate');


    Route::get('/admin/docs', 'DocsController@docList');
    Route::get('/admin/docs/editor/{id}', 'DocsController@docEditor');
    Route::post('/admin/docs/editor/{id}', 'DocsController@docUpdate');
});
