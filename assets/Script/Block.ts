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

    @property(cc.Label)
    score: cc.Label = null;

    _speed: number = 0;
    
    _isFall: boolean = false;
    _game: Game = null;

    _type: BlockType = BlockType.RED;

    _isFiltered: boolean = false;

    _lineIndex: number = -1;

    init (game:Game, speed:number, type:BlockType) {
        this._game = game;
        this._speed = speed;
        this._type = type;  
        this._lineIndex = -1;
        this.score.node.active = false;
        this.refreshBlockType();
    }

    refreshBlockType () {
        this.red.active = this._type === BlockType.RED;
        this.blue.active = this._type === BlockType.BLUE;
        this.green.active = this._type === BlockType.GREEN;
    }

    changgeBlockType (lineType:BlockType) {
        let type = this._type;
        do{
            type = Math.floor((Math.random()*BlockType.COUNT));
        }while(type == this._type || type == lineType);
        this._type = type;
        this.refreshBlockType();
    }

    startFall () {
        this._isFall = true;
        this._isFiltered = false;
    }

    setFiltered () {
        this._isFiltered = true;
        
        this.showScore(5);
    }

    filter (lineType:BlockType, lineIndex:number) {
        if (this._isFiltered || this._lineIndex == lineIndex) {
            return;
        }
        if (this._type === lineType) {
            this.setFiltered();
        } else {
            this.changgeBlockType(lineType);
            this._lineIndex = lineIndex;
        }
    }

    showScore (score: number) {
        this.red.active = false;
        this.blue.active = false;
        this.green.active = false;
        
        this.score.node.active = true;
        this.score.string = score.toString();
    }

    recovery () {
        this._game.recoveryBlock(this.node);
    }

    updatePos (y:number) {
        this.node.y = y;
    }
}