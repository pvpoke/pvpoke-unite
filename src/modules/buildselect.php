<div class="build-select">
	<div class="nav-bar">
		<div class="menu">
			<div class="parent-menu">
				<a class="options" href="#">
					<div class="meat"></div>
					<div class="meat"></div>
					<div class="meat"></div>
				</a>
				<div class="submenu">
					<div class="submenu-wrap">
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
			<div class="pokemon-list">
				<div class="pokemon template" pokemon-id="">
					<div class="image"></div>
					<div class="name"></div>
				</div>
			</div>

		</div>

		<div class="details">
			<div class="selected-pokemon">
				<div class="name"></div>
				<a class="remove" href="#">X</a>
			</div>

			<div class="attributes"></div>

			<canvas class="progression"></canvas>

			<div class="level">
				<div class="label"><?php e("level"); ?></div>
				<div class="value">1</div>
			</div>

			<input class="slider level-slider" type="range" min="1" max="15" value="1">

			<div class="stats">
				<div class="stat hp">
					<div class="stat-label selected" value="hp"><?php e("hp"); ?></div>
					<div class="stat-value">0</div>
					<div class="stat-difference"></div>
				</div>
				<div class="stat atk">
					<div class="stat-label" value="atk"><?php e("attack"); ?></div>
					<div class="stat-value">0</div>
					<div class="stat-difference"></div>
				</div>
				<div class="stat def">
					<div class="stat-label" value="def"><?php e("defense"); ?></div>
					<div class="stat-value">0</div>
					<div class="stat-difference"></div>
				</div>
				<div class="stat spa">
					<div class="stat-label" value="spA"><?php e("special_attack"); ?></div>
					<div class="stat-value">0</div>
					<div class="stat-difference"></div>
				</div>
				<div class="stat spd">
					<div class="stat-label" value="spD"><?php e("special_defense"); ?></div>
					<div class="stat-value">0</div>
					<div class="stat-difference"></div>
				</div>
				<div class="stat link">
					Stats from &nbsp;<a href="https://www.serebii.net/pokemonunite/pokemon.shtml" target="_blank">serebii.net</a>
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
				<div class="image"></div>
				<div class="name"></div>
			</div>
			<div class="move ability"  slot="slot2">
				<div class="image"></div>
				<div class="name"></div>
			</div>
			<div class="divider"></div>
			<div class="move" slot="unite">
				<div class="image"></div>
				<div class="name"></div>
			</div>
			<div class="move passive" slot="passive">
				<div class="image"></div>
				<div class="name"></div>
			</div>
			<div class="move basic" slot="basic">
				<div class="image"></div>
				<div class="name"></div>
			</div>

			<h4><?php e("share"); ?></h4>
			<div class="share-link">
				<input type="text" value="" readonly>
				<button class="copy">Copy</button>
			</div>
		</div>
	</div>

	<!-- Modal windows-->

	<div class="held-item-modal select-modal hide" header="<?php e("held_item"); ?>">
		<div class="selected-item">
			<div class="image"></div>
			<div class="name"></div>
		</div>
		<div class="selected-description"></div>
		<div class="item-list">
			<div class="item template">
				<div class="image"></div>
				<div class="name"></div>
			</div>
		</div>
		<button class="select"><?php e("select_button"); ?></button>
	</div>
</div>
