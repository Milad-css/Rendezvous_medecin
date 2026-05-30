<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\User;
use App\Models\RendezVous;
use App\Models\Creneau;
use App\Models\Secretaire;

class SecretaireController extends Controller
{
    public function creer (Request $request) {
    $user = User::create([
        'nom' => $request->nom,
        'prenom' =>$request->prenom,
        'email' =>$request->email,
        'password' => Hash::make($request->password),
        'role' => "secretaire"
    ]);
    $token = $user->createToken('auth_token')->plainTextToken;
    $secretaire = Secretaire::create([
            'user_id' => $user->id,
            'medecin_id'=>$request->medecin_id
        ]);

    return response()->json([
            'message' => 'Médecin créé avec succès',
            'secretaire' => $secretaire,
            'token' => $token,
        ]);

    }

public function profil(Request $request)
{

    $userId = $request->id ?? auth()->id();

    $secretaire = Secretaire::with(['user', 'medecin'])
        ->where('user_id', $userId)
        ->first();

    if (!$secretaire) {
        return response()->json(['message' => 'Profil secrétaire non trouvé'], 404);
    }

    return response()->json([
        "nom"            => $secretaire->user->nom ?? 'Inconnu',
        "prenom"         => $secretaire->user->prenom ?? '',
        "email"          => $secretaire->user->email ?? '',
        "telephone"      => $secretaire->user->telephone ?? '',
        "nom_medecin"    => $secretaire->medecin->user->nom ?? 'Non assigné',
        "prenom_medecin" => $secretaire->medecin->user->prenom ?? ''
    ]);
}


    public function listePatient()
    {
        $patients = Patient::with('user')->get();

        return response()->json($patients->map(function ($patient) {
            return [
                'id' => $patient->id,
                'nom' => $patient->user->nom,
                'prenom' => $patient->user->prenom,
                'email' => $patient->user->email,
                'telephone' => $patient->telephone,
            ];
        }));
    }

    public function tousLesRendezVous()
    {
        $rdvs = RendezVous::with(['patient.user', 'creneau', 'service'])->get();
        return response()->json($rdvs);
    }

    public function confirmer($id)
    {
        $rdv = RendezVous::find($id);

        if (!$rdv) {
            return response()->json(['message' => "le rendez vous n'existe pas"]);
        }

        $rdv->update(['status' => 'confirme']);
        return response()->json(['message' => 'Rendez-vous confirmé avec succès']);
    }

    public function annuler($id)
    {
        $rdv = RendezVous::find($id);

        if (!$rdv) {
            return response()->json(['message' => "le rendez vous n'existe pas"]);
        }

        $rdv->update(['status' => 'annule']);
        return response()->json(['message' => 'Rendez-vous annulé avec succès']);
    }

    public function delete($id)
    {
        $rdv = RendezVous::find($id);

        if (!$rdv) {
            return response()->json(['message' => "le rendez vous n'existe pas"]);
        }

        $creneau = Creneau::find($rdv->creneau_id);
        $creneau->update(['disponible' => true]);
        $rdv->delete();

        return response()->json(['message' => 'Rendez-vous supprimé avec succès']);
    }
}   