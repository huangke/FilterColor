import BlockLine from "./BlockLine"

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    blockPanel: cc.Node = null;

    @property
    blockSpeed: number = 500;

    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;

    @property
    blockSize: number = 0;

    @property(cc.Node)
    filterLine: cc.Node = null;

    _blockPanelHeight: number = 0;
    _blockPalenWeight: number = 600;
    _blockPool: cc.NodePool = null;
    
    _startFall: boolean = false;

    _blockLineArray: Array<BlockLine> = [];
    _topBlockLine: BlockLine = null;

    start () {
        this._blockPool = new cc.NodePool();

        setTimeout(() => {
            this._blockPanelHeight = this.blockPanel.height;
            cc.log("_blockPanelHeight " + this._blockPanelHeight);
            // this.spawnBlocks();
        }, 100);
    }

    instantiateBlock(bl:BlockLine) {
		let block = null
		if (this._blockPool && this._blockPool.size() > 0) {
			block = this._blockPool.get();
		} else {
			block = cc.instantiate(this.blockPrefab)
		}
        block.parent = this.blockPanel;
        let blockComponent = block.getComponent("Block");
        blockComponent.init(this, this.blockSpeed);
        blockComponent.startFall();
        bl.pushBlock(blockComponent);
		return block;
    }

    spawnBlocks () {
        let topBlockHeight = 0;
        //if have topBlockLine, add new line above it
        if (!this._topBlockLine) {
            topBlockHeight = this._blockPanelHeight / 2 + this.blockSize / 2;
        } else {
            topBlockHeight = this._topBlockLine.Height + this.blockSize;
        }
        this._topBlockLine = new BlockLine(this.blockSpeed, topBlockHeight, this._blockPanelHeight, this.blockSize);
        this._blockLineArray.push(this._topBlockLine);

        for (let i = 0; i < this._blockPalenWeight / this.blockSize; i++) {
            let block = this.instantiateBlock(this._topBlockLine);
            block.x = -this._blockPalenWeight / 2 + this.blockSize * i + this.blockSize / 2;
            block.y = this._topBlockLine.Height;
        }

        this._startFall = true;
    }

    update (dt:number) {
        if (this._startFall) {
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
