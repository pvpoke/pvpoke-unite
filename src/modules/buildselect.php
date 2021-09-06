<div class="build-select">
	<div class="nav-bar">
		<div class="star">&#9733;</div>
		<div class="menu">
			<div class="parent-menu">
				<a class="options" href="#">
					<div class="meat"></div>
					<div class="meat"></div>
					<div class="meat"></div>
				</a>
				<div class="submenu">
					<div class="submenu-wrap">
						<a class="move-to-front" href="#"><?php e("build_nav_move"); ?></a>
						<a class="add-to-favorites" href="#"><?php e("build_nav_favorite"); ?></a>
						<a class="save-changes" href="#"><?php e("build_nav_save_changes"); ?></a>
						<a class="duplicate" href="#"><?php e("build_nav_duplicate"); ?></a>
						<a class="delete" href="#"><?php e("build_nav_delete"); ?></a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="build-wrap">
		<div class="poke-select">
			<input type="text" class="poke-search" placeholder="Search" />
			<div class="tabs">
				<a href="#" class="active" value="new"><?php e("build_tab_new"); ?></a>
				<a href="#" value="favorites"><?php e("build_tab_favorites"); ?></a>
			</div>
			<div class="pokemon-list">
			</div>
			<?php require 'pokemonsquare.php'; ?>

		</div>

		<div class="details">
			<div class="selected-pokemon role-bg corners">
				<div class="image"></div>
				<div class="container">
					<div class="name"></div>
					<a class="remove" href="#">X</a>
				</div>
			</div>

			<div class="attributes"></div>

			<div class="advanced">
				<canvas class="progression"></canvas>

				<div class="level">
					<div class="label"><?php e("level"); ?></div>
					<div class="value">1</div>
				</div>

				<div class="level-slider-wrap">
					<input class="slider level-slider" type="range" min="1" max="15" value="1">
				</div>

				<div class="stats">
					<div class="stat hp">
						<div class="stat-label selected" value="hp"><?php e("hp"); ?></div>
						<div class="stat-value tooltippable">0</div>
						<div class="stat-difference"></div>
					</div>
					<div class="stat atk">
						<div class="stat-label" value="atk"><?php e("atk"); ?></div>
						<div class="stat-value tooltippable">0</div>
						<div class="stat-difference"></div>
					</div>
					<div class="stat def">
						<div class="stat-label" value="def"><?php e("def"); ?></div>
						<div class="stat-value tooltippable">0</div>
						<div class="stat-difference"></div>
					</div>
					<div class="stat sp_atk">
						<div class="stat-label" value="sp_atk"><?php e("sp_atk"); ?></div>
						<div class="stat-value tooltippable">0</div>
						<div class="stat-difference"></div>
					</div>
					<div class="stat sp_def">
						<div class="stat-label" value="sp_def"><?php e("sp_def"); ?></div>
						<div class="stat-value tooltippable">0</div>
						<div class="stat-difference"></div>
					</div>
					<div class="stat link">
						Stats from &nbsp;<a href="https://www.serebii.net/pokemonunite/pokemon.shtml" target="_blank">serebii.net</a>
					</div>
				</div>
			</div>


			<h4><?php e("held_items"); ?></h4>

			<div class="held-items">
				<div class="held-item">+</div>
				<div class="held-item">+</div>
				<div class="held-item">+</div>
			</div>

			<h4><?php e("battle_item"); ?></h4>

			<div class="battle-item">
				<div class="image">+</div>
				<div class="name"></div>
			</div>

			<h4><?php e("moveset"); ?></h4>
			<div class="move ability" slot="slot1">
				<div class="image">
					<div class="asset"></div>
				</div>
				<div class="name"></div>
			</div>
			<div class="move ability"  slot="slot2">
				<div class="image">
					<div class="asset"></div>
				</div>
				<div class="name"></div>
			</div>
			<div class="divider"></div>
			<div class="move" slot="unite">
				<div class="image">
					<div class="asset"></div>
				</div>
				<div class="name"></div>
			</div>
			<div class="move passive" slot="passive">
				<div class="image">
					<div class="asset"></div>
				</div>
				<div class="name"></div>
			</div>
			<div class="move basic" slot="basic">
				<div class="image">
					<div class="asset"></div>
				</div>
				<div class="name"></div>
			</div>

			<h4><?php e("share"); ?></h4>
			<div class="share-link">
				<input type="text" value="" readonly>
				<button class="copy"><?php e("button_copy"); ?></button>
			</div>

			<div class="team-link-section hide">
				<h4><?php e("synergies"); ?></h4>
				<a class="team-link button secondary" target="_blank"><?php e("button_team_link"); ?></a>
			</div>

			<div class="build-link-section hide">
				<h4><?php e("builds"); ?></h4>
				<a class="build-link button secondary" target="_blank"><?php e("button_build_link"); ?></a>
			</div>
		</div>
	</div>

	<!-- Modal windows-->

	<div class="held-item-modal select-modal hide" header="" header-held="<?php e("held_item"); ?>" header-battle="<?php e("battle_item"); ?>" header-move="<?php e("move"); ?>">
		<div class="selected-item">
			<div class="image">
				<div class="asset"></div>
			</div>
			<div class="name-container">
				<div class="name"></div>
				<div class="attributes"></div>
			</div>
		</div>
		<div class="selected-description"></div>
		<div class="item-list">
			<div class="item template">
				<div class="image">
					<div class="asset"></div>
				</div>
				<div class="name"></div>
			</div>
		</div>
		<button class="select"><?php e("select_button"); ?></button>
	</div>

	<div class="delete-favorite-modal hide" header="Delete Build">
		<p>Are you sure you want to delete this build from your favorites?</p>
		<div class="buttons">
			<button class="yes">Yes</button>
			<button class="no">No</button>
		</div>
	</div>


</div>
