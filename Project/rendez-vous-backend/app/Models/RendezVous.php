<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    protected $table = 'rendez_vous';
    protected $fillable = [
        'patient_id',
        'service_id',
        'creneau_id',
        'date',
        'heure',
        'status',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function creneau()
    {
        return $this->belongsTo(Creneau::class);
    }
}