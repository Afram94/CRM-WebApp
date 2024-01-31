<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        $event = Event::all();

        return inertia('Calendar/CalendarComponent', [
            'auth' => [
                'calendar' => $event,
                
            ]
        ]);
    }

    public function store(Request $request)
{
    // Debugging: Check the request data
    logger()->info($request->all());

    $validatedData = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'start' => 'required|date',
        'end' => 'required|date',
    ]);

    $event = Event::create($validatedData);

    return response()->json($event, 201);
}

    public function show(Event $event)
    {
        return $event;
    }

    public function update(Request $request, Event $event)
    {
        $event->update($request->all());
        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }
}
