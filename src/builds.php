<?php
require_once 'modules/localize.php';

i18n::getInstance()->loadMessages("pages/builds");
i18n::getInstance()->loadMessages("pokemon-strings");

$CANONICAL = '/builds/';

$META_TITLE = l("builds_meta_title");

$META_DESCRIPTION = l("builds_meta_description");

// Add Pokemon name to meta title

if(isset($_GET['builds'])){
	$arr = explode('-', $_GET['builds']);
	$arr = explode(',', $arr[0]);
	$pokemonId = htmlspecialchars($arr[0]);
	$pokemonName = l($pokemonId);

	if($pokemonName != $pokemonId){
		$META_TITLE = $pokemonName . ' ' . $META_TITLE;

		$CANONICAL = '/builds/' . $pokemonId;
	}
}

?>

<?php require_once 'header.php'; ?>

<?php i18n::getInstance()->loadMessages("item-strings"); ?>

<div id="builds">

	<div class="section patterned padding">
		<div class="main-wrap">
			<h1><?php e("nav_builds"); ?></h1>
			<p><?php e("builds_description") ?></p>

			<div class="builds-nav">
				<div class="build-count">
					<span class="current">0</span> / <span class="max">4</span>
				</div>

				<div class="check lock-settings on"><span></span><?php e('lock_settings'); ?></div>
				<div class="check show-stats on"><span></span><?php e('show_stats'); ?></div>
			</div>


			<div class="build-list" stats="true" full="false">
				<div class="new-build-section">
					<a class="new-build" href="#">+ Add Build</a>
				</div>
			</div>

			<div class="build-template template">
				<?php require_once 'modules/buildselect.php'; ?>
			</div>
		</div>

	</div>

	<?php if($_SETTINGS->ads == 1) : ?>
		<div class="section patterned">
			<?php require 'config/ads/body-728.php'; ?>
		</div>
	<?php endif; ?>


	<div class="tooltip corners"></div>
</div>

<?php i18n::getInstance()->outputCategoryToJS("pokemon-strings"); ?>
<?php i18n::getInstance()->outputCategoryToJS("item-strings"); ?>
<?php i18n::getInstance()->outputCategoryToJS("pages/builds"); ?>

<script src="<?php echo $WEB_ROOT; ?>js/GameMaster.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/Favorites.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/HeldItem.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/BattleItem.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/Move.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/Build.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/Tooltip.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/SelectWindow.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/ModalWindow.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/ProgressionGraph.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/BuildSelect.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/masters/BuildsInterface.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/Main.js?v=<?php echo $SITE_VERSION; ?>"></script>
<?php require_once 'footer.php'; ?>
