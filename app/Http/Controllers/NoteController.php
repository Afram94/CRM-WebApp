<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\User;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Broadcast;
use App\Events\NoteCreated;


class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
            /* // Retrieve notes and their associated customers, but only fetch 'id' and 'name' fields for customers.
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

        return inertia('Notes/Show', [
            'auth' => [
                'notes' => $notes,
            ]
        ]); */

        $user = auth()->user();
        $search = $request->input('search');

        // Why I have this: $parendUserId = $user->user_id ? $user->user_id : $user->id;
        // To ensure that when I log in as a child user, I have the 'user_id' available.
        // Having 'user_id' allows me to compare both 'id' and 'user_id' to find all related users under the same parent.
        // If I only used '$parentId = $user->id;', it would not correctly identify the parent-child relationship.
        // By using '$parentId = $user->user_id ? $user->user_id : $user->id;', I capture the parent's ID, regardless of whether I'm logged in as a parent or a child.
        // This unified 'parentId' value ensures that the query fetches all users under the same parent, be it other children or the parent itself.
        $parentUserId = $user->user_id ? $user->user_id : $user->id;

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
        ->orWhere('id', $parentUserId)
        ->pluck('id')->toArray();

        // Retrieve notes and their associated customers, but only fetch 'id' and 'name' fields for customers.
        // Only retrieve notes for users who share the same parent_user_id.
        $query = Note::with('customer:id,name')
        ->whereIn('user_id', $allUserIdsUnderSameParent);

        // If there's a search term, filter the notes by title or content
        $search = $request->input('search');
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', '%' . $search . '%')
                ->orWhere('content', 'LIKE', '%' . $search . '%');
            });
        }

        $notes = $query->get();

        

        // Transform the notes, similar to your existing code.
        $notes = $notes->transform(function ($note, $key) {
        $note->customer_name = $note->customer->name;
        $note->user_name = $note->user->name;
        unset($note->customer);
        unset($note->user);
        
            return $note;
        });

            if ($request->wantsJson()) {
                return response()->json([
                    'auth' => [
                        'notes' => $notes,
                    ]
                ]);
            }

            return inertia('Notes/Show', [
                'auth' => [
                    'notes' => $notes,
                ]
            ]);
    }

    public function getNotesByCustomer($customer_id)
    {
        $user = auth()->user();

        // Determine the parent user ID (it's either the user's own ID or their parent's ID)
        $parentUserId = $user->user_id ? $user->user_id : $user->id;

        // Fetch all users that have the same parent_user_id (including the parent)
        $allUserIdsUnderSameParent = User::where('user_id', $parentUserId)
                                        ->orWhere('id', $parentUserId)
                                        ->pluck('id')->toArray();

        // Retrieve notes by customer ID and also filter by user IDs who share the same parent_user_id
        $notes = Note::where('customer_id', $customer_id)
                    ->whereIn('user_id', $allUserIdsUnderSameParent)
                    ->with('customer:id,name')
                    ->get();

        $notes = $notes->transform(function ($note, $key) {
            $note->customer_name = $note->customer['name'];
            $note->user_name = $note->user['name'];
            unset($note->customer);
            unset($note->user);

            return $note;
        });

        return inertia('Notes/CustomerNotes', [
            'auth' => [
                'customer_notes' => $notes,
            ]
        ]);
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

        /* Broadcast::event(new NoteCreated($note)); // This line is correctly placed here. */
        /* event(new NoteCreated($note)); */
        broadcast(new NoteCreated($note))->toOthers();



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
