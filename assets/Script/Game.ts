import BlockLine from "./BlockLine"
import FilterLine from "./FilterLine"
import { BlockType } from "./BlockType";

import StartUI from "./panel/StartUI"

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    blockPanel: cc.Node = null;
    @property(cc.Node)
    blockNode: cc.Node = null;
    @property(cc.Node)
    fliterLineNode: cc.Node = null;

    @property
    blockSpeed: number = 500;

    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    filterLinePrefab: cc.Prefab = null;

    @property
    blockSize: number = 0;

    //------------ UI -------------
    @property(StartUI)
    startUI: StartUI = null;

    _filterLine: FilterLine = null;

    _blockPanelHeight: number = 0;
    _blockPalenWeight: number = 480;
    _blockPool: cc.NodePool = null;
    
    _gameRunning: boolean = false;

    _blockLineArray: Array<BlockLine> = [];
    _topBlockLine: BlockLine = null;

    get PanelHeight () {
        return this._blockPanelHeight;
    }

    onLoad () {
        this._blockPanelHeight = this.blockPanel.height;
        cc.log("_blockPanelHeight " + this._blockPanelHeight);
    }

    start () {
        this._blockPool = new cc.NodePool();
    }

    createFilterLine () {
        if (!this._filterLine) {
            let line = cc.instantiate(this.filterLinePrefab);
            this._filterLine = line.getComponent("FilterLine");
            this._filterLine.init(this, this.blockPanel);
            line.parent = this.fliterLineNode;
        } else {
            this._filterLine.resetPos();
        }
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
        this._topBlockLine = new BlockLine(this, this.blockSpeed, topBlockHeight, this._blockPanelHeight, this.blockSize);
        this._blockLineArray.push(this._topBlockLine);

        for (let i = 0; i < this._blockPalenWeight / this.blockSize; i++) {
            let block = this.instantiateBlock(this._topBlockLine, 
                new cc.Vec2(-this._blockPalenWeight / 2 + this.blockSize * i + this.blockSize / 2, this._topBlockLine.Height));
        }
    }

    update (dt:number) {
        if (this._gameRunning) {
            
            this._filterLine.updateLine(dt);

            //update each block line height
            for (let i = this._blockLineArray.length - 1; i >= 0; i--) {
                if (!this._blockLineArray[i].updatePos(dt)) {
                    this._gameRunning = false;
                    break;
                }
            }
            if (!this._gameRunning) {
                this.showStartUI();
                return;
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

    startGame () {
        this._blockLineArray.forEach(blockLine => {
            blockLine.recoveryBlock();
        });
        this._blockLineArray = [];

        this.createFilterLine();
        this.spawnBlocks();
        this._gameRunning = true;
    }

    showStartUI () {
        this.startUI.show();
    }
}
