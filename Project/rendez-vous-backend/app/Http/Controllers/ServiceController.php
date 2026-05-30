<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{

    public function creer(Request $request){
        $service = Service::create([
            'medecin_id' => $request->medecin_id,
            'nom' => $request->nom,
            'duree' => $request->duree,
            'prix' => $request->prix,
        ]);

        return response()->json([
            'message' => "le service est ajouté avec succès",
            'service' => $service,
        ]);
    }
    //tout les services d'un medecin 
    public function liste($medecin_id){

        $services = Service::where('medecin_id',$medecin_id)->get();
        return response()->json($services);
    }

    public function supprimer($id){
        $service = Service::find($id);

        if (!$service){ 
            return response()->json(['message' => 'le service est introuvable']);
        }

        $service->delete();
        return response()->json(['message' => 'le service est supprimé avec succès']);
    }
}
