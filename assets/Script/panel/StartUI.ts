import Game from "../Game"
const {ccclass, property} = cc._decorator;

@ccclass
export default class StartUI extends cc.Component {

    @property(Game)
    game: Game = null;

    show () {
        this.node.active = true;
    }

    onTouch () {
        this.node.active = false;
        this.game.startGame();
    }
}
