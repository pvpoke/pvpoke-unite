<?php require_once 'header.php'; ?>

<?php i18n::getInstance()->loadMessages("pages/builds"); ?>
<?php i18n::getInstance()->loadMessages("pokemon-strings"); ?>

<div id="builds">

	<div class="section patterned padding">
		<div class="main-wrap">
			<h1><?php e("nav_builds"); ?></h1>
			<p>Create your build below and compare it to other builds or Pokemon.</p>

			<button class="toggle lock-settings on"><?php e('lock_settings'); ?></button>

			<div class="build-list">
				<div class="new-build-section">
					<a class="new-build" href="#">+ Add Build</a>
				</div>
			</div>

			<div class="build-template template">
				<?php require_once 'modules/buildselect.php'; ?>
			</div>
		</div>
	</div>
</div>

<script src="<?php echo $WEB_ROOT; ?>js/Utils.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/GameMaster.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/HeldItem.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/BattleItem.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/Move.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/build/Build.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/SelectWindow.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/ModalWindow.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/BuildSelect.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/BuildsInterface.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/Main.js?v=<?php echo $SITE_VERSION; ?>"></script>

<?php i18n::getInstance()->outputCategoryToJS("pokemon-strings"); ?>

<?php require_once 'footer.php'; ?>
