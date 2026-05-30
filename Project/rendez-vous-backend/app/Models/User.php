<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // AJOUTEZ CETTE LIGNE

class User extends Authenticatable
{
    use HasApiTokens, Notifiable; 

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function patient()
    {
        return $this->hasOne(Patient::class);
    }

    public function medecin()
    {
        return $this->hasOne(Medecin::class);
    }

    public function secretaire()
    {
        return $this->hasOne(Secretaire::class);
    }
}