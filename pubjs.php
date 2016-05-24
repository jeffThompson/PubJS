<?php 
	
	# gets a lit of image files from a source folder
	$dir = $_POST['pageSource'];
	$images = glob($dir . '/*.{jpg,png,gif}', GLOB_BRACE);
	echo json_encode($images);
?>