<?php
require_once 'modules/localize.php';

i18n::getInstance()->loadMessages("pages/settings");

$CANONICAL = '/settings/';

$META_TITLE = l("settings_meta_title");

$META_DESCRIPTION = l("settings_meta_description");

require_once 'header.php';

?>

<div id="settings">

	<div class="section patterned padding">
		<div class="main-wrap">
			<h1><?php e("settings_meta_title"); ?></h1>
			<p><?php e("settings_description"); ?></p>

			<div class="settings">

				<h3><?php e("settings_ads"); ?></h3>
				<div class="check ads <?php if($_SETTINGS->ads == 1) : ?>on<?php endif; ?>"><span></span> <?php e("settings_ads_button"); ?></div>
				<p><?php e("settings_ads_description"); ?></p>

				<button class="save button"><?php e("settings_save_button"); ?></button>
			</div>

			<div class="settings-save-message hide" header="<?php e("settings_save_header") ?>"><?php e("settings_save_message"); ?></div>
		</div>
	</div>
</div>

<script src="<?php echo $WEB_ROOT; ?>js/GameMaster.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/ModalWindow.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/masters/Settings.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/Main.js?v=<?php echo $SITE_VERSION; ?>"></script>

<?php require_once 'footer.php'; ?>
