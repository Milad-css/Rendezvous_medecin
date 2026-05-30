<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\RendezVousController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\CreneauController;
use App\Http\Controllers\SecretaireController;
use App\Http\Controllers\emailController;


Route::get('/health', fn() => response()->json(['status' => 'ok']));

Route::post('/register',[AuthController::class,'register']);
Route::post('/medecin/creer', [MedecinController::class, 'creer']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/medecin/{id}', [MedecinController::class, 'profil']); 
Route::get('/services/{medecin_id}', [ServiceController::class, 'liste']);
Route::get('/creneaux/{medecin_id}', [CreneauController::class, 'disponibles']);
Route::get('/check-email', [emailController::class, 'verifierEmail']);
Route::get('/verification', [emailController::class, 'verifierCompte']);
Route::post('/secretaire/creer', [SecretaireController::class, 'creer']);

// Routes protégées (avec token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',[AuthController::class, 'logout']);
    // Routes patient
    Route::get('/patient/profil', [PatientController::class, 'profil']);
    Route::put('/patient/modifier', [PatientController::class, 'modifier']);
    // Routes rendez vous 
    Route::post('/rendez-vous/prendre', [RendezVousController::class, 'prendre']);
    Route::put('/rendez-vous/annuler/{id}',[RendezVousController::class, 'annuler']);
    Route::get('/rendez-vous',[RendezVousController::class, 'mesRendezVous']);
    Route::get('/rendez-vous/{id}', [RendezVousController::class, 'details']);

    // Routes Medecin
    Route::get('/medecin/user/{user_id}', [MedecinController::class, 'medecinParUser']);
    // Routes Service 
    Route::post('/service/creer', [ServiceController::class, 'creer']);
    Route::delete('/service/supprimer/{id}', [ServiceController::class, 'supprimer']);
    Route::post('/creneau/creer', [CreneauController::class, 'creer']);
    Route::delete('/creneau/supprimer/{id}', [CreneauController::class, 'supprimer']);
    // Routes Secrétaire
    Route::get('/secretaire/patients', [SecretaireController::class, 'listePatient']);
    Route::get('/secretaire/profil/{id}', [SecretaireController::class, 'profil']);
    Route::get('/secretaire/rendez-vous', [SecretaireController::class, 'tousLesRendezVous']);
    Route::put('/secretaire/rendez-vous/confirmer/{id}', [SecretaireController::class, 'confirmer']);
    Route::put('/secretaire/rendez-vous/annuler/{id}', [SecretaireController::class, 'annuler']);
    Route::delete('/secretaire/rendez-vous/supprimer/{id}', [SecretaireController::class, 'delete']);
});
   
