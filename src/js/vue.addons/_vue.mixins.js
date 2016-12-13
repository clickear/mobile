var imgProgressAry = {};

/* 编辑基础 */
var editVueMixin = {
    methods : {
        addFixSendPerson : function(){
            //抄送
            var self = this;
            var canotChoose = [];
            canotChoose.push(Global.CurrentPerson)
            sys_getSelectMultiplePerson(self.fixSendPersonArr,canotChoose,function(per){   
                self.fixSendPersonArr = per
            });
            console.log("增加抄送人");
        },

        addApplyPerson : function(){
            //审批
            var self = this;
            sys_getSelectPerson(function(per){
                if(self.fixNextPersonArr.length>=20)
                {
                    return;
                }

                if(per){
                    var l = self.fixNextPersonArr.length;
                    if(l == 0){
                        if(per[0].code == Global.CurrentPerson.code){
                            return;
                        }
                        self.fixNextPersonArr = per;
                    }else{
                        var temp = [];
                        self.fixNextPersonArr.forEach(function(row){
                            temp.push(row.code || '')
                        });

                        if(temp[l - 1] == per[0].code){
                            per.shift();
                        }
                        self.fixNextPersonArr = self.fixNextPersonArr.concat(per);
                    }

                }
            });
            console.log("增加审批人");
        },

        pickPhoto : function(){
            if(this.uploadPicArr.length >= 5){
                return
            }
            this.showPhotoPicker = true;
        },

         pickPhotoByAlbum : function(){
            var self = this;
            //第一个参数：开始 第2个参数：结束
            sys_choosePhoto(function(src){  
                if(self.uploadPicArr.length>20){
                    return;
                }
                if(src.key){
                    self.uploadPicArr.push({key:src.key});
                }
                setTimeout(function(){
                        var name = src.key;
                        var domObj = document.getElementById(src.key);
                        var pro = new PrgressBar(domObj, '1024');
                        imgProgressAry[name] = {};
                        imgProgressAry[name].status = 'start';
                        imgProgressAry[name].data = pro;

                },1);
                self.showPhotoPicker = false;
            },function(src){
                var returnValue = src[0];
                var len1 = self.uploadPicArr.length,len2;
                try{
                    if(imgProgressAry && imgProgressAry[returnValue.key] &&imgProgressAry[returnValue.key].status){
                        //change
                        imgProgressAry[returnValue.key].status = 'uploadSuccess';
                        if(imgProgressAry[returnValue.key].data){
                            imgProgressAry[returnValue.key].data.removeBar();
                        }
                            for(var i=0 ; i<len1; i++){
                                if(self.uploadPicArr[i].key == src[0].key){
                                    self.uploadPicArr.$set(i, src[0]);
                                    break;
                                }
                            }
                    }else{
                        //push 之前，张数验证
                        if(self.uploadPicArr.length>20){
                            return;
                        }
                        self.uploadPicArr.push(src[0]);
                        if(!imgProgressAry[returnValue.key]){
                            imgProgressAry[returnValue.key] = {status:'uploadSuccess'};
                        }else{
                            imgProgressAry[returnValue.key].status = 'uploadSuccess'; 
                        }
                    }
                }catch(e){

                }
            });
            this.showPhotoPicker = false
            console.log("调用相册");
        },

        pickPhotoByCamera : function(){
            var self = this;
            sys_takePhoto(function(src){
                if(self.uploadPicArr.length>20){
                    return;
                }
               if(src.key){
                    self.uploadPicArr.push({key:src.key});
                }
                setTimeout(function(){
                        var name = src.key;
                        var domObj = document.getElementById(src.key);
                        var pro = new PrgressBar(domObj, '1024');
                        imgProgressAry[name] = {};
                        imgProgressAry[name].status = 'start';
                        imgProgressAry[name].data = pro;
                },1);
            },function(src){
                var returnValue = src[0];
                var len1 = self.uploadPicArr.length,len2;
                try{
                    if(imgProgressAry && imgProgressAry[returnValue.key] &&imgProgressAry[returnValue.key].status){
                        //change
                        imgProgressAry[returnValue.key].status = 'uploadSuccess';
                        if(imgProgressAry[returnValue.key].data){
                            imgProgressAry[returnValue.key].data.removeBar();
                        }
                        for(var i=0 ; i<len1; i++){
                            if(self.uploadPicArr[i].key == src[0].key){
                                self.uploadPicArr.$set(i, src[0]);
                                break;
                            }
                        }
                    }else{
                        //push 之前，张数验证
                        if(self.uploadPicArr.length>20){
                            return;
                        }
                        self.uploadPicArr.push(src[0]);
                        if(!imgProgressAry[returnValue.key]){
                            imgProgressAry[returnValue.key] = {status:'uploadSuccess'};
                        }else{
                            imgProgressAry[returnValue.key].status = 'uploadSuccess'; 
                        }
                    }
                 
                }catch(e){

                }


            });
            console.log("调用相机");
            this.showPhotoPicker = false;
        },

        // 上传语音
        uploadSound : function(){
            var self = this;
            if(this.uploadSoundArr.length < 2){
                console.log('调用录音');
                sys_record(function(data){
                    // self.uploadSoundArr.push(src);
                    self.uploadSoundArr = data;
                });
            }else{
                console.log('最多只能上传1个语音')
            }
        },

        submit : function(){
            if(!this.allowSubmit){
                return;
            }
            console.log('提交数据')
            if(this.hasLinkBill){
                sys_formfirstcommit(this.hasLinkBill);
            }else{
                 sys_formfirstcommit();
            }
        },

        //显示提示弹框
        showMassegePop : function(){
            this.$refs.showmsg.shows();
        },
        showCheckPop : function(){
            this.$refs.showcheck.popShow();
        },
        getAvatarSrc : function(code){
            return becomeAvatarSrc(code);
        }
    }
}

/* 详情基础 */
var detailVueMixin = {
    methods : {
        lookPerson : function(code){
            lookPersonInfo(code)
        },
        cancelStep : function(){
            if(this.step > 0){
                try{
                    sys_recycle();
                }catch(e){

                }
                return this.step = 0;
            }
            sys_closeActivity();
        },
        // 提交人操作表单
        receiptModify : function(){
            if(this.FlowState == 5){
                // 已被拒绝，修改表单
                console.log('提交人修改表单')
                sys_formChangeSubmit();
            }else{
                // 撤销表单
                console.log('提交人撤销表单')
                sys_formFlowRemove();
            }
        },
        // 跳转审批
        gotoApproval : function(type){
            if(this.Enable == 0){
                return;
            }
            this.sRemark = '';
            if(type == 'agree'){
                this.submitApprovalState = 1;
                return this.step = 1;
            }
            if(type == 'reject'){
                this.submitApprovalState = 2;
                return this.step = 2;
            }
        },
        // 提交审批
        doApproval : function(){
            console.log(this.sRemark)
            // 审批提交的ApprovalState字段 通过 submitApprovalState获取
            console.log('提交确认')
            sys_approval();
        },
        // 上传语音
        uploadSound : function(){
            var self = this;
            sys_record(function(data){
                self.approverUploadSound = data;
            });
           /* if(this.uploadSoundArr.length < 3){
                console.log('调用录音')
                sys_record(function(src){
                    self.uploadSoundArr.push(src);
                });
            }else{
                console.log('最多只能上传2个语音')
            }*/
        },

        // 添加抄送
        addFixSendPerson:function(){
            var self = this;
            var canotChoose = [];
            canotChoose.push(Global.CurrentPerson)
            sys_getSelectMultiplePerson(self.fixSendPersonArr,canotChoose,function(per){   
                sys_setConfirmPop("确认要抄送此单据？",function(){
                    self.fixSendPersonArr = per;
                    sys_AddSendPersons(self.fixSendPersonArr);
                })

            });
            console.log("增加抄送人");
        },

        //跳转到删除抄送页面
        gotoDelSendPerson : function(){
            this.delSendPersonArr = this.fixSendPersonArr.concat([]);
            this.step = 3;
        },

        //确定删除抄送人
        setFixSendPerson : function(){
            var self = this;
            sys_setConfirmPop("删除后这些人将无法查阅此条单据，确认删除？",function(){
                var arr = self.fixSendPersonArr.concat([]);
                var del = self.delSendPersonArr.concat([]);
                var len = arr.length;
                for(var i = 0; i < len; i ++){
                    for(var j = 0, n = del.length; j < n; j ++){
                        if(arr[i] == del[j]){
                            arr.splice(i, 1);
                        }
                    }
                }
                self.fixSendPersonArr = self.delSendPersonArr.concat([]);
                self.delSendPersonArr = arr.concat([]);
                sys_DeleteSendPersons(self.delSendPersonArr);
                self.step = 0;
            })
        },

        // 审批添加抄送
        addApproverSend:function(){
            console.log('添加审批抄送')
             var self = this;
            var canotChoose = [];
            canotChoose.push(Global.CurrentPerson)
            sys_getSelectMultiplePerson(self.approverSendPerson,canotChoose,function(per){   
                self.approverSendPerson = per
            });   
        },
        // 审批添加加审
        addApproverNext : function(){
            console.log('添加审批加审')
            var self = this;
            sys_getSelectPerson(function(per){
                if(self.approverNextPerson.length>=20){
                    return;
                }
                if(per){
                    if(self.approverNextPerson.length == 0){
                        if(per[0].code == Global.CurrentPerson.code){
                            return;
                        }
                        self.approverNextPerson = per;
                    }else{
                        var temp = [];
                        self.approverNextPerson.forEach(function(row){
                            temp.push(row.code || '')
                        });
                        for(var i=0, len=per.length; i<len; i++){
                            if(per[i].code){
                                if(temp.indexOf(per[i].code) == -1){
                                    self.approverNextPerson.push(per[i]);
                                }
                            }else{
                                self.approverNextPerson.push(per[i]);
                            }
                        }
                    }

                }
            });
        },
        // 跳转催审
        /*gotoReminder : function(data){
            this.step = 4;
            this.sReminderId  = data.approverId;
            this.sReminderName = data.approverName;
        },*/
        // 提交催审
        submitReminder : function(){
            console.log('点击提交催审');
            console.log(this.LPerson, this.LSendType, this.SContent )
        },
        getAvatarSrc : function(code){
            return becomeAvatarSrc(code);
        },
        //toggle 统计列表
        toggleStatic : function(){
            if(this.closeStatic){
                this.closeStatic = false;
            }else{
                this.closeStatic = true;
            }
        },
        //显示提示弹框
        showMassegePop : function(){
            this.$refs.showmsg.shows();
        },
        showCheckPop : function(){
            this.$refs.showcheck.popShow();
        }
    }
};