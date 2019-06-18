<?php
include "vendor/autoload.php";
include "src/functions.php";

define('ROOT_PATH', __DIR__);
define('PUBLIC_PATH', ROOT_PATH.DIRECTORY_SEPARATOR.'public');
define('OUTPUT_PATH', PUBLIC_PATH.DIRECTORY_SEPARATOR.'docs');
define('SRC_PATH', ROOT_PATH.DIRECTORY_SEPARATOR.'src');
define('DOCS_PATH', SRC_PATH.DIRECTORY_SEPARATOR.'docs');

$Parsedown = new Parsedown();


if(!is_dir(OUTPUT_PATH)){
    mkdir(OUTPUT_PATH);
}


// 定义全局模板变量
$templatesDir = SRC_PATH.DIRECTORY_SEPARATOR.'templates';
$templatesFiles = scandir($templatesDir);
$templates = [];
foreach($templatesFiles as $file){
    if($file == '.' || $file == '..'){
        continue;
    }
    if(preg_match('/(.*?)\.([a-z]+)$/is', $file, $matches)){
        if(strtolower($matches[2]) == 'html'){
            $name = $matches[1];
            $templates[$name] = file_get_contents($templatesDir.DIRECTORY_SEPARATOR.$file);
        }
    }

}
$app = $templates['app'];

$success = 0;
$paths = scandir(DOCS_PATH);
foreach($paths as $path){
    if($path == '.' || $path == '..'){
        continue;
    }

    if(preg_match('/(.*?)\.([a-z]+)$/is', $path, $matches)){
        if(strtolower($matches[2]) == 'md'){
            $file = DOCS_PATH.DIRECTORY_SEPARATOR.$path;
            $outputFile = OUTPUT_PATH.DIRECTORY_SEPARATOR.$matches[1].'.html';
            $raw = file_get_contents($file);
            $html = $Parsedown->text($raw);
            $buffer = array_merge($templates, ['contents' => $html]);
            $html = template($app, $buffer);
            file_put_contents($outputFile, $html);
            $success ++;
        }
    }
}

if($success > 0 ){
    echo sprintf('Success make %s file.', $success);
}else{
    echo 'No files found to be processed';
}


