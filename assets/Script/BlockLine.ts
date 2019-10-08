import Game from "./Game"
import Block from "./Block"

export default class BlockLine {

    private _blocks: Array<Block> = [];

    private _speed: number = 0;

    private _height: number = 0;

    get Height() {
        return this._height;
    }

    private _blockSize: number = 0;
    private _blockPanelHeight: number = 0;

    private _game: Game = null;

    constructor (game:Game, speed:number, height: number, _blockPanelHeight: number, blockSize: number) {
        this._game = game;
        this._speed = speed;
        this._height = height;
        this._blockPanelHeight = _blockPanelHeight;
        this._blockSize = blockSize;
    }

    pushBlock (block:Block){
        this._blocks.push(block);
    }

    updateHeight (dt:number): boolean{
        this._height -= this._speed * dt;
        let filterLine = this._game._filterLine;
        if (filterLine.isMoving) {
            let filterLinePos = filterLine.node.y;
            if (this._height <= filterLinePos && 
                this._height + this._blockSize >= filterLinePos) {
                this._blocks.forEach(block => {
                    block.filter(filterLine.type, filterLine.LineIndex);
                });
            }
        }

        for (let i = this._blocks.length - 1; i >= 0; i--) {
            if (this._blocks[i]._isDestroy) {
                this._blocks.splice(i , 1);
            }
        }
        this._blocks.forEach(block => {
            block.updatePos(this._height);
        });

        if (this._height - this._blockSize / 2 < -this._blockPanelHeight / 2) {
            this._blocks.forEach(block => {
                block.recoverySelf();
            });
            this._blocks = [];
            return false;
        }
        return true;
    }
}