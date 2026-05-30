<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Creneau extends Model
{
    protected $table = 'creneaux';
    protected $fillable = [
        'medecin_id',
        'date',
        'heure_debut',
        'heure_fin',
        'disponible',
    ];

    public function medecin()
    {
        return $this->belongsTo(Medecin::class);
    }

    public function rendezVous()
    {
        return $this->hasOne(RendezVous::class);
    }
}