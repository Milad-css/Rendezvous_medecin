<?php

namespace App\Http\Controllers;
use App\Models\Creneau;
use Illuminate\Http\Request;
use App\Models\User;
class emailController extends Controller
{
    public function verifierEmail(){
        $email = User::pluck('email');
        return response()->json($email);
    }

    public function verifierCompte(){
        $user = User::select('nom','email')->get();
        return response()->json($user);
    }
}
