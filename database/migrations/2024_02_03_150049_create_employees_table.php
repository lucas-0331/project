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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->date('birthday');
            $table->char('gender');
            $table->string('address');
            $table->string('cpf');
            $table->string('pis');
            $table->string('position');
            $table->string('department');
            $table->string('hiring_date');
            $table->string('contract_type');
            $table->string('bank_agency');
            $table->string('bank_account');
            $table->string('phone');
            $table->string('status');
            $table->decimal('salary', 8, 2, true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
