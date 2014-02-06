<?php

define('MINECRAFT_VERSION', '1.7.4');
define('MINECRAFT_JAR_SHA1', '900950d8e3217b3a42405d1ecf767dcc31239d69');

include 'functions.php';

$flora_blocks_color = 4764952;
$flora_blocks = array(
	'31:1',
	'31:2',
	'31:3',
	'106:0',
	'111:0',
	'175:2',
	'175:3'
);

$leather_armor_color = 10511680;
$leather_armor_textures = array(
	298 => 'leather_helmet',
	299 => 'leather_chestplate',
	230 => 'leather_leggings',
	231 => 'leather_boots'
);

$potion_id = 373;
$potion_texture = 'potion_bottle_drinkable';
$potion_splash_texture = 'potion_bottle_splash';
$potion_overlay_texture = 'potion_overlay';
$potion_effect_colors = array(
	0 => 3694022,
	1 => 8171462,
	2 => 5926017,
	3 => 14270531,
	4 => 4866583,
	5 => 9643043,
	6 => 16262179,
	7 => 4393481,
	8 => 7889559,
	9 => 5578058,
	10 => 13458603,
	11 => 10044730,
	12 => 14981690,
	13 => 3035801,
	14 => 8356754,
	15 => 2039587,
	16 => 2039713,
	17 => 5797459,
	18 => 4738376,
	19 => 5149489,
	20 => 3484199,
	21 => 16284963,
	22 => 2445989,
	23 => 16262179
);

$spawn_egg_id = 383;
$spawn_egg_texture = 'spawn_egg';
$spawn_egg_colors = array(
	0 => array(16777215, 16777215),
	50 => array(894731, 0),
	51 => array(12698049, 4802889),
	52 => array(3419431, 11013646),
	54 => array(44975, 7969893),
	55 => array(5349438, 8306542),
	56 => array(16382457, 12369084),
	57 => array(15373203, 5009705),
	58 => array(1447446, 0),
	59 => array(803406, 11013646),
	60 => array(7237230, 3158064),
	61 => array(16167425, 16775294),
	62 => array(3407872, 16579584),
	65 => array(4996656, 986895),
	66 => array(3407872, 5349438),
	90 => array(15771042, 14377823),
	91 => array(15198183, 16758197),
	92 => array(4470310, 10592673),
	93 => array(10592673, 16711680),
	94 => array(2243405, 7375001),
	95 => array(14144467, 13545366),
	96 => array(10489616, 12040119),
	98 => array(15720061, 5653556),
	100 => array(12623485, 15656192),
	120 => array(5651507, 12422002)
);

$fireworks_charge_id = 402;
$fireworks_charge_color = 9079434;
$fireworks_charge_texture = 'fireworks_charge';

$special_count = count($leather_armor_textures) + count($potion_effect_colors)*2 + count($spawn_egg_colors);

$block_ids_dat = read_dat_file('block_ids.dat', function($parts) {
	return array((int) $parts[0], (int) $parts[1]);
});

$items_dat = read_dat_file('icons_items.dat', function($parts) {
	return array((int) $parts[0], (int) $parts[1], trim($parts[2]));
});

$blocks_dat = read_dat_file('icons_blocks.dat', function($parts) {
	return array((int) $parts[0], (int) $parts[1], trim($parts[2]));
});

$icons_count = count($block_ids_dat) + count($items_dat) + count($blocks_dat) + $special_count;

echo 'Minecraft ', MINECRAFT_VERSION, "\n";
$tmp_jar = tmp_file(MINECRAFT_VERSION . '.jar', false);
if (!file_exists($tmp_jar) || sha1_file($tmp_jar) != MINECRAFT_JAR_SHA1) {
	echo 'Downloading ' . MINECRAFT_VERSION . ".jar...\n";
	download_file('http://s3.amazonaws.com/Minecraft.Download/versions/' . MINECRAFT_VERSION . '/' . MINECRAFT_VERSION . '.jar', $tmp_jar);
	echo "Done.\n";
} else {
	echo MINECRAFT_VERSION . ".jar exists in temporary folder, skipping download.\n";
}
if (sha1_file($tmp_jar) != MINECRAFT_JAR_SHA1) {
	echo 'Corrupt file ' . MINECRAFT_VERSION . ".jar\n";
	unlink($tmp_jar);
	exit();
}

$tmp_zip = new ZipArchive();
if($tmp_zip->open($tmp_jar) !== TRUE) {
	echo 'Unable to open file ' . MINECRAFT_VERSION . ".jar\n";
	exit();
}

function get_texture($name) {
	global $tmp_zip;
	$stream = $tmp_zip->getStream('assets/minecraft/textures/' . $name);
	$im = imagecreatefromstring(stream_get_contents($stream));
	fclose($stream);
	return $im;
}

echo "Stitching item icons...\n";

$im_columns = 16;
$im_rows = 1;
$im_rows += ceil(count($block_ids_dat)/$im_columns);
$im_rows += ceil(count($items_dat)/$im_columns);
$im_rows += ceil(count($blocks_dat)/$im_columns);
$im_rows += ceil($special_count/$im_columns);

$im_width = 32*$im_columns;
$im_height = 32*$im_rows;

$css_fp = fopen(OUTPUT_DIR . '/items-' . MINECRAFT_VERSION . '.css', 'w');

$v = MINECRAFT_VERSION;
fwrite($css_fp, "/*\n");
fwrite($css_fp, ' All Minecraft ' . MINECRAFT_VERSION . " item icons. All textures are property of Mojang AB.\n");
fwrite($css_fp, " Stitched by goncalomb <http://goncalomb.com>.\n");
fwrite($css_fp, "*/\n\n");
fwrite($css_fp, "[class^=\"mc-icon-\"], [class*=\" mc-icon-\"] { display: inline-block; width: 32px; height: 32px; background-image: url(\"items-" . MINECRAFT_VERSION . ".png\"); background-repeat: no-repeat; }\n\n");

function write_icon_css($name, $x, $y) {
	global $css_fp;
	fwrite($css_fp, ".mc-icon-{$name} { background-position: -{$x}px -{$y}px; }\n");
};

$im_final = imagecreatetruecolor($im_width, $im_height);
imagealphablending($im_final, true);
imagefill($im_final, 0, 0, imagecolorallocatealpha($im_final, 0, 0, 0, 127));

$black = imagecolorallocate($im_final, 0, 0, 0);
$white = imagecolorallocate($im_final, 255, 255, 255);
$purple = imagecolorallocate($im_final, 255, 0, 255);

imagefilledrectangle($im_final, 0, 0, 31, 31, $black);
imagefilledrectangle($im_final, 16, 0, 31, 15, $purple);
imagefilledrectangle($im_final, 0, 16, 15, 31, $purple);
imagefilledrectangle($im_final, 0, 16, 15, 31, $purple);

imagefilledrectangle($im_final, 32, 0, $im_width - 1, 31, $white);
imagestring($im_final, 2, 36, 3, 'All Minecraft ' . MINECRAFT_VERSION . ' item icons. All textures are property of Mojang AB.', $black);
imagestring($im_final, 2, 36, 15, 'Stitched by goncalomb <http://goncalomb.com>.', $black);

$x = 0;
$y = 32;
function next_icon() {
	global $im_width, $x, $y;
	$x += 32;
	if ($x >= $im_width) {
		$x = 0;
		$y += 32;
	}
};
function next_icon_line() {
	global $x, $y;
	if ($x != 0) {
		$x = 0;
		$y += 32;
	}
};


function get_screenshot($n) {
	$im_red = @imagecreatefrompng(DATA_DIR . '/screenshots/' . $n . '_red.png');
	$im_green = @imagecreatefrompng(DATA_DIR . '/screenshots/' . $n . '_green.png');
	if ($im_red == FALSE || $im_green == FALSE) {
		return null;
	}
	$im = extract_original_image($im_red, $im_green);
	for ($y = 0, $h = imagesy($im_red); $y < $h; ++$y) {
		for ($x = 0, $w = imagesx($im_red); $x < $w; ++$x) {
			if (imagecolorat($im_red, $x, $y) == (255 << 16)) {
				return array($im, $x, $y);
			}
		}
	}
	return null;
}

$i = 0;
$screenshot = null;
$orig_x = 0;
$xx = $yy = 0;
foreach ($block_ids_dat as $data) {
	if ($i++%54 == 0) {
		$n = floor($i/54);
		$screenshot = get_screenshot($n);
		if (!$screenshot) {
			echo "  Warning: Invalid screenshot $n.\n";
			break;
		}
		list($im_screen, $xx, $yy) = $screenshot;
		$orig_x = $xx;
	}
	imagecopyresampled($im_final, $im_screen, $x, $y, $xx, $yy, 32, 32, 32, 32);
	write_icon_css($data[0] . '-' . $data[1], $x, $y);
	next_icon();
	$xx += 36;
	if ($i%9 == 0) {
		$xx = $orig_x;
		$yy += 36;
	}
}

fwrite($css_fp, "\n");
next_icon_line();

foreach ($items_dat as $item) {
	$im = get_texture($item[2]);
	imagecopyresampled($im_final, $im, $x, $y, 0, 0, 32, 32, 16, 16);
	write_icon_css($item[0] . '-' . $item[1], $x, $y);
	next_icon();
}

fwrite($css_fp, "\n");
next_icon_line();

foreach ($blocks_dat as $item) {
	$im = get_texture($item[2]);
	if (in_array($item[0] . ':' . $item[1], $flora_blocks)) {
		im_blend_with_color($im, $flora_blocks_color);
	}
	imagecopyresampled($im_final, $im, $x, $y, 0, 0, 32, 32, 16, 16);
	imagedestroy($im);
	write_icon_css($item[0] . '-' . $item[1], $x, $y);
	next_icon();
}

fwrite($css_fp, "\n");
next_icon_line();

foreach ($leather_armor_textures as $id => $tex) {
	$im = get_texture('items/' . $tex . '.png');
	im_blend_with_color($im, $leather_armor_color);
	imagecopyresampled($im_final, $im, $x, $y, 0, 0, 32, 32, 16, 16);
	imagedestroy($im);
	$im = get_texture('items/' . $tex . '_overlay.png');
	imagecopyresampled($im_final, $im, $x, $y, 0, 0, 32, 32, 16, 16);
	imagedestroy($im);
	write_icon_css($id . '-0', $x, $y);
	next_icon();
}

function create_potion_icons($baseTexture, $splashBit) {
	global $potion_id, $potion_overlay_texture, $potion_effect_colors, $im_final, $x, $y, $next_icon;
	$im_potion = get_texture('items/' . $baseTexture . '.png');
	foreach ($potion_effect_colors as $dat => $color) {
		$im = get_texture('items/' . $potion_overlay_texture . '.png');
		im_blend_with_color($im, $color);
		imagecopyresampled($im_final, $im, $x, $y, 0, 0, 32, 32, 16, 16);
		imagedestroy($im);
		imagecopyresampled($im_final, $im_potion, $x, $y, 0, 0, 32, 32, 16, 16);
		write_icon_css($potion_id . '-' . $dat . '-' . $splashBit, $x, $y);
		next_icon();
	}
	imagedestroy($im_potion);
};

create_potion_icons($potion_texture, 0);
create_potion_icons($potion_splash_texture, 1);

foreach ($spawn_egg_colors as $dat => $color) {
	$im_egg = get_texture('items/' . $spawn_egg_texture . '.png');
	im_blend_with_color($im_egg, $color[0]);
	imagecopyresampled($im_final, $im_egg, $x, $y, 0, 0, 32, 32, 16, 16);
	imagedestroy($im_egg);
	$im_overlay = get_texture('items/' . $spawn_egg_texture . '_overlay.png');
	im_blend_with_color($im_overlay, $color[1]);
	imagecopyresampled($im_final, $im_overlay, $x, $y, 0, 0, 32, 32, 16, 16);
	imagedestroy($im_overlay);
	write_icon_css($spawn_egg_id . '-' . $dat, $x, $y);
	next_icon();
}

$im = get_texture('items/' . $fireworks_charge_texture . '.png');
imagecopyresampled($im_final, $im, $x, $y, 0, 0, 32, 32, 16, 16);
imagedestroy($im);
$im = get_texture('items/' . $fireworks_charge_texture . '_overlay.png');
im_blend_with_color($im, $fireworks_charge_color);
imagecopyresampled($im_final, $im, $x, $y, 0, 0, 32, 32, 16, 16);
imagedestroy($im);
write_icon_css($fireworks_charge_id . '-0', $x, $y);
next_icon();

imagesavealpha($im_final, true);
imagepng($im_final, OUTPUT_DIR . '/items-' . MINECRAFT_VERSION . '.png');

fclose($css_fp);

$tmp_zip->close();

echo 'Done (', $icons_count, " icons).\n"

?>
