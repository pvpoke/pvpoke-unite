<?php require_once 'header.php'; ?>

<?php i18n::getInstance()->loadMessages("pages/home"); ?>

<div class="section home white">

	<p><?php e("home_welcome"); ?></p>

	<?php require 'modules/ads/body-728.php'; ?>

	<?php if($_SETTINGS->ads == 1) : ?>
		<span data-ccpa-link="1"></span>
	<?php endif; ?>

	<!--Update section for updates-->
	<h3><?php e("whats_new"); ?></h3>

	<h4>v1.22.18 (July 24, 2021)</h4>
	<ul>
		<li>Fixed an issue with the training AI evaluating some scenarios incorrectly</li>
		<li>Fixed an issue where individual battles in Master League Classic would set the Pokemon to level 50.</li>
		<li>Fixed an issue where custom threats and alternatives entered in the Team Builder weren't reflected correctly in battle links.</li>
	</ul>

</div>

<script src="<?php echo $WEB_ROOT; ?>js/GameMaster.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/InterfaceTemplate.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/Main.js?v=<?php echo $SITE_VERSION; ?>"></script>

<?php require_once 'footer.php'; ?>
