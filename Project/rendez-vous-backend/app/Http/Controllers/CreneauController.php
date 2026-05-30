<?php

namespace App\Http\Controllers;
use App\Models\Creneau;
use Illuminate\Http\Request;

class CreneauController extends Controller
{
     public function creer(Request $request)
    {
        $creneau = Creneau::create([
            'medecin_id' => $request->medecin_id,
            'date' => $request->date,
            'heure_debut' => $request->heure_debut,
            'heure_fin' => $request->heure_fin,
            'disponible' => true,
        ]);

        return response()->json([
            'message' => 'Créneau créé avec succès',
            'creneau' => $creneau,
        ]);
    }

    public function disponibles($medecin_id){
        $creneau = Creneau::where('medecin_id', $medecin_id)
                    ->where('disponible', true)
                    ->get();
        
        return response()->json($creneau);
     }

    public function supprimer($id){

        $creneau = Creneau::find($id);
        
        if(!$creneau){
            return response()->json(['message' => "le créneau n'existe pas"]);
        }
        $creneau->delete();
        return response()->json(['message' => "le créneau est supprimé avec succès"]);
     
    }
}
