<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    //

    function addProduct ( Request $request ) {

      
        $id = $request->id;

        $request->validate([
            'productName' => 'required',
            'productPrice' => 'required',
            'productQuantity' => 'required',
            'productImage' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'productCategory' => 'required'
        ]);

        $image = $request->file('productImage');
        $imageName = 'product_'.time().".".$image->getClientOriginalExtension();
        $image->move(public_path('upload_image'), $imageName);

       $result= DB::table( 'products' )->insert([
            'name' => $request->productName,
            'price' => $request->productPrice,
            'unit' => $request->productQuantity,
            'img_url' => $imageName,
            'user_id' => $id,
            'category_id' => $request->productCategory
        ]);

        if($result ==1) {
            $return = [
                'status' => 'success',
                'result' => 'Product added successfully',
            ];
            $statusCode = 200; // Success status code
        }else{
            $return = [
                'status' => 'error',
                'result' => 'Something went wrong',
            ];
            $statusCode = 500; // Internal server error status code
        }


        return response()->json( $return, $statusCode );


    }

    function getProducts(Request $request){
        $id = $request->id;
        $perPage = 5;
        $page = $request->page ?? 1;
        $keyword = $request->searchTerm; // Retrieve the search term from the request
    
        $offset = ($page - 1) * $perPage;
    
        $query = DB::table('products')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.name as category_name')
            ->where('products.user_id', $id);
    
        if ($keyword) {
            // Add the keyword search condition
            $query->where(function ($query) use ($keyword) {
                $query->where('products.name', 'LIKE', "%$keyword%")
                      ->orWhere('categories.name', 'LIKE', "%$keyword%");
                // Add other columns you want to search against
            });
        }
    
        $totalItems = $query->count();
        $totalPages = ceil($totalItems / $perPage);
    
        $result = $query->orderByDesc('products.created_at')
                        ->offset($offset)
                        ->limit($perPage)
                        ->get();
    
        return [
            'data' => $result,
            'totalPages' => $totalPages,
        ];
    }
    


    function getAllProducts (Request $request){

        $id = $request->id;

        //and where unit > 0
        $result = DB::table('products')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.name as category_name')
            ->where('products.user_id', $id)
            ->where('products.unit', '>', 0)
            ->get();

        return $result;
    }

    function editProduct(Request $request){

        $id = $request->id;

        $request->validate([
            'productName' => 'required',
            'productPrice' => 'required',
            'productQuantity' => 'required',
            'productCategory' => 'required'
        ]);

        $result= DB::table( 'products' )->where('id', $id)->update([
            'name' => $request->productName,
            'price' => $request->productPrice,
            'unit' => $request->productQuantity,
            'category_id' => $request->productCategory
        ]);


        if($result ==1) {
            $return = [
                'status' => 'success',
                'result' => 'Product added successfully',
            ];
            $statusCode = 200; // Success status code
        }else{
            $return = [
                'status' => 'error',
                'result' => 'Something went wrong',
            ];
            $statusCode = 500; // Internal server error status code
        }


        return response()->json( $return, $statusCode );



    }


    function deleteProduct(Request $request){

        $id = $request->id;

        //delete the product

        $result = DB::table('products')->where('id', $id)->delete();

        if($result ==1) {
            $return = [
                'status' => 'success',
                'result' => 'Product deleted successfully',
            ];
            $statusCode = 200; // Success status code
        }else{
            $return = [
                'status' => 'error',
                'result' => 'Something went wrong',
            ];
            $statusCode = 500; // Internal server error status code
        }

        return response()->json( $return, $statusCode );
    }
}
