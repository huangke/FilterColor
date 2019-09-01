import BlockLine from "./BlockLine"
import FilterLine from "./FilterLine"
import { BlockType } from "./BlockType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    blockPanel: cc.Node = null;

    @property
    blockSpeed: number = 500;

    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    filterLinePrefab: cc.Prefab = null;

    @property(cc.Node)
    filterLineStartNode: cc.Node = null;

    @property
    blockSize: number = 0;

    _filterLine: FilterLine = null;

    _blockPanelHeight: number = 0;
    _blockPalenWeight: number = 600;
    _blockPool: cc.NodePool = null;
    
    _startFall: boolean = false;

    _blockLineArray: Array<BlockLine> = [];
    _topBlockLine: BlockLine = null;

    get PanelHeight ()
    {
        return this._blockPanelHeight;
    }

    start () {
        this._blockPool = new cc.NodePool();
        this.createFilterLine();
        setTimeout(() => {
            this._blockPanelHeight = this.blockPanel.height;
            cc.log("_blockPanelHeight " + this._blockPanelHeight);
            this.spawnBlocks();
        }, 100);
    }

    createFilterLine () {
        let line = cc.instantiate(this.filterLinePrefab);
        this._filterLine = line.getComponent("FilterLine");
        this._filterLine.init(this, this.blockPanel);
        line.parent = this.blockPanel;
    }

    instantiateBlock(bl:BlockLine, pos:cc.Vec2) {
		let block = null
		if (this._blockPool && this._blockPool.size() > 0) {
			block = this._blockPool.get();
		} else {
			block = cc.instantiate(this.blockPrefab)
		}
        block.parent = this.blockPanel;
        block.position = pos;
        let blockComponent = block.getComponent("Block");
        blockComponent.init(this, this.blockSpeed, this.getBlockType());
        blockComponent.startFall();
        bl.pushBlock(blockComponent);
		return block;
    }

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
        this._topBlockLine = new BlockLine(this, this.blockSpeed, topBlockHeight, this._blockPanelHeight, this.blockSize);
        this._blockLineArray.push(this._topBlockLine);

        for (let i = 0; i < this._blockPalenWeight / this.blockSize; i++) {
            let block = this.instantiateBlock(this._topBlockLine, 
                new cc.Vec2(-this._blockPalenWeight / 2 + this.blockSize * i + this.blockSize / 2, this._topBlockLine.Height));
        }

        this._startFall = true;
    }

    update (dt:number) {
        if (this._startFall) {
            
            this._filterLine.updateLine(dt);

            //update each block line height
            for (let i = this._blockLineArray.length - 1; i >= 0; i--) {
                if (!this._blockLineArray[i].updateHeight(dt)) {
                    this._blockLineArray.splice(i , 1);
                }
            }
            //spawn new block line
            if (this._topBlockLine && this._topBlockLine.Height <= this._blockPanelHeight / 2) {
                this.spawnBlocks();
            }
        }
    }

    recoveryBlock (block:cc.Node) {
        this._blockPool.put(block);
    }
}
