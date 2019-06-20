@extends('layouts.app')

@section('title', 'docs')


@section('nav')
<nav id="doc-menu" class="nav doc-menu flex-column sticky">
	@foreach($docs as $doc)
    <a class="nav-link scrollto" href="#{{$doc->name}}-section">{{$doc->desc}}</a>
    	@if($doc->subs)
    	<nav class="doc-sub-menu nav flex-column">
	    	@foreach($doc->subs as $sub)
	    		<a class="nav-link scrollto" href="#{{$sub->name}}-section">{{$sub->desc}}</a>
	    	@endforeach
		</nav><!--//nav-->
    	@endif
    @endforeach

</nav><!--//doc-menu-->
@endsection

@section('content')
<div class="content-inner">
		@foreach($docs as $doc)
			<section id="{{$doc->name}}-section" class="doc-section">
	            <h2 class="section-title">{{$doc->name}}</h2>
	            
	            @if($doc->subs)
	            	@foreach($doc->subs as $sub)
		            <div id="{{$sub->name}}-section" class="section-block">
		            	<h3 class="block-title">Step One</h3>
		                <p>{!! $sub->contents !!}</p>
		            </div>	            
		            @endforeach
	            @else
	            <div class="section-block">
	                <p>{!! $doc->contents !!}
	                </p>
	            </div>	            
	            @endif

	        </section><!--//doc-section-->
		@endforeach

        </section><!--//doc-section-->
    </div><!--//content-inner-->
@endsection
