<?php
require_once 'modules/localize.php';

i18n::getInstance()->loadMessages("pages/builds");
i18n::getInstance()->loadMessages("pokemon-strings");

$CANONICAL = '/builds/';

$META_TITLE = l("builds_meta_title");

$META_DESCRIPTION = l("builds_meta_description");

?>

<?php require_once 'header.php'; ?>

<?php i18n::getInstance()->loadMessages("item-strings"); ?>

<div id="builds">

	<div class="section patterned padding">
		<div class="main-wrap">
			<h1><?php e("nav_builds"); ?></h1>
			<p>Create your build below and compare it to other builds or Pokemon.</p>

			<div class="builds-nav">
				<div class="build-count">
					<span class="current">0</span> / <span class="max">4</span>
				</div>
				<button class="toggle lock-settings on"><?php e('lock_settings'); ?></button>
				<button class="toggle show-stats on"><?php e('show_stats'); ?></button>
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

	<div class="tooltip corners"></div>
</div>

<script src="<?php echo $WEB_ROOT; ?>js/Utils.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/GameMaster.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/Favorites.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/HeldItem.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/BattleItem.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/Move.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/Build.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/Tooltip.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/SelectWindow.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/ModalWindow.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/BuildSelect.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/Builds.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/Main.js?v=<?php echo $SITE_VERSION; ?>"></script>

<?php i18n::getInstance()->outputCategoryToJS("pokemon-strings"); ?>
<?php i18n::getInstance()->outputCategoryToJS("item-strings"); ?>
<?php i18n::getInstance()->outputCategoryToJS("pages/builds"); ?>

<?php require_once 'footer.php'; ?>
