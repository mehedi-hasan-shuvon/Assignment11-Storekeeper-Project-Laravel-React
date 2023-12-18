<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SaleController extends Controller {
    //
    function addSale( Request $request ) {

        try {

            DB::beginTransaction();

            $id = $request->id;

            $request->validate( [
                'customerName'        => 'required',
                'customerPhoneNumber' => 'required',
                'customerAddress'     => 'required',
                'discount'            => 'required',
                'vat'                 => 'required',
                'products'            => 'required',
            ] );

            //loop through the products and get the total
            $products = $request->products;

            $total = 0;

            foreach ( $products as $product ) {

                $total += $product['price'] * $product['stock'];
            }

            // calculate the total after discount and vat

            $total = $total - (  ( $total * $request->discount ) / 100 ) + (  ( $total * $request->vat ) / 100 );

            //create a random invoice id with combination of customer name and date-time

            $currentDateTime = now()->format( 'YmdHis' );

// Extract and sanitize the customer's name
            $customerName = str_replace( ' ', '_', $request->customerName ); // Replace spaces with underscores

// Combine customer name and date-time to create a unique invoice ID
            $uniqueInvoiceId = $customerName . '_' . $currentDateTime;

            $invoiceId = DB::table( 'invoices' )->insertGetId( [
                'invoice_id' => $uniqueInvoiceId,
                'total'      => $total,
                'discount'   => $request->discount,
                'vat'        => $request->vat,
                'user_id'    => $id,
                'name'       => $request->customerName,
                'address'    => $request->customerAddress,
                'phone'      => $request->customerPhoneNumber,
            ] );

            foreach ( $products as $product ) {
                DB::table( 'invoice_products' )->insert( [
                    'qty'        => $product['stock'],
                    'sale_price' => $product['price'],
                    'user_id'    => $id,
                    'product_id' => $product['product'],
                    'invoice_id' => $invoiceId,
                ] );

                //update the stock
                DB::table( 'products' )->where( 'id', $product['product'] )->decrement( 'unit', $product['stock'] );
            }

            DB::commit(); // If everything went well, commit the transaction
            return response()->json( ['message' => 'Invoice and products added successfully'], 200 );
        } catch ( \Exception $e ) {
            DB::rollBack();
            Log::error( 'Failed to insert invoice products: ' . $e->getMessage() );
            Log::error( 'Line: ' . $e->getLine() . ' in ' . $e->getFile() );
            return response()->json( ['error' => 'Failed to insert invoice products'], 500 );
        }

    }

    // function getSales( Request $request ) {

    //     $id = $request->id;

    //     $perPage = 5;

    //     $page = $request->page ?? 1;

    //     $offset = ( $page - 1 ) * $perPage;

    //     $totalItems = DB::table( 'invoices' )->where( 'user_id', $id )->count();

    //     $totalPages = ceil( $totalItems / $perPage );

    //     $result = DB::table( 'invoices' )
    //         ->select(
    //             'invoices.id as id',
    //             'invoices.invoice_id as invoice_id',
    //             'invoices.total as total',
    //             'invoices.name as customer_name',
    //             'invoices.address as customer_address',
    //             'invoices.phone as customer_phone',
    //             'invoices.discount as discount',
    //             'invoices.vat as vat',
    //             'invoices.created_at as created_at' )
    //         ->where( 'invoices.user_id', $id )
    //         ->orderByDesc( 'invoices.created_at' )
    //         ->offset( $offset )
    //         ->limit( $perPage )
    //         ->get();

    //     return [
    //         'data'       => $result,
    //         'totalPages' => $totalPages,
    //     ];

    // }

    function getSales(Request $request) {
        $id = $request->id;
        $perPage = 5;
        $page = $request->page ?? 1;
        $keyword = $request->searchTerm; // Retrieve the search term from the request
    
        $offset = ($page - 1) * $perPage;
    
        $query = DB::table('invoices')
            ->select(
                'invoices.id as id',
                'invoices.invoice_id as invoice_id',
                'invoices.total as total',
                'invoices.name as customer_name',
                'invoices.address as customer_address',
                'invoices.phone as customer_phone',
                'invoices.discount as discount',
                'invoices.vat as vat',
                'invoices.created_at as created_at'
            )
            ->where('invoices.user_id', $id);
    
        if ($keyword) {
            // Add the keyword search condition
            $query->where(function ($query) use ($keyword) {
                $query->where('invoices.invoice_id', 'LIKE', "%$keyword%")
                    ->orWhere('invoices.name', 'LIKE', "%$keyword%");
                // Add other columns you want to search against
            });
        }
    
        $totalItems = $query->count();
        $totalPages = ceil($totalItems / $perPage);
    
        $result = $query->orderByDesc('invoices.created_at')
            ->offset($offset)
            ->limit($perPage)
            ->get();
    
        return [
            'data' => $result,
            'totalPages' => $totalPages,
        ];
    }
    

    function getSaleDetails( Request $request ) {

        $id = $request->id;

        $result = DB::table( 'invoice_products' )
            ->join( 'products', 'invoice_products.product_id', '=', 'products.id' )
            ->select( 'invoice_products.*', 'products.name as product_name' )
            ->where( 'invoice_products.invoice_id', $id )
            ->get();

        return $result;

    }

    function getSalesStats( Request $request ) {

        $userId = $request->id;

        $todaySalesTotal = DB::table( 'invoices' )
            ->where( 'user_id', $userId )
            ->whereDate( 'created_at', today() )
            ->sum( 'total' );

        // yesterday sale

        $yesterdaySalesTotal = DB::table( 'invoices' )
            ->where( 'user_id', $userId )
            ->whereDate( 'created_at', today()->subDay() )
            ->sum( 'total' );

        // This months sale

        $thisMonthsSalesTotal = DB::table( 'invoices' )
            ->where( 'user_id', $userId )
            ->whereMonth( 'created_at', today()->month )
            ->sum( 'total' );

        // Last months sale

        $lastMonthsSalesTotal = DB::table( 'invoices' )
            ->where( 'user_id', $userId )
            ->whereMonth( 'created_at', today()->subMonth()->month )
            ->sum( 'total' );

        $data = [
            'todaySalesTotal'      => $todaySalesTotal,
            'yesterdaySalesTotal'  => $yesterdaySalesTotal,
            'thisMonthsSalesTotal' => $thisMonthsSalesTotal,
            'lastMonthsSalesTotal' => $lastMonthsSalesTotal,
        ];

        return $data;

    }

    function getMonthlySales( Request $request ) {

        $userId = $request->id;

        $currentYear = date( 'Y' );
        $currentMonth = date( 'm' );

        $monthlySales = DB::table( 'invoices' )
            ->select(
                DB::raw( 'DATE(created_at) AS sales_date' ),
                DB::raw( 'SUM(total) AS total_sales' )
            )
            ->where( 'user_id', $userId )
            ->whereYear( 'created_at', $currentYear )
            ->whereMonth( 'created_at', $currentMonth )
            ->groupBy( DB::raw( 'DATE(created_at)' ) )
            ->get();

        //get all the distinct products from invoice_products table along with the product name joining from product table

        $productsSales = DB::table( 'invoice_products' )
            ->join( 'products', 'invoice_products.product_id', '=', 'products.id' )
            ->select( 'products.name as product_name', DB::raw( 'SUM(invoice_products.qty) as total_sales' ) )
            ->where( 'invoice_products.user_id', $userId )
            ->groupBy( 'products.name' )
            ->get();

        return [
            'monthlySales'  => $monthlySales,
            'productsSales' => $productsSales,
        ];

    }

}
