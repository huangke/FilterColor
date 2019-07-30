import Game from "./Game"

const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component{
    @property(cc.Label)
    des: cc.Label = null;
    _speed: number = 0;
    
    _isFall: boolean = false;
    _game: Game = null;

    init (game:Game, speed:number) {
        this._game = game;
        this._speed = speed;
    }

    startFall () {
        this._isFall = true;
    }

    recoverySelf () {
        this._game.recoveryBlock(this.node);
    }
}