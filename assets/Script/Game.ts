const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    blockPanel: cc.Node = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;

    @property
    blockSize: number = 0;

    _blockPanelHeight: number = 0;
    _blockPool: cc.NodePool = null;
    
    start () {
        this._blockPool = new cc.NodePool();

        setTimeout(() => {
            this._blockPanelHeight = this.blockPanel.height;
            this.spawnBlock();
        }, 100);
    }

    instantiateBlock() {
		let block = null
		if (this._blockPool && this._blockPool.size() > 0) {
			block = this._blockPool.get();
		} else {
			block = cc.instantiate(this.blockPrefab)
		}
		block.parent = this.blockPanel;
		return block
    }

    spawnBlock () {
        let blockHeightCount = Math.ceil(this._blockPanelHeight / this.blockSize);
        cc.log("blockHeightCount %d",blockHeightCount);
        for (let i = 0; i < blockHeightCount; i++) {
            let block = this.instantiateBlock();
            block.y = -this._blockPanelHeight / 2 + this.blockSize * i + this.blockSize / 2;
        }
        for (let i = 0; i < 600 / 100; i++) {
            let block = this.instantiateBlock();
            block.x = -600 / 2 + this.blockSize * i + this.blockSize / 2;
        }
    }
}
