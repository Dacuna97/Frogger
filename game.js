// Especifica lo que se debe pintar al cargar el juego




var playGame = function () {
  var board = new GameBoard();
  board.add(new Gamefield());
  Game.setBoard(0, board);
  board = new GameBoard();
  board.add(new PlayerFrog());
  board.add(new Provider());
  board.add(new Water());
  board.add(new Home());
  Game.setBoard(1, board); 
  Game.setBoard(3, new TitleScreen('',''));
  Game.setBoard(4, new TitleScreen('',''));
}

var winGame = function () {
  Game.setBoard(3, new TitleScreen("You win!",
    "Press fire to play again",
    playGame));

};
var startGame = function () {
  var board = new GameBoard()
  board.add(new Init());
  board.add(new Gamefield());
  Game.setBoard(3, board);
  Game.setBoard(4, new TitleScreen("Welcome!",
    "Press fire to play ",
    playGame));

};



var loseGame = function () {
  Game.setBoard(3, new TitleScreen("You lose!",
    "Press fire to play again",
    playGame));
};


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function () {
  Game.initialize("game", sprites, startGame);
});