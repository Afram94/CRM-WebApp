<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;

class ExportController extends Controller
{
    public function exportCsv()
    {
        $fileName = 'customers.csv';
        $customers = Customer::all();

        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = array('ID', 'Name', 'Email');

        $callback = function() use($customers, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($customers as $customer) {
                $row['ID'] = $customer->id;
                $row['Name'] = $customer->name;
                $row['Email'] = $customer->email;

                fputcsv($file, array($row['ID'], $row['Name'], $row['Email']));
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportSingleCustomerCsv(Request $request, $customerId)
    {
        $fileName = 'single_customer.csv';
        $customer = Customer::find($customerId);

        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = array('ID', 'Name', 'Email');

        $callback = function() use($customer, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            $row['ID'] = $customer->id;
            $row['Name'] = $customer->name;
            $row['Email'] = $customer->email;

            fputcsv($file, array($row['ID'], $row['Name'], $row['Email']));
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
