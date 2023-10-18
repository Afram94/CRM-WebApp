<!-- resources/views/invite.blade.php -->

<form action="{{ route('process.invite') }}" method="POST">
    @csrf
    <input type="email" name="email" placeholder="Email">
    <button type="submit">Send Invite</button>
</form>
