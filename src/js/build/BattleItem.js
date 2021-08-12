/*
* Held Item class representing a specific item held by a Pokemon
*/

function BattleItem(id){

	let self = this;
	let gm = GameMaster.getInstance();
	let data = gm.getBattleItemById(id);

	if(! data)
		return false;

	self.itemId = data.itemId;
	self.itemName = self.itemId;
	self.cooldown = data.cooldown;
}

// Hello I am a tiny class
