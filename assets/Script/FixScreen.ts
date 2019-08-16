
const {ccclass, property} = cc._decorator;

@ccclass
export default class FixScreen extends cc.Component {
    curDR: cc.Size
    setCanvasSize(){
        var Canvas = this.node.getComponent(cc.Canvas)
        var pixelRatio = cc.sys.windowPixelResolution.height/cc.sys.windowPixelResolution.width
        var targetRatio = 1136/768//设计分辨率
        cc.log("Canvas.height " + cc.sys.windowPixelResolution.height);
        cc.log("Canvas.width " + cc.sys.windowPixelResolution.width);
        if (cc.sys.isBrowser || pixelRatio <= targetRatio){
            Canvas.fitHeight = true
            Canvas.fitWidth = false
            cc.log("Canvas.fitHeight");
        }
        else{
            Canvas.fitHeight = true
            Canvas.fitWidth = true
            cc.log("Canvas.fitWidth");
        }
    }
    start () {
        // this.setCanvasSize()
        this.resize()
    }
    resize() {
        var cvs = cc.find('Canvas').getComponent(cc.Canvas);
        //保存原始设计分辨率，供屏幕大小变化时使用
        if(!this.curDR){
            this.curDR = cvs.designResolution;
        }
        var dr = this.curDR;
        var s = cc.view.getFrameSize();
        var rw = s.width;
        var rh = s.height;
        var finalW = rw;
        var finalH = rh;
    
        if((rw/rh) > (dr.width / dr.height)){
            //!#zh: 是否优先将设计分辨率高度撑满视图高度。 */
            //cvs.fitHeight = true;
            
            //如果更长，则用定高
            finalH = dr.height;
            finalW = finalH * rw/rh;
        }
        else{
            /*!#zh: 是否优先将设计分辨率宽度撑满视图宽度。 */
            //cvs.fitWidth = true;
            //如果更短，则用定宽
            finalW = dr.width;
            finalH = rh/rw * finalW;
        }
        cvs.designResolution = cc.size(finalW, finalH);
        cvs.node.width = finalW;
        cvs.node.height = finalH;
        cvs.node.emit('resize');

        cc.log("new width " + finalW);
        cc.log("new height " + finalH);
    }
}
