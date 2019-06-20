<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDocsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('docs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->comment('分类菜单英文名')->default('')->unique();;
            $table->string('desc')->comment('分类菜单解释名,中文名')->default('');
            $table->string('pid')->comment('父级ID')->default(0);
            $table->unsignedTinyInteger('sort')->comment('排序')->default(0);
            $table->text('contents')->comment('文档内容');
            $table->unsignedInteger('created_at')->default(0);
            $table->unsignedInteger('updated_at')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('docs');
    }
}
