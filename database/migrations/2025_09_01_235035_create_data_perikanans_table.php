<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_data_perikanan_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_perikanan', function (Blueprint $table) {
            $table->id();
            $table->year('tahun');
            $table->string('bulan'); // e.g., "Januari", "Februari"
            $table->string('indikator');
            $table->decimal('nilai', 15, 2)->nullable(); // Angka dengan 2 desimal, bisa null
            $table->timestamps();

            // Menambahkan unique constraint agar tidak ada data duplikat
            $table->unique(['tahun', 'bulan', 'indikator']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_perikanan');
    }
};