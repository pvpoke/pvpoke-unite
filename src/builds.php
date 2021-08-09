<?php require_once 'header.php'; ?>

<?php i18n::getInstance()->loadMessages("pages/builds"); ?>

<div id="builds">

	<div class="section patterned padding">
		<div class="main-wrap">
			<h1><?php e("nav_builds"); ?></h1>
			<p>Create your build below and compare it to other builds or Pokemon.</p>

			<div class="build-list">
				<div class="new-build-section">
					<a class="new-build" href="#">+ Add Build</a>
				</div>
			</div>

			<div class="build-template hide">
				<?php require_once 'modules/buildselect.php'; ?>
			</div>
		</div>
	</div>

</div>

<script src="<?php echo $WEB_ROOT; ?>js/GameMaster.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/BuildsInterface.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/Main.js?v=<?php echo $SITE_VERSION; ?>"></script>

<?php require_once 'footer.php'; ?>
