<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medecin extends Model
{
    protected $fillable = [
        'user_id',
        'specialite',
        'photo',
        'adresse',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function creneaux()
    {
        return $this->hasMany(Creneau::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function secretaire()
    {
        return $this->hasOne(Secretaire::class);
    }
}