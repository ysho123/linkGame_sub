cc.Class({
    extends: cc.Component,

    properties: {
        userInfoPrefab : cc.Prefab,
        contendNode : cc.Node,
        awardSprite1 : {
            default : null,
            type : cc.SpriteFrame
        },
        awardSprite2 : {
            default : null,
            type : cc.SpriteFrame
        },
        awardSprite3 : {
            default : null,
            type : cc.SpriteFrame
        }

    },

    // use this for initialization
    onLoad: function () {
        // let ratio = wx.getSystemInfoSync().pixelRatio;
        // let width = wx.getSystemInfoSync().screenWidth
        // let height = wx.getSystemInfoSync().screenHeight
        let model = wx.getSystemInfoSync().model;

        // this.node.scaleX  = ratio;

        if(model == 'iPhone X'){
            this.node.getComponent(cc.Canvas).fitWidth = true;
            this.node.getComponent(cc.Canvas).designResolution = cc.size(710,1550);
        }
    },

    // called every frame
    update: function (dt) {

    },

    onEnable(){
        wx.getFriendCloudStorage({
            keyList : ['score'],
            success : (res)=>{
                if( res.data.length == 0 ){
                    let labelNode = new cc.Node('noData');
                    let label = labelNode.addComponent(cc.Label);
                    label.string = '还没有好友挑战过哟~'
                    return;
                }

                this.contendNode.height = 500 + 175 * res.data.length; //随人数增加而增加滑动距离
                this.sortArr(res.data).forEach((item,key)=>{
                    let newNode = cc.instantiate(this.userInfoPrefab);

                    if( key <= 2 ){
                        let sp = newNode.getChildByName('award').addComponent(cc.Sprite);
                        let index = key + 1 ;
                        sp.spriteFrame = this['awardSprite' + index]
                    }else{
                        let label = newNode.getChildByName('award').addComponent(cc.Label);
                        label.string = (key+1).toString();
                    }

                    //加载头像
                    cc.loader.load({url : item.avatarUrl, type : 'jpg'} , function(err, texture){
                        newNode.getChildByName('avatar').getComponent('cc.Sprite').spriteFrame = new cc.SpriteFrame(texture);
                    });

                    newNode.getChildByName('name').getComponent('cc.Label').string = item.nickname ; //昵称
                    newNode.getChildByName('score').getComponent('cc.Label').string = item.KVDataList[0].value + '关'; //分数

                    this.contendNode.addChild(newNode);
                });
            }
        });
    },

    sortArr(arr){
        for(let j=0;j<arr.length;j++){//最多需要比较arr.length-1次
            for(let i=arr.length-1;i>0;i--){
                let compareNum1 = parseInt(arr[i].KVDataList[0].value);
                let compareNum2 = parseInt(arr[i-1].KVDataList[0].value);
                if( compareNum1 > compareNum2 ){
                    let temp = arr[i];
                    arr[i] = arr[i-1];
                    arr[i-1] = temp;
                }
            }
        }
        return arr;
    }
});
