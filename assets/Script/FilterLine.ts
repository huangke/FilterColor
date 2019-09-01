import Game from './Game'
import {BlockType} from "./BlockType"

const {ccclass, property} = cc._decorator;

@ccclass
export default class FilterLine extends cc.Component {
    _game: Game = null;
    _startPos: cc.Vec2 = null;

    @property
    speed: number = 80;

    type:BlockType = null;

    isMoving = false;

    init (game:Game, startNode:cc.Node) {
        this._game = game;
        this._startPos = new cc.Vec2(0, -startNode.getContentSize().height / 2);
    }

    startMove (type:BlockType){
        if (this.isMoving) {
            return;
        }
        this.node.active = true;
        this.node.position = this._startPos;
        this.isMoving = true;
        this.type = type;
    }
    
    updateLine (dt) {
        if (this.isMoving) {
            this.node.y += this.speed * dt;
            if (this.node.y >= this._game.PanelHeight / 2 + this._game.blockPanel.y) {
                this.node.active = false;
                this.node.position = this._startPos;
                this.isMoving = false;
            }
        }
    }
}
