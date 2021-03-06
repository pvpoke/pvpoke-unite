<?php require_once 'header.php'; ?>

<?php i18n::getInstance()->loadMessages("pages/home"); ?>

<div id="home">
	<div class="section patterned padding">
		<div class="main-wrap home-tiles">
			<a class="home-tile primary home-tile-1" href="<?php echo $WEB_ROOT; ?>builds/">
				<img src="<?php echo $WEB_ROOT; ?>img/home/home-tile-1.jpg" width="600" height="400" />
				<div class="tile-content corners"><?php e("home_tile_1_content") ?></div>
			</a>
			<a class="home-tile secondary home-tile-2" href="<?php echo $WEB_ROOT; ?>teams/">
				<img src="<?php echo $WEB_ROOT; ?>img/home/home-tile-2.jpg" width="600" height="400" />
				<div class="tile-content corners"><?php e("home_tile_2_content") ?></div>
			</a>
			<a class="home-tile quaternary home-tile-3" href="<?php echo $WEB_ROOT; ?>contribute/">
				<img src="<?php echo $WEB_ROOT; ?>img/home/home-tile-3b.jpg" width="600" height="200" />
				<div class="tile-content corners"><?php e("home_tile_3_content") ?></div>
			</a>
			<a class="home-tile tertiary home-tile-4" href="https://twitter.com/pvpoke" target="_blank">
				<img src="<?php echo $WEB_ROOT; ?>img/home/home-tile-4.jpg" width="600" height="200" />
				<div class="tile-content corners"><?php e("home_tile_4_content") ?></div>
			</a>
		</div>
	</div>

	<div class="section padding">
		<div class="main-wrap">
			<h2><?php e("about_pvpoke") ?></h2>
			<p><?php e("home_about_pvpoke_1"); ?></p>
			<p><?php e("home_about_pvpoke_2"); ?></p>
			<?php require 'config/ads/body-728.php'; ?>
		</div>
	</div>

	<div class="section patterned padding">
		<div class="main-wrap">

			<?php if($_SETTINGS->ads == 1) : ?>
				<span data-ccpa-link="1"></span>
			<?php endif; ?>

			<!--Update section for updates-->
			<h2><?php e("whats_new"); ?></h2>

			<h4>v1.1 (September 29th, 2021)</h4>
			<ul>
				<li>Added Pokemon data for Mamoswine</li>
			</ul>
		</div>
	</div>

</div>

<?php require_once 'footer.php'; ?>
