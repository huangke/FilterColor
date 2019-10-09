import BlockLine from "./BlockLine"
import FilterLine from "./FilterLine"
import SpawnManager from "./SpawnManager"

import StartUI from "./panel/StartUI"

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Node)
    blockPanel: cc.Node = null;
    @property(cc.Node)
    fliterLineNode: cc.Node = null;

    @property(cc.Prefab)
    filterLinePrefab: cc.Prefab = null;

    @property(SpawnManager)
    spawnMan: SpawnManager = null;

    _blockPanelHeight: number = 0;
    //------------ UI -------------
    @property(StartUI)
    startUI: StartUI = null;

    _filterLine: FilterLine = null;
    _gameRunning: boolean = false;

    get PanelHeight () {
        return this._blockPanelHeight;
    }

    start () {
        this.showStartUI();
        this._blockPanelHeight = this.blockPanel.height;
        cc.log("_blockPanelHeight " + this._blockPanelHeight);
        this.spawnMan.init(this, this._blockPanelHeight);
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

    update (dt:number) {
        if (this._gameRunning) {
            
            this._filterLine.updateLine(dt);

            this._gameRunning = this.spawnMan.updatePos(dt);

            if (!this._gameRunning) {
                this.showStartUI();
                return;
            }
            
            this.spawnMan.updateSpawnBlock();
        }
    }

    recoveryBlock (block:cc.Node) {
        this.spawnMan.recoveryBlock(block);
    }

    startGame () {
        this.spawnMan.clearBlockLine();
        this.createFilterLine();
        this.spawnMan.spawnBlocks();
        this._gameRunning = true;
    }

    showStartUI () {
        this.startUI.show();
    }
}
