<?php require_once 'header.php'; ?>

<div class="section home white">

	<p>Welcome to PvPoke Unite! PvPoke is an open-source tool for build and team analysis of Pokemon Unite.</p>

	<?php require 'modules/ads/body-728.php'; ?>

	<?php if($_SETTINGS->ads == 1) : ?>
		<span data-ccpa-link="1"></span>
	<?php endif; ?>

	<!--Update section for updates-->
	<h3>What's New</h3>

	<h4>v1.22.18 (July 24, 2021)</h4>
	<ul>
		<li>Fixed an issue with the training AI evaluating some scenarios incorrectly</li>
		<li>Fixed an issue where individual battles in Master League Classic would set the Pokemon to level 50.</li>
		<li>Fixed an issue where custom threats and alternatives entered in the Team Builder weren't reflected correctly in battle links.</li>
	</ul>

</div>

<?php require_once 'footer.php'; ?>
