<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExportDataPerikanan extends Model
{
    use HasFactory;

    protected $table = 'data_perikanan'; // sesuaikan dengan nama tabel
    protected $fillable = ['tahun', 'bulan', 'indikator', 'nilai'];
}
