import BlockLine from "./BlockLine"
import Game from "./Game"
import { BlockType } from "./BlockType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpawnManager extends cc.Component {
    @property(cc.Node)
    blockNode: cc.Node = null;
    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;

    @property
    blockSpeed: number = 500;
    @property
    blockSize: number = 80;
    
    _blockPalenWeight: number = 480;
    _blockPanelHeight: number = 0;
    _blockPool: cc.NodePool = null;

    _blockLineArray: Array<BlockLine> = [];
    _topBlockLine: BlockLine = null;

    _game: Game = null;

    start () {
        this._blockPool = new cc.NodePool();
    }

    init (game:Game, blockPanelHeight:number) {
        this._game = game;
        this._blockPanelHeight = blockPanelHeight;
    }

    instantiateBlock(bl:BlockLine, pos:cc.Vec2) {
		let block = null
		if (this._blockPool && this._blockPool.size() > 0) {
			block = this._blockPool.get();
		} else {
			block = cc.instantiate(this.blockPrefab);
		}
        block.parent = this.blockNode;
        block.position = pos;
        let blockComponent = block.getComponent("Block");
        blockComponent.init(this, this.blockSpeed, this.getBlockType());
        blockComponent.startFall();
        bl.pushBlock(blockComponent);
		return block;
    }
    //random block type
    getBlockType ():BlockType {
        let type = Math.floor((Math.random()*BlockType.COUNT));
        return type;
    }

    spawnBlocks () {
        let topBlockHeight = 0;
        //if have topBlockLine, add new line above it
        if (!this._topBlockLine) {
            topBlockHeight = this._blockPanelHeight / 2 + this.blockSize / 2;
        } else {
            topBlockHeight = this._topBlockLine.Height + this.blockSize;
        }
        this._topBlockLine = new BlockLine(this._game, this.blockSpeed, topBlockHeight, this._blockPanelHeight, this.blockSize);
        this._blockLineArray.push(this._topBlockLine);

        for (let i = 0; i < this._blockPalenWeight / this.blockSize; i++) {
            let block = this.instantiateBlock(this._topBlockLine, 
                new cc.Vec2(-this._blockPalenWeight / 2 + this.blockSize * i + this.blockSize / 2, this._topBlockLine.Height));
        }
    }

    updatePos (dt: number) {
        //update each block line height
        for (let i = this._blockLineArray.length - 1; i >= 0; i--) {
            if (!this._blockLineArray[i].updatePos(dt)) {
                return false;
            }
        }
        return true;
    }

    updateSpawnBlock () {
        //spawn new block line
        if (this._topBlockLine && this._topBlockLine.Height <= this._blockPanelHeight / 2) {
            this.spawnBlocks();
        }
    }

    clearBlockLine () {
        this._blockLineArray.forEach(blockLine => {
            blockLine.recoveryBlock();
        });
        this._blockLineArray = [];
    }

    recoveryBlock (block:cc.Node) {
        this._blockPool.put(block);
    }
}
