<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller {
    //
    // function getCategories( Request $request ) {
    //     $id = $request->id;

    //     // get all the categories of user_id = $id
    //     $perPage = 5;

    //     $page = $request->page ?? 1;

    //     $keyword = $request->searchTerm;

    //     $offset = ( $page - 1 ) * $perPage;

    //     $totalItems = DB::table('categories')->where('user_id', $id)->count();

    //     $totalPages = ceil($totalItems / $perPage);

    //     // $result = DB::table('categories')->where('user_id', $id)->get();
    //     $result = DB::table( 'categories' )
    //         ->where( 'user_id', $id )
    //         ->orderByDesc( 'created_at' )
    //         ->offset( $offset )
    //         ->limit( $perPage )
    //         ->get();
        


    //     return [
    //             'data' => $result,
    //             'totalPages' => $totalPages,
    //     ];
        

    // }

    function getCategories(Request $request) {
        $id = $request->id;
        $perPage = 5;
        $page = $request->page ?? 1;
        $keyword = $request->searchTerm; // Retrieve the search term from the request
    
        $offset = ($page - 1) * $perPage;
    
        $query = DB::table('categories')->where('user_id', $id);
    
        if ($keyword) {
            // Add the keyword search condition
            $query->where(function ($query) use ($keyword) {
                $query->where('name', 'LIKE', "%$keyword%")
                      ->orWhere('id', 'LIKE', "%$keyword%");
                // Add other columns you want to search against
            });
        }
    
        $totalItems = $query->count();
        $totalPages = ceil($totalItems / $perPage);
    
        $result = $query->orderByDesc('created_at')
                        ->offset($offset)
                        ->limit($perPage)
                        ->get();
    
        return [
            'data' => $result,
            'totalPages' => $totalPages,
        ];
    }

    function getAllCategories( Request $request ) {

        $id = $request->id;

        $result = DB::table( 'categories' )->where( 'user_id', $id )->get();

        return $result;
    }

    function deleteCategory( Request $request ) {

        $id = $request->id;

        DB::table( 'categories' )->where( 'id', $id )->delete();

        return $id;
    }

    function editCategory( Request $request ) {
        $id = $request->id;
        $requestData = $request->json()->all();
        $name = $requestData['name'];

        $result = DB::table( 'categories' )->where( 'id', $id )->update( ['name' => $name] );

        if ( $result == 1 ) {
            $return = [
                'status' => 'success',
                'result' => 'Category updated successfully',
            ];
            $statusCode = 200; // Success status code
        } else {
            $return = [
                'status' => 'error',
                'result' => 'Failed to update category',
            ];
            $statusCode = 400; // Error status code
        }

        return response()->json( $return, $statusCode );
    }

    function addCategory( Request $request ) {
        $id = $request->id;
        $requestData = $request->json()->all();
        $name = $requestData['name'];

        $result = DB::table( 'categories' )->insert( [
            'user_id' => $id,
            'name'    => $name,
        ] );

        if ( $result == 1 ) {
            $return = [
                'status' => 'success',
                'result' => 'Category added successfully',
            ];
            $statusCode = 200; // Success status code
        } else {
            $return = [
                'status' => 'error',
                'result' => 'Failed to add category',
            ];
            $statusCode = 400; // Error status code
        }

        return response()->json( $return, $statusCode );
    }
}
