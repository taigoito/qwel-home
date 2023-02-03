/**
 * Init
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

// Drawer Menu
import DrawerMenu from "./js/_drawerMenu.js";
const options = {darkMode: true};
new DrawerMenu(options);

// Evil Icons
import EvilIcons from './js/_evilIcons.js';
new EvilIcons();

// Router
import Router from './js/_router.js';
new Router();

// Sketch
import Sketch from './js/_sketch.js';
const elem = document.getElementById('coverAnimation');
new Sketch(elem);
