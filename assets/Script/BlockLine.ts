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

    constructor (speed:number, height: number, _blockPanelHeight: number, blockSize: number) {
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

        this._blocks.forEach(block => {
            block.node.y = this._height;
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