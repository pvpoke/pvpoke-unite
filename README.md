# PvPoke Unite

[unite.pvpoke.com](https://unite.pvpoke.com) is a resource for Pokemon Unite that includes build and team analysis. The project’s goal is to provide tools and insights to help players organize their builds, plan their teams, or get quick ideas in the middle of solo Q. The project also includes a database (well, if you can call a JSON file a database) of all Pokemon, move, and item data. Everything is open source, and I hope this project can inspire new tools or benefit the existing ones for Pokemon Unite.

If this README looks familiar, check out the main [PvPoke repository](https://github.com/pvpoke/pvpoke). Buckle in because I'm about to copy and paste a bunch.

## Installation

To begin, you’ll need:

1. Apache (the server, not the attack helicopter)
2. PHP (let’s say 5.6.3 or higher, I’m really not doing anything fancy here so you can probably go lower but I’m not sure PHP is something you want to play limbo with)

If you’re starting from scratch, recommend installing your flavor of [XAMPP](https://www.apachefriends.org/index.html) or [MAMP](https://www.mamp.info/en/). Make sure to install the Apache and PHP modules. Once installed:

1. Place the files within PvPoke’s `src` directory somewhere in your `htdocs` folder, preferably in its own subdirectory
2. Run XAMPP or MAMP (from the control panel or through the “start” executable)
3. In your browser, navigate to `localhost/{subdirectory}` and the site should run

If you are running the site in a subdirectory, you’ll need to edit the `modules/config.php` file and change the `$WEB_ROOT` variable declaration to:

`$WEB_ROOT = '/{subdirectory}/';`

Because we’re flexible like that.

If you haven’t already, you may need to change your Apache settings to allow .htaccess to modify incoming requests. If you’re using XAMPP, find the `apache/conf/httpd.config` file and change:

```
<Directory />
    AllowOverride None
    Require all denied
</Directory>
```

To the following:

```
<Directory />
    AllowOverride All
    Require all denied
</Directory>
```

You can also set this specifically for the project directory. You may need to restart the server afterward.

## Site Structure

If you're familiar with the original PvPoke source code, this site is built on the same foundation. With the opportunity to start all over, I've reworked some key pieces with maintainability and organization in mind. I could have taken the same opportunity to not use PHP, but I'm not that good. Here's a quick overview of the site structure and main file components.

### Base Page Structure

The site's root directory contains the `header.php`, `footer.php`, and base page files for the site's core HTML content. `header.php` contains some PHP functionality to handle sitewide settings and GET parameters.

The `\modules` directory contains PHP files for HTML content or other PHP functionality that can be imported across the site. This is usually for repeatable content blocks or interface elements, such as the Build Selector, selectable Pokemon tiles. These can be imported multiple times per page.

Most HTML modules use a `"template"` class. These template blocks are then cloned by JQuery and appended to the page for each new interface element. For example, on a Builds page with 4 Build Selectors, JQuery takes the base Build Selector template and clones it 4 times. Interface classes then reference these blocks for their self-contained functionality (for example, one Build Selector shouldn't have access to the HTML elements and functions of other Build Selectors).

The interface files in `\modules` only contain the HTML content. They don't contain any functionality. Those are provided JavaScript files in the `\js\interface` directory.

### Styling

The site uses [SASS](https://sass-lang.com/) to generate its CSS files. To make style changes, to do not edit `style.css` directly. Instead, edit the relevant `scss` file and recompile `style.css` with the command line below:

`sass style.scss style.css`

You'll need to install SASS to get all sassy.

SASS files are organized according to [7-1 SASS architecture](https://www.learnhowtoprogram.com/user-interfaces/building-layouts-preprocessors/7-1-sass-architecture). Look at me all grown up. If you're having trouble finding where a specific style is defined, Google Chrome's element inspector will show which `scss` file to reference for a particular style.

All styling is defined within the `\css` directory. The site does not use inline styling except when modified by JavaScript.

### Functionality

As with PvPoke.com, this site's tools and core functionality are implemented via client-side JavaScript and JQuery. The site uses no other libraries, dependencies, or frameworks. Some JavaScript files are utilized on every page, while others are specific to a particular page or interface module. Below are some of the main JavaScript files and their functionality.

`GameMaster.js` loads and handles data for Pokemon, moves, items, and more. After it has loaded all of the data, the `GameMaster` class will initialize that page's `InterfaceMaster` object. The `GameMaster` class is a singleton object (only one instance of it can exist), and can be globally referenced via `GameMaster.getInstance()`.

The `InterfaceMaster` class implements all base functionality for a page and handles child interface elements. These files are located in `\js\interface\master`. The `InterfaceMaster` class is a singleton object (only one instance of it can exist), and can be globally referenced via `InterfaceMaster.getInstance()`.

`BuildSelect.js` implements functionality for a single `BuildSelect` object. This interface module handles user interaction for selecting a `Build` object and displays its relevant stats and features. The `BuildSelect` class utilizes HTML content provided by the `\modules\buildselect.php` module.

The `Build` class located in `js\build\Build.js` contains functionality for creating and adjusting a `Build` object. The `Build` object has methods for setting levels, adding held items, and selecting moves which the `BuildSelect` class calls in response to user interaction.

`Utils.js` is a miscellaneous script file with functions and event handlers that are used globally across the site. Could I be less specific?

### Game Data

If you're familiar with Pokemon GO development projects, you're probably familiar with the "gamemaster" file from the app, a massive JSON file that contains all Pokemon data, move data, settings, and attributes for the game. At this time I'm unaware of a similar source for Pokemon Unite, so one major aspect of this project is I put together Pokemon Unite "gamemaster" by hand. I've divided the JSON files into related datasets.

`\data\gamemaster\pokemon.json` contains data for Pokemon including base stats, moves, evolution stages, and other attributes. Moves are unique per Pokemon (for example, Slowbro's Surf attack is distinct from Greninja's Surf attack).


`\data\gamemaster\helditems.json` contains data for Held Items including primary bonuses and secondary bonuses. Bonuses are listed in an array with a length of 4 to match their values at level 1, 10, 20, and 30. Secondary bonus values are currently placeholder for below level 30.

`\data\gamemaster\battleitems.json` contains data for Battle Items including cooldowns.

`\data\gamemaster\formats.json` contains data for different game modes listed on the Teams page, including lanes and team caps.

### Localization

For PvPoke Unite, I've separated string content from the HTML to support localization. All string content is stored in JSON associative arrays located in the `\lang` directory. The `i18n` PHP class located in `\modules\localize.php` handles string and localization functionality. There is also a similar function `msg()` in the `\js\Utils.js` file for client-side needs.

Here is how localization works to produce page content:

1. When a page loads, base page PHP calls `i18n` to run the `loadMessages()` method for each category of required messages. This category string is a filepath for the relevant JSON file in the `\lang` directory.

2. `i18n` reads the JSON file and parses it into an associative array. It stores this array in two places: a general `$message` array of all loaded strings, and `$categories` associative array indexed by the category string.

3. Throughout the base page content, PHP fetches specific strings from `i18n` via the `localize()` method with string ID as a parameter. This function returns a string from the `$messages` array with an index matching the string ID. There are two shorthands for this function: `l()` returns the associated string as a value, and `e()` echoes the associated string as output.

4. Where necessary, the `i18n` class uses the `outputCategoryToJS()` method to output a specified category of strings to JavaScript. This allows JavaScript to dynamically generate content using these strings (such as windows for move or item descriptions). This is a bit messy, but saves the client the hassle of loading and processing the same JSON resources again.

In order to update page and site content, the necessary strings must be updated or added to the JSON files in the `\lang` directory. If updating content, do not hard code content directly into page HTML or JavaScript.

## Project Scope & Roadmap

Where we're going, we don't need a roadmap - well we probably do, so here's a quick outline of what to expect for future features and where you might be able to help if you're interested. PvPoke Unite currently contains two core features - Builds and Teams. I love developing systems and seeing them interact, and I hope future features can be built from these two systems (in particular the Builds system).

Some major features I would like to develop include:

1. Featured builds/teams. These would be read-only versions of the BuildSelect interface to provide basic recommendations or ideas as supplemental content on the Builds or Teams pages.

2. Building off of the above, trends/popularity information for most viewed Pokemon, most popular builds, most selected held items, etc. Tentatively this would be based event data gathered by Google Analytics. Possibly a comparable feature to PvPoke.com's rankings using popularity data from the site.

3. Damage calculator. Similar to PvPoke.com, a tool to show Build vs Build and highlight damage amounts. This requires damage formulas and move stats I currently don't have at the moment.

Regarding future features and development, let's talk about scope and scope creep! To facilitate my ability to maintain this and other projects, I have a few guidelines and principles for PvPoke Unite:

* Focus on client-side tools with minimal backend. Where possible, no databases, user accounts, server-side interactions, etc. This is PvPoke's secret sauce and allows for high scalability and portability.

* New features and updates should strive to be self-sustaining or automated where possible. Low upkeep features will make the site easier to maintain and faster to update when updates are required.

* Any tools that provide evaluations or ratings should strive to have an empirical basis in the game data and formulas. No subjective tier lists, etc.

If you would like to contribute to the project, please consider reaching out to me here or on [Twitter](https://twitter.com/pvpoke)! Especially for larger features or updates, discussing your ideas beforehand will help ensure they're a good fit for the project and that your time is used effectively.

## Acknowledgements

I'd like to give special thanks to [Serebii.net](https://serebii.net) for their research and fast updates. This project would not have been possible without their valuable reference. I'd also like to thank the team at [Stadium Gaming](https://www.stadiumgaming.gg/) for their encouragement and support, the Unite Mathcord for help answering formula and mechanics questions, and the beta test group for their early feedback.

Thanks for reading me!
