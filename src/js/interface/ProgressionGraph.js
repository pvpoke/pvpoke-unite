
function ProgressionGraph(c){
	let self = this;
	let statCanvas = c;
	let statCtx = statCanvas.getContext("2d");

	let xAxisMax = 15;
	let yAxisMax = 1200;
	let width = statCanvas.width;
	let height = statCanvas.height;
	let gridCount = 7;

	let selectedStat = "hp";
	let build;
	let primaryBuild;

	let evoImg = new Image;
	let evoImgLoaded = false;

	self.update = function(b, p, s){
		build = b;
		primaryBuild = p;
		selectedStat = s;
		let isPrimary = (build == primaryBuild);

		width = statCanvas.width;
		height = statCanvas.height;

		// Clear canvas
		statCtx.clearRect(0, 0, width, height);

		drawGridLines();
		drawLevelLine();

		if(! isPrimary){
			graphStat(primaryBuild, selectedStat, true);
		}

		graphStat(build, selectedStat, false);

		//drawEvolutionStages(build);
		drawMoveUnlocks(build);

	}

	// Draws the grid lines on the graph
	function drawGridLines(){
		// Draw gridlines

		statCtx.lineWidth = 1;
		statCtx.strokeStyle = "#222222";

		statCtx.beginPath();

		for(var i = 0; i < gridCount; i++){
			let x = (width / gridCount) * i;
			statCtx.moveTo(x, 0);
			statCtx.lineTo(x, height);
		}

		statCtx.stroke();
		statCtx.closePath();
	}

	// Draw the dotted level line at the currently selected level
	function drawLevelLine(){
		// Draw level line

		statCtx.lineWidth = 1;
		statCtx.strokeStyle = "#888888";
		statCtx.setLineDash([5, 3]);
		let levelX = (build.level-1) * (width / 14);

		statCtx.beginPath();
		statCtx.moveTo(levelX, 0);
		statCtx.lineTo(levelX, height);
		statCtx.stroke();
		statCtx.closePath();
	}

	// Place a symbol for each evolution stage
	function drawEvolutionStages(b){
		let drawY = 8;

		/* What this hunk of junk does is load the evo img if it isn't already,
		* and doesn't create a new img object if it is loaded. Ensures the evo
		* image appears on the first drawing and doesn't flicker on later drawings. */

		if(! evoImgLoaded){
			evoImg.src = getAsset('evo-icon', '', 'png');

			evoImg.onload = function(){
				for(var i = 1; i < build.stages.length; i++){
					let x = (width * ((build.stages[i].level-1) / 14)) - 5;
					statCtx.drawImage(evoImg, x, drawY);
				}
			};

			evoImgLoaded = true;
		} else{
			for(var i = 1; i < build.stages.length; i++){
				let x = (width * ((build.stages[i].level-1) / 14)) - 5;
				statCtx.drawImage(evoImg, x, drawY);
			}
		}
	}

	function drawMoveUnlocks(b){
		let drawY = 20;
		let movesToDraw = [];

		// Slot 1
		movesToDraw.push({
			label: "\u25C9",
			level: b.movePool.slot1[1].unlockLevel,
			color: b.movePool.slot1[1].color
		});

		// Slot 2
		movesToDraw.push({
			label: "\u25C9",
			level: b.movePool.slot2[1].unlockLevel,
			color: b.movePool.slot2[1].color
		});

		// Unite
		movesToDraw.push({
			label: "U",
			level: b.movePool.unite.unlockLevel,
			color: b.movePool.unite.color
		});


		statCtx.font = 'bold 14px sans-serif';
		statCtx.lineWidth = 1;
		statCtx.textAlign = 'center';

		for(var i = 0; i < movesToDraw.length; i++){
			let x = (width * ((movesToDraw[i].level-1) / 14));

			statCtx.strokeStyle = "#517dc4";
			statCtx.beginPath();
			statCtx.arc(x, drawY, 8, 0, 2 * Math.PI, false);
			statCtx.stroke();
			statCtx.closePath();

			statCtx.fillStyle = "#517dc4";
			statCtx.fillText(movesToDraw[i].label, x, drawY+5);
		}
	}

	// Graph the stat for each level given a build and selected stat
	function graphStat(b, stat, isPrimary){
		xAxisMax = 15;
		yAxisMax = 1200;

		if(stat == "hp"){
			yAxisMax = 10000;
		}

		statCtx.lineWidth = 3;
		statCtx.strokeStyle = "#9950c5";
		statCtx.setLineDash([]);

		if(isPrimary){
			statCtx.strokeStyle = "#777";
			statCtx.setLineDash([5, 3]);
		}

		statCtx.beginPath();

		// Calculate stat at each level
		for(var i = 0; i < 15; i++){
			let stats = b.calculateStats(i+1);
			let displayStat = stats[stat].value;

			// Scaling Hp stat graph to show change more visually
			if(stat == "hp"){
				displayStat -= 3000;
			}

			let x = width * (i / 14);
			let y = height - (height * (displayStat / yAxisMax));

			statCtx.lineTo(x, y);
		}

		statCtx.stroke();
		statCtx.closePath();
	}
}
