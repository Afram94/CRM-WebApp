<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id)
    {
        /* $note = Note::find($id);

        if (!$note) {
            return redirect()->route('dashboard')->with('error', 'Note not found');
        }

        return Inertia::render('Notes/Show', [
            'note' => $note,
        ]); */
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        dd('Reached the create method');
        return Inertia::render('Notes/Create');
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
