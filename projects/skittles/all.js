use2D = true;
//initGame("canvas");

var block_width = 14;
var block_height = 14;

var timer_max = 5;
var timer = 1;
var can_move = true;
// a proabaly unessary bool to make sure the dir doesn't change will the snake is updating
var shifiting = false;
// make sure we don't go forward and back shift at the same time

var RED = Textures.load("./red.png");
var ORANGE = Textures.load("./orange.png");
var YELLOW = Textures.load("./yellow.png");
var GREEN = Textures.load("./green.png");
var BLUE = Textures.load("./blue.png");
var PURPLE = Textures.load("./purple.png");
var GRAY = Textures.load("./gray.png");

var local_canvas = document.getElementById('canvas');

/* food array */
var food_ary = new Array();
food_ary.food_time = 400;

/* main snake linked list controller */
var snake_ptr = new Sprite();
snake_ptr.size = 1;
// for head
snake_ptr.index = 1;
snake_ptr.min_size = 10000;

var score = new TextBox();
score.x = 40;
score.y = 20;
score.xvel = 1;
score.yvel = 1;
score.fontSize = 28;
score.time = 0;
score.counter = 5;
score.index = 10;
score.color = '#545654';
score.text = "Pieces Left: " + snake_ptr.size + "      Time Taken: 0";
world.addChild(score);
score.update = function(d) {
	++this.time;
	this.text = "Pieces Left: " + snake_ptr.size + "\nTime Taken: " + (Math.floor(score.time / 100));
}

var boxz = new Sprite();
boxz.width = local_canvas.width;
boxz.height = local_canvas.height;
boxz.x = 0;
boxz.y = 0;
boxz.index = 100;
world.addChild(boxz);
boxz.image = Textures.load("https://dl.dropbox.com/u/55589692/cs20/hw1/images/black.png");

function start_game() {
	timer = 1;
	snake_ptr.size = 1;
	// for head
	score.time = 0;
	score.color = '#545654';
	snake_ptr.dir = 'l';
	// "u,l,d,r"
	snake_ptr.head = null;
	// head
	snake_ptr.tail = null;
	// tail

	var head = new Sprite();
	head.index = 1;
	head.width = block_width;
	head.height = block_height;
	head.x = Math.floor(local_canvas.width / (block_width * 2)) * block_width;
	head.y = Math.floor(local_canvas.height / (block_height * 2)) * block_height;
	world.addChild(head);
	head.image = get_color(4);
	head.prev = null;
	head.next = null;
	snake_ptr.head = head;
	snake_ptr.tail = head;

	var pre = snake_ptr.tail;
	new_piece(pre.x + (1 * block_width), pre.y, get_color(Math.floor(Math.random() * 6) + 1));
	new_piece(pre.x + (2 * block_width), pre.y, get_color(Math.floor(Math.random() * 6) + 1));
	pre = snake_ptr.tail;
	for (var i = 1; i < 5; ++i)
		new_piece(pre.x, pre.y + (i * block_height), get_color(Math.floor(Math.random() * 6) + 1));
	pre = snake_ptr.tail;
	for (var i = 1; i < 5; ++i)
		new_piece(pre.x + (i * block_width), pre.y, get_color(Math.floor(Math.random() * 6) + 1));
	pre = snake_ptr.tail;
	new_piece(pre.x, pre.y - (1 * block_height), get_color(Math.floor(Math.random() * 6) + 1));
	pre = snake_ptr.tail;
	new_piece(pre.x + (1 * block_width), pre.y, get_color(Math.floor(Math.random() * 6) + 1));
	pre = snake_ptr.tail;
	for (var i = 1; i < 4; ++i)
		new_piece(pre.x, pre.y - (i * block_height), get_color(Math.floor(Math.random() * 6) + 1));
	pre = snake_ptr.tail;
	new_piece(pre.x + (1 * block_width), pre.y, get_color(Math.floor(Math.random() * 6) + 1));
	pre = snake_ptr.tail;
	for (var i = 1; i < 4; ++i)
		new_piece(pre.x, pre.y - (i * block_height), get_color(Math.floor(Math.random() * 6) + 1));
	pre = snake_ptr.tail;
	new_piece(pre.x - (1 * block_width), pre.y, get_color(Math.floor(Math.random() * 6) + 1));
	pre = snake_ptr.tail;
	new_piece(pre.x, pre.y - (1 * block_height), get_color(Math.floor(Math.random() * 6) + 1));
	pre = snake_ptr.tail;
	for (var i = 1; i < 4; ++i)
		new_piece(pre.x - (i * block_width), pre.y, get_color(Math.floor(Math.random() * 6) + 1));

	for (var jj = 0; jj < 3; ++jj)
		drop_food();
}

start_game();

/* Will generate random cordniates and check if something is located
 * at those cordniates. If so it will generate new coridnadtes until
 * the conflict is resovled. Note these cordnates are either by a
 * corner or by the snake */
function drop_food() {
	var timer_boost = 0;
	// add more time to make it easier
	if (snake_ptr.size < snake_ptr.min_size)
		snake_ptr.min_size = snake_ptr.size;
	if (snake_ptr.min_size > 10)
		timer_boost = 100;
	else if (snake_ptr.min_size > 5)
		timer_boost = 50;

	var food_x;
	var food_y;
	var no_collision = true;
	while (true) {
		food_x = Math.floor(Math.random() * (Math.floor(local_canvas.width / block_width))) * block_width;
		food_y = Math.floor(Math.random() * (Math.floor(local_canvas.height / block_height))) * block_height;
		for (var curr = snake_ptr.head; curr != null; curr = curr.next) {
			if (food_x == curr.x && food_y == curr.y) {
				no_collision = false;
				break;
			}
		}
		if (!no_collision) {// if a collison then try again
			no_collision = !no_collision;
			// no_collision = true
			continue;
		}
		// no collison so check food
		for (var i = 0; i < food_ary.length; ++i) {
			if (food_x == food_ary[i].x && food_y == food_ary[i].y) {
				no_collision = false;
				break;
			}
		}
		if (!no_collision) {// if a collison then try again
			no_collision = !no_collision;
			// no_collision = true
			continue;
		}

		break;
	}

	var food = new Sprite();
	food.width = block_width;
	food.height = block_height;
	food.x = food_x;
	food.y = food_y;
	food.timer = food_ary.food_time + timer_boost;
	food.old = false;
	food.update = function(d) {
		if (!this.old) {--this.timer;
			if (this.timer <= 0) {
				this.old = true;
				this.image = GRAY;
				drop_food();
			}
		}
	}
	food.image = get_color(Math.floor(Math.random() * 6) + 1);
	world.addChild(food);
	food_ary.push(food);
	//   console.log("Food made at: " + food.x + "  " + food.y);
}

/* creates a new piece of snake and adds it infront of the head
 * takes in the cordiantes and the image to apply  */
function new_head(new_x, new_y, new_img) {
	++snake_ptr.size;
	var piece = new Sprite();
	piece.width = block_width;
	piece.height = block_height;
	piece.x = new_x;
	piece.y = new_y;
	piece.image = new_img;
	world.addChild(piece);
	// make it the new head
	snake_ptr.head.prev = piece;
	piece.next = snake_ptr.head;
	piece.prev = null;
	snake_ptr.head = piece;

	piece.index = 1;
}

/* creates a new piece of snake and adds it to the end of the snake_ptr */
/* not the linked list will always have more than 1 element */
/* call with -1,-1 to have cordinates be generated for you */
function new_piece(new_x, new_y, new_img) {
	++snake_ptr.size;
	var piece = new Sprite();
	piece.width = block_width;
	piece.height = block_height;
	if (new_x < 0 || new_y < 0) {
		if (snake_ptr.tail.x < snake_ptr.tail.prev.x) {
			piece.x = snake_ptr.tail.x - block_width;
			piece.y = snake_ptr.tail.y;
		} else if (snake_ptr.tail.x > snake_ptr.tail.prev.x) {
			piece.x = snake_ptr.tail.x + block_width;
			piece.y = snake_ptr.tail.y;
		} else if (snake_ptr.tail.y > snake_ptr.tail.prev.y) {
			piece.x = snake_ptr.tail.x;
			piece.y = snake_ptr.tail.y + block_height;
		} else {
			piece.x = snake_ptr.tail.x;
			piece.y = snake_ptr.tail.y - block_height;
		}
	} else {
		piece.x = new_x;
		piece.y = new_y;
	}
	piece.image = new_img;
	world.addChild(piece);
	piece.prev = snake_ptr.tail;
	piece.next = null;

	snake_ptr.tail.next = piece;
	snake_ptr.tail = piece;
	piece.index = 1;
}

/* give the direction it will 'move' the snake.
 * done by moving the tail to the head. Will
 * check to see if there are collisions */
function move_snake() {
	if (snake_ptr.head != null && snake_ptr.tail != null) {
		/* calculate next head position */
		var next_x = snake_ptr.head.x;
		var next_y = snake_ptr.head.y;
		if (snake_ptr.dir == 'r')
			next_x += block_width;
		else if (snake_ptr.dir == 'l')
			next_x -= block_width;
		else if (snake_ptr.dir == 'u')
			next_y -= block_height;
		else if (snake_ptr.dir == 'd')
			next_y += block_height;

		/* I had issues with the wall collisions so I moved the code higher up */
		var dead = false;
		if (snake_ptr.head.x + block_width > local_canvas.width)
			dead = true;
		else if (snake_ptr.head.x < 0)
			dead = true;
		else if (snake_ptr.head.y < 0)
			dead = true;
		else if (snake_ptr.head.y + block_height > local_canvas.height)
			dead = true;
		if (dead == true) {
			restart_game();
			return;
		}

		/* check if you will hit a food. if so don't move and put the food on front */
		var will_touch = 0;
		// 0 = false, 1 = true, 2 = gray block
		var i;
		for ( i = 0; i < food_ary.length; ++i) {
			if (food_ary[i].x == next_x && food_ary[i].y == next_y) {
				will_touch = 1;
				if (food_ary[i].image == GRAY) {
					will_touch = 2;
					restart_game();
				}
				break;
			}
		}

		if (will_touch == 1) {// we will eat
			var food_img = food_ary[i].image;

			/* count how many in a row there are */
			var same = 0;
			for (var curr = snake_ptr.head; curr != null && curr.image == food_img; ++same) {
				curr = curr.next;
			}

			if (same > 1) {// at least 3
				if (same == snake_ptr.size) {
					game_won();
					return;
				} else {// we know aleast the tail will remain
					var score_to_add = same + 1;
					var next = snake_ptr.head;
					for (var curr = next; same != 0; --same) {
						curr = next;
						next = next.next;
						world.removeChild(curr);
					}
					snake_ptr.size -= score_to_add - 1;
					next.prev = null;
					snake_ptr.head = next;
				}
			} else {
				new_head(next_x, next_y, food_img);
			}
			world.removeChild(food_ary[i]);
			food_ary[i].remove();
			food_ary.splice(i, 1);
			drop_food();
		} else if (will_touch == 0) {// we won't eat
			if (snake_ptr.head != snake_ptr.tail) {// one piece left!
				/* shift up colors so they won't move*/
				var tmp2 = snake_ptr.tail.image;
				for (var curr = snake_ptr.tail; curr != snake_ptr.head; curr = curr.prev) {
					var tmp1 = curr.prev.image;
					curr.prev.image = tmp2;
					tmp2 = tmp1;
				}
				snake_ptr.tail.image = tmp2;

				var tmp_head_x = snake_ptr.head.x;
				var tmp_head_y = snake_ptr.head.y;
				var tmp = snake_ptr.tail.prev;
				// will be new tail
				snake_ptr.tail.prev.next = null;
				// unlink the 2nd to last from tail
				snake_ptr.tail.prev = null;
				// unlink the tail from the link before
				// move tail infront
				snake_ptr.tail.next = snake_ptr.head;
				snake_ptr.head.prev = snake_ptr.tail;
				// the 2nd to last now is last
				snake_ptr.tail = tmp;
				snake_ptr.head = snake_ptr.head.prev;
			}
			snake_ptr.head.x = next_x;
			snake_ptr.head.y = next_y;
			console.log("s:  " + next_x + "  " + next_y);
			/* check for snake colliding with itself*/
			var dead = false;
			for (var curr = snake_ptr.head.next; curr != null; curr = curr.next) {
				if (snake_ptr.head.x == curr.x && snake_ptr.head.y == curr.y) {
					dead = true;
					break;
				}
			}
			if (dead) {
				restart_game();
				return;
			}
		}
	}
}

/* will move the colors of the snake down */
function shift_snake() {
	if (!shifiting && snake_ptr.size > 1) {
		shifiting = true;
		can_move = false;

		var tmp2 = snake_ptr.tail.image;
		for (var curr = snake_ptr.tail; curr != snake_ptr.head; curr = curr.prev) {
			var tmp1 = curr.prev.image;
			curr.prev.image = tmp2;
			tmp2 = tmp1;
		}
		snake_ptr.tail.image = tmp2;

		can_move = true;
		shifiting = false;
	}
}

/* will move the colors of the snake up */
function back_shift_snake() {
	if (!shifiting && snake_ptr.size > 1) {
		shifiting = true;
		can_move = false;

		var tmp2 = snake_ptr.head.image;
		for (var curr = snake_ptr.head; curr != snake_ptr.tail; curr = curr.next) {
			var tmp1 = curr.next.image;
			curr.next.image = tmp2;
			tmp2 = tmp1;
		}
		snake_ptr.head.image = tmp2;

		can_move = true;
		shifiting = false;
	}
}

//Create a sprite to manage dragging the other sprites
var manager = new Sprite();
manager.index = 1;
world.addChild(manager);
//Make sure to add it to the world

//What happens when the mouse is down
manager.onMouseDown = function(button) {
	console.log(food_ary.length);

}
gInput.addMouseDownListener(manager);

//What happens when the mouse is up
manager.onMouseUp = function() {
	console.log("mouse up");
}
gInput.addMouseUpListener(manager);

//Called every update
manager.update = function(d) {++timer;
	if (can_move) {
		if (gInput.up && snake_ptr.dir != 'd')
			snake_ptr.dir = 'u';
		else if (gInput.right && snake_ptr.dir != 'l')
			snake_ptr.dir = 'r';
		else if (gInput.down && snake_ptr.dir != 'u')
			snake_ptr.dir = 'd';
		else if (gInput.left && snake_ptr.dir != 'r')
			snake_ptr.dir = 'l';
	}

	if (timer == timer_max && can_move) {
		can_move = false;
		move_snake();
		can_move = true;
		timer = 1;
	}
}

gInput.addLBtnFunc(handleClicks);

function handleClicks(sprite) {

	//checkSprite(pictureA, gInput.mouse.x, gInput.mouse.y);
}

gInput.addBool(65, "left");//A
gInput.addBool(68, "right");//D
gInput.addBool(83, "down");//S
gInput.addBool(87, "up");//W
gInput.addBool(37, "left");//left arrow
gInput.addBool(39, "right");// right arrow
gInput.addBool(40, "down");// down arrow
gInput.addBool(38, "up");// up arrow
gInput.addFunc(32, shift_snake, false);// spacebar
gInput.addFunc(16, back_shift_snake, false);// shift

/* since we use a grid the values should be equal */
function sprite_in_bounds(spr, x, y) {
	if (x == spr.x && y == spr.y)
		return true;
	console.log("~~false");
	return false;
}

function restart_game() {
	cleanup();
	var num_left = snake_ptr.size;
	var time_left = Math.floor(score.time/100);
	
	var tmp = new Sprite();
	world.addChild(tmp);
	tmp.count = 100;
	tmp.update = function(d) {
		score.text = "Pieces Left: "+ num_left +"      Time Taken: " + time_left;
		if (tmp.count == 0) {
			start_game();
			world.removeChild(tmp);
		} else {
			--tmp.count;
		}
	}
}


function cleanup() {
	timer = timer_max + 1;
	for (var curr = snake_ptr.tail; curr != null; ) {
		var pre = curr;
		curr = curr.prev;
		world.removeChild(pre);
	}
	// just to be safe
	snake_ptr.head = null;
	snake_ptr.tail = null;

	while (food_ary.length != 0) {
		world.removeChild(food_ary[0]);
		food_ary[0].remove();
		food_ary.splice(0, 1);
	}
}

function game_won() {
	cleanup();
	timer = timer_max + 1;
	// disables move

	var win_time = Math.floor(score.time / 100);

	var tmp_manager = new Array();
	world.addChild(tmp_manager);
	tmp_manager.count = 450;
	tmp_manager.update = function(d) {
		score.text = "Pieces Left: 0      Time Taken: " + win_time;
		if (this.count == 0) {
			while (tmp_manager.length != 0) {
				world.removeChild(tmp_manager[0]);
				tmp_manager[0].remove();
				tmp_manager.splice(0, 1);
			}
			start_game();
			world.removeChild(tmp_manager);
		} else {--tmp_manager.count;
		}
	}
	var letter_1 = new TextBox();
	// y
	letter_1.x = 100;
	letter_1.y = 300;
	letter_1.text = "Y";
	letter_1.color = '#FF0000';
	// Red
	letter_1.index = 1;
	world.addChild(letter_1);
	var letter_2 = new TextBox();
	// o
	letter_2.x = letter_1.x + letter_1.width + 4;
	letter_2.y = letter_1.y;
	letter_2.text = "O";
	letter_2.color = '#69ff00';
	// Green
	letter_2.index = 1;
	world.addChild(letter_2);
	var letter_3 = new TextBox();
	// u
	letter_3.x = letter_2.x + letter_2.width + 4;
	letter_3.y = letter_2.y;
	letter_3.text = "U";
	letter_3.color = '#0056ff';
	// Blue
	letter_3.index = 1;
	world.addChild(letter_3);
	var letter_4 = new TextBox();
	// w
	letter_4.x = letter_3.x + letter_3.width + 20;
	letter_4.y = letter_3.y;
	letter_4.text = "W";
	letter_4.index = 1;
	letter_4.color = '#ffbf00';
	// orange
	world.addChild(letter_4);
	var letter_5 = new TextBox();
	// o
	letter_5.x = letter_4.x + letter_4.width + 4;
	letter_5.y = letter_4.y;
	letter_5.text = "O";
	letter_5.color = '#b800ff';
	// purple
	letter_5.index = 1;
	world.addChild(letter_5);
	var letter_6 = new TextBox();
	// n
	letter_6.x = letter_5.x + letter_5.width + 4;
	letter_6.y = letter_5.y;
	letter_6.text = "N";
	letter_6.color = '#e5ff00';
	// yellow
	letter_6.index = 1;
	world.addChild(letter_6);
	var your_time = new TextBox();
	// You Took # Long
	your_time.x = letter_2.x + letter_2.width + 4;
	your_time.y = letter_2.y + letter_2.height;
	your_time.text = "It took you " + win_time + " long";
	your_time.color = '#FFFFFF';
	// White
	your_time.index = 1;
	world.addChild(your_time);
	var restart_msg = new TextBox();
	// You Took # Long
	restart_msg.x = letter_2.x + letter_2.width;
	restart_msg.y = your_time.y + your_time.height;
	restart_msg.text = "Game will restart soon";
	restart_msg.color = '#FFFFFF';
	// White
	restart_msg.index = 1;
	world.addChild(restart_msg);

	tmp_manager.push(letter_1);
	tmp_manager.push(letter_2);
	tmp_manager.push(letter_3);
	tmp_manager.push(letter_4);
	tmp_manager.push(letter_5);
	tmp_manager.push(letter_6);
	tmp_manager.push(your_time);
	tmp_manager.push(restart_msg);
}

//////////

function checkSprite(sprite, x, y) {
	var minX = sprite.x;
	var maxX = sprite.x + sprite.width;
	var minY = sprite.y;
	var maxY = sprite.y + sprite.height;
	var mx = x;
	var my = y;

	if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
		//console.log(gInput.mouse.x+" "+gInput.mouse.y);
		return true;
	}
	return false;
}

/* 1=red, 2=orange, 3=yellow, 4=green, 5=blue, 6=purple, 7=gray */
function get_color(clr) {
	switch (clr) {
		case 1:
			return RED;
		case 2:
			return ORANGE;
		case 3:
			return YELLOW;
		case 4:
			return GREEN;
		case 5:
			return BLUE;
		case 6:
			return PURPLE;
		case 7:
			return GRAY;
		default:
			return null;
	}
}

