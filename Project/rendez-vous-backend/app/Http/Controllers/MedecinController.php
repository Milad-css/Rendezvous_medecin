<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Medecin;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class MedecinController extends Controller
{
    public function creer(Request $request){
        $user = User::create([
            'nom'      => $request->nom,
            'prenom'   => $request->prenom,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'medecin',
            ]);
        $token = $user->createToken('auth_token')->plainTextToken;
        $medecin = Medecin::create([
            'user_id' => $user->id,
            'specialite' => $request->specialite,
            'adresse' => $request->adresse,
        ]);

        return response()->json([
            'message' => 'Médecin créé avec succès',
            'medecin' => $medecin,
            'token' => $token,
        ]);
    }
    public function profil(Request $request) {
        $medecin = Medecin::with('user')->find($request->id);

        if (!$medecin) {
            return response()->json(['message' => 'Médecin introuvable'], 404);
        }

        return response()->json([
            
            'nom' => $medecin->user->nom,
            'prenom' => $medecin->user->prenom,
            'email' => $medecin->user->email,
            'specialite' => $medecin->specialite,
            'adresse' => $medecin->adresse,
        ]);
    }
    public function medecinParUser($user_id) {
        $medecin = Medecin::where('user_id', $user_id)->first();
        return response()->json($medecin);
    }
   
}
