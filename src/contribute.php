<?php
require_once 'modules/localize.php';

i18n::getInstance()->loadMessages("pages/contribute");

$CANONICAL = '/contribute/';

$META_TITLE = l("contribute_meta_title");

$META_DESCRIPTION = l("contribute_meta_description");

require_once 'header.php';

?>

<div id="contribute">

	<div class="section patterned padding">
		<div class="main-wrap">
			<h1><?php e("contribute_meta_title"); ?></h1>
			<p><?php e("contribute_content_1"); ?></p>
			<a class="button primary big corners" href="https://www.patreon.com/pvpoke" target="_blank">Patreon</a>
			<a class="button secondary big corners" href="https://github.com/pvpoke/pvpoke-unite" target="_blank">Github</a>
		</div>
	</div>
</div>

<?php require_once 'footer.php'; ?>
