import Game from "./Game"
import {BlockType} from "./BlockType"
const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectButton extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(Game)
    game: Game = null;

    @property
    type: BlockType = BlockType.BLUE;

    onTouch () {
        if (cc.debug) {
            cc.log("touch " + ["RED", "BLUE", "GREEN"][this.type]);
        }
        this.game._filterLine.startMove(this.type);
    }
}
