<div class="build-select">
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

		<div class="stats">
			<div class="stat overall">
				<div class="stat-label selected" value="overall"><?php e("overall"); ?></div>
				<div class="stat-value">0</div>
				<div class="stat-difference"></div>
			</div>
			<div class="stat hp">
				<div class="stat-label" value="hp"><?php e("hp"); ?></div>
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
		</div>
	</div>
</div>
