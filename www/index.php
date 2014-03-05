<?php
if (!isset($_COOKIE["warned"])) header("Location: warn.php");
else echo file_get_contents("index.html");
