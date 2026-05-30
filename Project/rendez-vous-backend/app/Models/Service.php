<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'medecin_id',
        'nom',
        'duree',
        'prix',
    ];

    public function medecin()
    {
        return $this->belongsTo(Medecin::class);
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class);
    }
}