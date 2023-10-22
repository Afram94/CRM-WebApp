<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve notes and their associated customers, but only fetch 'id' and 'name' fields for customers.
        $notes = Note::with('customer:id,name')->get();

        // Loop through each note to transform its structure.
        $notes = $notes->transform(function ($note, $key) {
        // Attach the customer's name as a new property 'customer_name' to each note.
        $note->customer_name = $note->customer->name;
        $note->user_name = $note->user->name;

        // Remove the 'customer' object from each note if you don't want to send the entire customer object.
        // After this line, $note->customer will not be accessible.
        unset($note->customer);
        unset($note->user);

        return $note;
    });


    /* dd('After unset', $notes); */

    return inertia('Notes/Show', [
        'auth' => [
            'notes' => $notes,
        ]
    ]);
    }

    public function getSigleNote($id) {

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //dd('Reached the create method');
        return inertia('Notes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        // Add the user_id to the $data array
        $data['user_id'] = auth()->id();

        $note = Note::create($data);

        /* return redirect()->route('dashboard')->with('success', 'Note created successfully'); */
        return response()->json($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Note $note)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Note $note)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        //
    }
}
