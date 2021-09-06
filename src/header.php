<?php require_once 'modules/config.php';
require_once 'modules/localize.php';

$SITE_VERSION = '0.2';

// This prevents caching on local testing
if (strpos($WEB_ROOT, 'src') !== false) {
    $SITE_VERSION = rand(1,1000) . '.' . rand(1,1000) . '.' . rand(1,1000);
}

// Initialize settings object
if(isset($_COOKIE['unite_settings'])){
	$_SETTINGS = json_decode($_COOKIE['unite_settings']);
} else{
	$_SETTINGS = (object) [
		'lang' => 'en',
		'ads' => 1
	];
}

?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php
if(! isset($META_TITLE)){
	$META_TITLE = l("site_title") . ' | ' . l("meta_title");
} else{
	$META_TITLE = $META_TITLE . ' | ' . l("site_title");
}

if(! isset($META_DESCRIPTION)){
	$META_DESCRIPTION = 'Brush up your game with build and team analysis for Pokemon Unite!';
}

if(! isset($OG_IMAGE)){
	$OG_IMAGE = 'https://pvpoke.com/img/og.jpg'; // Have to change this!
}
?>

<title><?php echo $META_TITLE; ?></title>
<meta name="description" content="<?php echo $META_DESCRIPTION; ?>" />

<?php if(isset($CANONICAL)): ?>
	<link rel="canonical" href="<?php echo $CANONICAL; ?>" /><!--Prevents Google from indexing hundreds of different versions of the same page-->
<?php endif; ?>

<!--OG tags for social-->
<meta property="og:title" content="<?php echo $META_TITLE; ?>" />
<meta property="og:description" content="<?php echo $META_DESCRIPTION; ?>" />
<meta property="og:image" content="<?php echo $OG_IMAGE; ?>" />

<meta name="apple-mobile-web-app-capable">
<meta name="mobile-web-app-capable">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel="manifest" href="<?php echo $WEB_ROOT; ?>data/manifest.json?v=1">

<link rel="icon" href="<?php echo $WEB_ROOT; ?>img/favicon.png">
<link rel="stylesheet" type="text/css" href="<?php echo $WEB_ROOT; ?>css/style.css?v=3">

<script src="<?php echo $WEB_ROOT; ?>js/libs/jquery-3.3.1.min.js"></script>

<?php require_once('modules/analytics.php'); ?>

<script>
	// Host for link reference

	var host = "<?php echo $WEB_HOST; ?>";
	var webRoot = "<?php echo $WEB_ROOT; ?>";
	var siteVersion = "<?php echo $SITE_VERSION; ?>";
	var messages = {}; // Object of translation messages

	<?php if(isset($_COOKIE['unite_settings'])) : ?>
		var settings = {
			'lang': "<?php echo htmlspecialchars($_SETTINGS->lang); ?>",
			'ads': "<?php echo htmlspecialchars($_SETTINGS->ads); ?>"
		};
	<?php else: ?>

		var settings = {
			'lang': 'en',
			'ads': 1
		};

	<?php endif; ?>

	// If $_GET request exists, output as JSON into Javascript

	<?php
	foreach($_GET as &$param){
		$param = htmlspecialchars($param);
	}


	if($_GET){
		echo 'var get = ' . json_encode($_GET) . ';';
	} else{
		echo 'var get = false;';
	}
	?>
</script>

	<?php require_once 'modules/ads/base-code.php'; ?>

</head>

<body <?php if($_SETTINGS->ads == 1) : ?>class="bracket-padding"<?php endif; ?>>
	<header class="section patterned">
		<div class="header-wrap">
			<h1 class="title"><a href="/"><?php e("pvpoke"); ?><span class="corners"><?php e("unite"); ?></span></a></h1>
			<div class="hamburger">
				<!--Because I'm too lazy to make a graphic-->
				<div class="meat"></div>
				<div class="meat"></div>
				<div class="meat"></div>
			</div>
			<div class="menu">
				<a href="<?php echo $WEB_ROOT; ?>builds/"><?php e("nav_builds"); ?></a>
				<a href="<?php echo $WEB_ROOT; ?>teams/"><?php e("nav_teams"); ?></a>
				<div class="parent-menu">
					<a class="more desktop" href="#"></a>
					<div class="submenu">
						<div class="submenu-wrap">
							<a class="icon-contribute" href="<?php echo $WEB_ROOT; ?>contribute/"><?php e("nav_contribute"); ?></a>
							<a class="icon-settings" href="<?php echo $WEB_ROOT; ?>settings/"><?php e("nav_settings"); ?></a>
							<a class="icon-twitter" href="https://twitter.com/pvpoke" target="_blank">Twitter</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>
