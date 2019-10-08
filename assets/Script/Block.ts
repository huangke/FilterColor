import Game from "./Game"
import {BlockType} from "./BlockType"

const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component{
    @property(cc.Node)
    red: cc.Node = null;
    @property(cc.Node)
    blue: cc.Node = null;
    @property(cc.Node)
    green: cc.Node = null;

    _speed: number = 0;
    
    _isFall: boolean = false;
    _game: Game = null;

    _type: BlockType = BlockType.RED;

    _isDestroy: boolean = false;

    _lineIndex:number = -1;

    init (game:Game, speed:number, type:BlockType) {
        this._game = game;
        this._speed = speed;
        this._type = type;  
        this._lineIndex = -1;
        this.refreshBlockType();
    }

    refreshBlockType () {
        this.red.active = this._type === BlockType.RED;
        this.blue.active = this._type === BlockType.BLUE;
        this.green.active = this._type === BlockType.GREEN;
    }

    changgeBlockType () {
        let type = this._type;
        do{
            type = Math.floor((Math.random()*BlockType.COUNT));
        }while(type == this._type);
        this._type = type;
        this.refreshBlockType();
    }

    startFall () {
        this._isFall = true;
        this._isDestroy = false;
    }

    recoverySelf () {
        this._isDestroy = true;
        this._game.recoveryBlock(this.node);
    }

    filter (lineType:BlockType, lineIndex:number) {
        if (this._isDestroy || this._lineIndex == lineIndex) {
            return;
        }
        
        if (this._type === lineType) {
            this.recoverySelf();
        } else {
            this.changgeBlockType();
            this._lineIndex = lineIndex;
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