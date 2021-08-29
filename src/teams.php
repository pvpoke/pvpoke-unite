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
					<div class="label">Team Synergy: </div>
					<div class="synergy-meter"></div>
				</div>
			</div>
		</div>
	</div>

	<div class="section padding">
		<div class="main-wrap lanes">
			<div class="lane">
				<div class="header">
					<div class="name">Top Path</div>
					<div class="synergy">
						<div class="label">Lane Synergy: </div>
						<div class="synergy-meter"></div>
					</div>
				</div>
				<div class="pokemon-list">
					<div class="pokemon" pokemon-id="venusaur">
						<div class="image-container role-bg corners" role="attacker">
							<div class="image" style="background-image: url(&quot;../img/pokemon/venusaur.png&quot;);"></div>
						</div>
						<div class="name">Venusaur</div>
					</div>
					<div class="pokemon" pokemon-id="venusaur">
						<div class="image-container role-bg corners" role="attacker">
							<div class="image" style="background-image: url(&quot;../img/pokemon/venusaur.png&quot;);"></div>
						</div>
						<div class="name">Venusaur</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="lane-template">

	</div>

	<div class="build-template template">
		<?php require_once 'modules/buildselect.php'; ?>
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
<script src="<?php echo $WEB_ROOT; ?>js/interface/Teams.js?v=<?php echo $SITE_VERSION; ?>"></script>
<script src="<?php echo $WEB_ROOT; ?>js/Main.js?v=<?php echo $SITE_VERSION; ?>"></script>

<?php i18n::getInstance()->outputCategoryToJS("pokemon-strings"); ?>
<?php i18n::getInstance()->outputCategoryToJS("item-strings"); ?>
<?php i18n::getInstance()->outputCategoryToJS("pages/builds"); ?>

<?php require_once 'footer.php'; ?>
