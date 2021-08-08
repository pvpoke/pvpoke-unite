<?php

class i18n {
	private static $instance = null;
	private $messages = array();
	private $lang = 'en';

	private function __construct() {
		$this->loadMessages('global');
	}

	public function loadMessages($category){
		$json = file_get_contents(__DIR__ . "/../lang/".$this->lang."/".$category.".json");

		if($json !== FALSE){
			$arr = (array) json_decode($json, true);

			// Merge newly loaded messages into existing messages
			$this->messages = array_merge($arr, $this->messages);
		}
	}

	public function localize($id){
		if(isset($this->messages[$id])){
			return $this->messages[$id];
		} else{
			echo '<script>console.error("string '.$id.' missing")</script>';
			return $id;
		}
	}

	// The object is created from within the class itself
	// only if the class has no instance.
	public static function getInstance() {
		if (self::$instance == null)
		{
		  self::$instance = new i18n();
		}

		return self::$instance;
	}
}

$i18n = i18n::getInstance();

// Shorthand for returning a string

function e($id){
	echo i18n::getInstance()->localize($id);
}

// Shorthand for returning a string

function l($id){
	return i18n::getInstance()->localize($id);
}
?>
