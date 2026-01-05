<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function index()
    {
        $search = request('search');

        $users = User::whereIn('role', ['admin', 'joki'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => request()->all(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:admin,joki,customer',
            'specialization' => 'nullable|string|in:web,ui/ux,mobile', // Validating specialization
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'specialization' => $request->role === 'joki' ? $request->specialization : null,
        ]);

        return redirect()->route('admin.users.index')->with('message', 'User created successfully.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,joki,customer',
            'specialization' => 'nullable|string|in:web,ui/ux,mobile',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'specialization' => $request->role === 'joki' ? $request->specialization : null,
        ];

        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        return redirect()->route('admin.users.index')->with('message', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete yourself.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('message', 'User deleted successfully.');
    }

    public function toggleBlacklist(Request $request, User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot blacklist yourself.');
        }

        $request->validate([
            'is_blacklisted' => 'required|boolean',
            'blacklist_reason' => 'nullable|string|max:255',
        ]);

        $user->update([
            'is_blacklisted' => $request->is_blacklisted,
            'blacklist_reason' => $request->is_blacklisted ? $request->blacklist_reason : null,
        ]);

        $status = $request->is_blacklisted ? 'blacklisted' : 'unblacklisted';
        return back()->with('message', "User has been {$status}.");
    }
}
