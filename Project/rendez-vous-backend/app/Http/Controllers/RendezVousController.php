<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RendezVous;
use App\Models\Creneau;


class RendezVousController extends Controller
    {
    public function prendre (Request $request) {
        $patient = $request->user()->patient;
        $creneau = Creneau::find($request->creneau_id);

        if(!$creneau){
                return response()->json(['message' => "le créneau n'existe pas"]);
        }
        if(!$creneau->disponible){
                return response()->json(['message' => "le créneau est indisponible"], 400);
        }
            $rdv = RendezVous::create([
            'patient_id' =>$patient->id,
            'service_id' =>$request->service_id,
            'creneau_id' =>$creneau->id,
            'date'       =>$creneau->date,
            'heure'      => $creneau->heure_debut,
            'status'     => 'en_attente',

        ]
    );
        $creneau->update(['disponible' => false]);
            
        return response()->json([
            'message' => 'Rendez-vous pris avec succès',
            'rendez_vous' => $rdv,
        ]);
        }


    public function annuler(Request $request,$id){
        $patient = $request->user()->patient;
        $rdv = RendezVous::where('id',$id)
            ->where('patient_id' , $patient->id)
            ->first();

        if(!$rdv){
            return response()->json(['message' => 'le rendez est introuvable ']);
        }
        $rdv->delete();
        $creneau = Creneau::find($rdv->creneau_id);

        $creneau->update(['disponible' => true]);

        return response()->json(['message' => 'le rendez vous est annulé avec success']);
    }
    public function mesRendezVous(Request $request){
        $patient = $request->user()->patient; 
        $rdvs = RendezVous::where('patient_id',$patient->id)
                            ->with(['creneau','service'])
                            ->get();

        return response()->json($rdvs);
    }
    public function details(Request $request){
        $patient =  $request->user()->patient;
        $rdv = RendezVous::where('id', $request->id)
                            ->where('patient_id', $patient->id)
                            ->with(['creneau', 'service'])
                            ->first();
            if (!$rdv) {
                return response()->json(['message' => 'Rendez-vous introuvable'], 404);
            }

            return response()->json($rdv);
            
}}
