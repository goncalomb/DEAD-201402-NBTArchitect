<?php

define('MICROTIME', MICROTIME(true));

$output_dir = __DIR__ . '/../output';
if (!file_exists($output_dir)) {
	mkdir($output_dir);
}
define('DATA_DIR', realpath(__DIR__ . '/../data'));
define('OUTPUT_DIR', realpath($output_dir));
unset($output_dir);

function read_dat_file($file, $callback) {
	$result = array();
	$fp = fopen(DATA_DIR . '/' . $file, 'r');
	while (($line = fgets($fp)) != FALSE) {
		$line = trim($line);
		if (!empty($line) && $line[0] != '#') {
			$parts = explode("\t", $line);
			$result[] = $callback($parts);
		}
	}
	fclose($fp);
	return $result;
}

function im_color_at($im, $x, $y) {
	$rgba = imagecolorat($im, $x, $y);
	return array(($rgba >> 16) & 255, ($rgba >> 8) & 255, $rgba & 255, ($rgba >> 24) & 0x7F);
}

function im_blend_with_color($im, $intColor) {
	$r = ($intColor >> 16) & 255;
	$g = ($intColor >> 8) & 255;
	$b = $intColor & 255;
	$width = imagesx($im);
	$height = imagesy($im);
	for ($y = 0; $y < $height; ++$y) {
		for ($x = 0; $x < $width; ++$x) {
			$c = im_color_at($im, $x, $y);
			imagesetpixel($im, $x ,$y, imagecolorallocatealpha($im, $r*$c[0]/255, $g*$c[1]/255, $b*$c[2]/255, $c[3]));
		}
	}
}

function extract_original_image($red, $green) {
	$width = imagesx($red);
	$height = imagesy($green);
	$im = imagecreatetruecolor($width, $height);
	imagealphablending($im, false);
	imagefill($im, 0, 0, imagecolorallocatealpha($im, 0, 0, 0, 127));
	for ($y = 0; $y < $height; ++$y) {
		for ($x = 0; $x < $width; ++$x) {
			$cr = im_color_at($red, $x, $y);
			$cg = im_color_at($green, $x, $y);
			$a = ($cg[0] - $cr[0] + 255)/255;
			$r = $a == 0 ? 255 : $cg[0]/$a;
			$g = $a == 0 ? 255 : $cr[1]/$a;
			$b = $a == 0 ? 255 : $cr[2]/$a;
			imagesetpixel($im, $x ,$y, imagecolorallocatealpha($im, $r, $g, $b, (1 - $a)*127));
		}
	}
	imagesavealpha($im, true);
	return $im;
}

function tmp_file($name, $delete=true) {
	$sha1 = sha1((sha1_file(__FILE__) . floor(MICROTIME/3600/12)));
	$file = sys_get_temp_dir() . '/'. substr($sha1, 0, 7) . '_' . $name;
	if ($delete && file_exists($file)) {
		unlink($file);
	}
	return $file;
}

function download_file($url, $file) {
	$fp = fopen($url, 'r');
	file_put_contents($file, $fp);
	fclose($fp);
}

?>
