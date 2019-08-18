import Game from './Game'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Line extends cc.Component {

    @property(cc.Node)
    startNode: cc.Node = null;

    @property(Game)
    game: Game = null;

    @property
    speed: number = 80;

    isMoving = false;

    onLoad () {
        this.node.position = this.startNode.position;
    }

    startMove (){
        this.isMoving = true;
    }
    
    updateLine (dt) {
        if (this.isMoving) {
            this.node.y += this.speed * dt;
            if (this.node.y >= this.game.PanelHeight / 2 + this.game.blockPanel.y) {
                this.node.y = this.startNode.y;
                this.isMoving = false;
            }
        }
    }
}
