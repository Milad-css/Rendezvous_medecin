<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PatientController extends Controller
{
    //Profil 

    public function profil(Request $request){
        $user = $request->user();
        $patient = $request->user()->patient;

        //pour afficher les données de l'utilisateur
         return response()->json([
        'nom' => $user->nom,
        'prenom' => $user->prenom,
        'email' => $user->email,
        'telephone' => $patient->telephone,
    ]);
    }

    public function modifier(Request $request){
        $user = $request->user();
        $patient = $request->user()->patient;

        $user->update([
            'nom' => $request->nom ?? $user->nom,
            'prenom' =>$request->prenom  ?? $user->prenom,
            'email' =>$request->email ?? $user->email,
        ]); 
        $patient->update([
            'telephone' => $request->telephone ?? $patient->telephone
        ]);

         return response()->json([
        'message' => 'Profil mis à jour',
        'nom' => $user->nom,
        'prenom' => $user->prenom,
        'email' => $user->email,
        'telephone' => $patient->telephone,
    ]);
    }
}
