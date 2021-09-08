<?php
require_once 'modules/localize.php';

i18n::getInstance()->loadMessages("pages/teams");
i18n::getInstance()->loadMessages("pages/builds");
i18n::getInstance()->loadMessages("pokemon-strings");

$CANONICAL = '/teams/';

$META_TITLE = l("teams_meta_title");

$META_DESCRIPTION = l("teams_meta_description");

?>

<?php require_once 'header.php'; ?>

<?php i18n::getInstance()->loadMessages("item-strings"); ?>

<div id="teams">

	<div class="section patterned padding">
		<div class="main-wrap">
			<h1><?php e("teams_meta_title"); ?></h1>
			<p><?php e("teams_description"); ?></p>

			<div class="top-team-panel">
				<?php require_once 'modules/formatselect.php'; ?>

				<div class="synergy">
					<div class="label"><?php e("team_synergy") ?>: </div>
					<div class="synergy-meter">
						<div class="background">
							<div class="star"></div>
							<div class="star"></div>
							<div class="star"></div>
							<div class="star"></div>
							<div class="star"></div>
						</div>
						<div class="stars"></div>
					</div>
					<div class="info"></div>
				</div>
			</div>
		</div>
	</div>

	<div class="section padding">
		<div class="main-wrap lanes">
		</div>

		<div class="main-wrap share-section">
			<h4>Share</h4>
			<div class="share-link">
				<input type="text" value="" readonly>
				<button class="copy"><?php e("button_copy"); ?></button>
			</div>
		</div>


	</div>

	<!-- HTML template for lane interface-->
	<div class="lane template">
		<div class="header">
			<div class="name"></div>
			<div class="synergy">
				<div class="label"><?php e("synergy") ?>: </div>
				<div class="synergy-meter">
					<div class="background">
						<div class="star"></div>
						<div class="star"></div>
						<div class="star"></div>
						<div class="star"></div>
						<div class="star"></div>
					</div>
					<div class="stars"></div>
				</div>
				<div class="info"></div>
			</div>
		</div>
		<div class="main pokemon-list">
			<div class="pokemon add">
				<div class="image-container corners">
					<div class="image">+</div>
				</div>
			</div>
		</div>
		<div class="footer">
			<div class="recommended-section">
				<div class="label"><?php e("teams_recommended"); ?>:</div>
				<div class="recommended pokemon-list small"></div>
			</div>
		</div>
	</div>

	<!-- HTML template for Pokemon listed in a lane-->
	<?php require 'modules/pokemonsquare.php'; ?>

	<!-- HTML template for build selector-->
	<div class="build-template template">
		<?php require_once 'modules/buildselect.php'; ?>
	</div>

	<!-- HTML template for synergy details modal-->
	<div class="synergy-modal template">
		<div class="pokemon-list small"></div>
		<div class="synergy-details"></div>
		<div class="synergy-detail template">
			<div class="bar-section">
				<div class="star-number"></div>
				<div class="bars"></div>
			</div>

			<div class="label"></div>
		</div>
		<h4><?php e("about_synergy"); ?></h4>
		<p><?php e("about_synergy_content_1"); ?></p>
		<p><?php e("about_synergy_content_2"); ?></p>
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
<script src="<?php echo $WEB_ROOT; ?>js/team/Lane.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/team/Team.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/Tooltip.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/SelectWindow.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/ModalWindow.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/ProgressionGraph.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/BuildSelect.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/interface/masters/TeamsInterface.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/Main.js?v=<?php echo $SITE_VERSION; ?>"></script>

<?php i18n::getInstance()->outputCategoryToJS("pokemon-strings"); ?>
<?php i18n::getInstance()->outputCategoryToJS("item-strings"); ?>
<?php i18n::getInstance()->outputCategoryToJS("pages/builds"); ?>
<?php i18n::getInstance()->outputCategoryToJS("pages/teams"); ?>

<?php require_once 'footer.php'; ?>
