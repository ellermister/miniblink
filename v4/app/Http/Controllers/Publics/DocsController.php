<?php

namespace App\Http\Controllers\Publics;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Model\Nav;
use App\Model\Docs;

class DocsController extends Controller
{
    //
    public function start()
    {
        $docs = Docs::where('pid', 0)->get();
        foreach($docs as &$doc){
            $id = $doc->id;
            $subDoc = Docs::where('pid', $id)->get();
            $doc['subs'] = $subDoc;
        }
        $data = [
            'docs'  =>  $docs
        ];
        return view('start', $data);
    }
}
