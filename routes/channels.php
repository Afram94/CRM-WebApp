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

Broadcast::channel('inventories-for-user-{userId}', function ($user, $userId) {
    return $user->id == $userId || $user->user_id == $userId;
});

Broadcast::channel('users-for-user-{userId}', function ($user, $userId) {
    return $user->id == $userId || $user->user_id == $userId;
});

Broadcast::channel('permissions-for-user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('notifications-for-user-{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId || (int) $user->user_id === (int) $userId;
});




/* Broadcast::channel('all-users-updates', function ($user) {
    // Check if the user has the 'superadmin' role
    return $user->hasRole('superadmin');
}); */
/* Broadcast::channel('customer.{customerId}', function ($user, $userId) {
    return ture;
}); */