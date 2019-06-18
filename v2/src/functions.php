<?php
function template($text, $vars = [])
{
    foreach ($vars as $name => $value) {
        $text = strtr($text, ["{{".$name."}}" => $value]);
    }
    return $text;
}