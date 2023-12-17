<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return redirect()->route('dashboard'); // Redirect to the 'dashboard' named route
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/userCom', function () {
    return Inertia::render('Users/UserCom');
})->middleware(['auth', 'verified'])->name('userCom');

Route::get('/categories', function () {
    return Inertia::render('Products/Categories');
})->middleware(['auth', 'verified'])->name('categories');

Route::get('/products', function () {
    return Inertia::render('Products/Products');
})->middleware(['auth', 'verified'])->name('products');

Route::get('/sales', function () {
    return Inertia::render('Sales/Sales');
})->middleware(['auth', 'verified'])->name('sales');

Route::get('/createSales', function () {
    return Inertia::render('Sales/CreateSales');
})->middleware(['auth', 'verified'])->name('createSales');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('/users', function () {
    return Inertia::render('Users/UserCom');
});

require __DIR__.'/auth.php';
