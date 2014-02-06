<?php

include 'functions.php';

$block_ids_dat = read_dat_file('block_ids.dat', function($parts) {
	return array((int) $parts[0], (int) $parts[1]);
});

$chests = array();
$tag = array('Items' => array());
for ($i = 0, $l = count($block_ids_dat); $i < $l; ) {
	$tag['Items'][] = array('Count' => 1, 'Slot' => $i%27, 'id' => (int) $block_ids_dat[$i][0], 'Damage' => (int) $block_ids_dat[$i][1]);
	if (++$i%27 == 0) {
		$chests[] = $tag;
		$tag = array('Items' => array());
	}
}
if ($i%27 != 0) {
	$chests[] = $tag;
}

$i = 0;
foreach ($chests as $chest) {
	echo str_pad('===== Chest ' . ++$i . ' ', 80, '='), "\n";
	echo '/setblock ~ ~1 ~ minecraft:chest 0 replace ', str_replace('"', '', json_encode($chest)), "\n";
}
if (count($chests) > 0) {
	echo str_repeat('=', 80), "\n";
}

?>
