<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;

});

Broadcast::channel('notes-for-user-{userId}', function ($user, $userId) {
    return $user->id == $userId || $user->user_id == $userId;
});

Broadcast::channel('customers-for-user-{userId}', function ($user, $userId) {
    return $user->id == $userId || $user->user_id == $userId;
});

Broadcast::channel('products-for-user-{userId}', function ($user, $userId) {
    return $user->id == $userId || $user->user_id == $userId;
});
/* Broadcast::channel('customer.{customerId}', function ($user, $userId) {
    return ture;
}); */