const {ccclass, property} = cc._decorator;

@ccclass
export default class FilterBlock extends cc.Component {
    test(tt=1){
    let item = [];
    const itemm = [];
    const args = Array.prototype.slice.call(arguments);
    item = [...args];
    }
}