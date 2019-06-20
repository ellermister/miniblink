<?php

namespace App\Http\Controllers\Publics;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Model\Nav;

class DocsController extends Controller
{
    //
    public function start()
    {
        $navs = Nav::where('pid', 0)->get();
        foreach($navs as &$nav){
            $id = $nav->id;
            $subNav = Nav::where('pid', $id)->get();
            $nav['subs'] = $subNav;
        }
        $data = [
            'navs'  =>  $navs
        ];
        return view('start', $data);
    }
}
