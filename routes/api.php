<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/getAllUsers',[UserController::class,'getAllUsers']);


Route::get('/getAllCategories/{id}',[CategoryController::class,'getAllCategories']);

Route::delete('/deleteCategory/{id}',[CategoryController::class,'deleteCategory']);


Route::post('/editCategory/{id}',[CategoryController::class,'editCategory']);

Route::post('/addCategory/{id}',[CategoryController::class,'addCategory']);