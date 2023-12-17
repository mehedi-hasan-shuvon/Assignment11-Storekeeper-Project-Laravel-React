<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
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

Route::get('/getCategories/{id}',[CategoryController::class,'getCategories']);

Route::delete('/deleteCategory/{id}',[CategoryController::class,'deleteCategory']);


Route::post('/editCategory/{id}',[CategoryController::class,'editCategory']);

Route::post('/addCategory/{id}',[CategoryController::class,'addCategory']);

Route::post('/addProduct/{id}',[ProductController::class,'addProduct']);

Route::get('/getProducts/{id}',[ProductController::class,'getProducts']);

Route::get('/getAllProducts/{id}',[ProductController::class,'getAllProducts']);

Route::post('/editProduct/{id}',[ProductController::class,'editProduct']);

Route::delete('/deleteProduct/{id}',[ProductController::class,'deleteProduct']);

Route::post('/saveSales/{id}',[SaleController::class,'addSale']);

Route::get('/getSales/{id}',[SaleController::class,'getSales']);

Route::get('/getSaleDetails/{id}',[SaleController::class,'getSaleDetails']);


