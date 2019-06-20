<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Model\Nav;
use App\Model\Docs;

class DocsController extends Controller
{
    //
    public function categoryList()
    {
        $navs = Nav::all();

        return view('admin.category.list', ['navs' => $navs]);
    }

    public function categoryEditor(Request $request, $id)
    {
        $flag = 'update';
        $nav = null;
        if($id == 'add'){
            $flag = 'add';
        }else{
            $nav = Nav::find($id);
        }
        $navs = Nav::all();
        return view('admin.category.editor', ['flag' => $flag, 'navs' => $navs, 'nav' => $nav]);
    }

    public function categoryUpdate(Request $request, $id)
    {
        if($id == 'add'){
            $nav = new Nav;
        }else{
            $nav = Nav::find($id);
        }


        $nav->name = $request->input('name');
        $nav->desc = $request->input('desc');
        $nav->pid = intval($request->input('pid', 0));
        $nav->sort = intval($request->input('sort', 0));
        if($nav->save()){
            return redirect('/admin/category/editor/'.$nav->id);
        }
        return back()->withInput();
    }

    public function docList()
    {
        $docs = Docs::all();

        return view('admin.docs.list', ['docs' => $docs]);
    }


    public function docEditor(Request $request, $id)
    {
        $flag = 'update';
        $doc = null;
        if($id == 'add'){
            $flag = 'add';
        }else{
            $doc = Docs::find($id);
        }
        $docs = Docs::all();
        return view('admin.docs.editor', ['flag' => $flag, 'navs' => $docs, 'doc' => $doc]);
    }

    public function DocUpdate(Request $request, $id)
    {
        if($id == 'add'){
            $doc = new Docs;
        }else{
            $doc = Docs::find($id);
        }


        $doc->name = $request->input('name');
        $doc->name = strtr($doc->name, [' '=>'']);
        $doc->desc = $request->input('desc');
        $doc->contents = $request->input('contents','')?:'';
        $doc->pid = intval($request->input('pid', 0));
        $doc->sort = intval($request->input('sort', 0));
        if($doc->save()){
            return redirect('/admin/docs/editor/'.$doc->id);
        }
        return back()->withInput();
    }
}
