import Game from "./Game"
import {BlockType} from "./BlockType"

const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component{
    @property(cc.Label)
    des: cc.Label = null;
    _speed: number = 0;
    
    _isFall: boolean = false;
    _game: Game = null;

    _type: BlockType = BlockType.RED;

    _isDestroy: boolean = false;

    init (game:Game, speed:number, type:BlockType) {
        this._game = game;
        this._speed = speed;
        this._type = type;
        this.des.string = type.toString();
    }

    startFall () {
        this._isFall = true;
        this._isDestroy = false;
    }

    recoverySelf () {
        this._isDestroy = true;
        this._game.recoveryBlock(this.node);
    }

    filter (lineType:BlockType) {
        if (this._type === lineType) {
            this.recoverySelf();
        }
    }

    tryToRecovery () {
        if (!this._isDestroy) {
            this.recoverySelf();
        }
    }

    updatePos (y:number) {
        if (!this._isDestroy) {
            this.node.y = y;
        }
    }
}