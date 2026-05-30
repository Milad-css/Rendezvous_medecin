<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::create('medecins', function (Blueprint $table){
        $table->id();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete('cascade');
        $table->string('specialite');
        $table->string('photo')->nullable();
        $table->string('adresse');
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medecins');
    }
};
