<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSortToNavsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('navs', function (Blueprint $table) {
            //
            $table->string('sort')->comment('排序')->default(50)->after('pid');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('navs', function (Blueprint $table) {
            //
            $table->dropColumn('sort');
        });
    }
}
