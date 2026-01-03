<?php

namespace App\Services;

use App\Models\User;

class RoleService
{
    public const ROLE_ADMIN = 'admin';
    public const ROLE_JOKI = 'joki';
    public const ROLE_CUSTOMER = 'customer';

    /**
     * Check if user has specific role
     */
    public function hasRole(User $user, string $role): bool
    {
        return $user->role === $role;
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(User $user): bool
    {
        return $this->hasRole($user, self::ROLE_ADMIN);
    }

    /**
     * Check if user is joki
     */
    public function isJoki(User $user): bool
    {
        return $this->hasRole($user, self::ROLE_JOKI);
    }
}
