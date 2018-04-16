var Hertz=new function(){
	 /**
	 * 把拼音转换成Hz模型
	 **/
	this.fire= function(tokens){
		var idxTokens;
		var token;
		var tokenP;
		var tokenPP;
		var tokenN;
		var i;
		var offset=0;
		token=tokens[tokens.length-1];
		for(idxTokens=0;idxTokens<tokens.length;idxTokens++){
			token=tokens[idxTokens];
			tokenP=null;
			tokenN=null;
			if(token.pinyin=="#"){
				token.hzModel=[100,100,100,100,100,100,100,100,100,100,100,100];
				offset=0;
			}else{
				if (idxTokens==0){
					tokenP=null;
				}else{
					tokenP=tokens[idxTokens-1];
					if (tokenP.pinyin=="#"){
						tokenP=null;
					}
					if(idxTokens==1){
						tokenPP=null;
					}else{
						tokenPP=tokens[idxTokens-2];
						if (tokenPP.pinyin=="#"){
							tokenPP=null;
						}
					}
				}
				if(idxTokens==tokens.length-1){
					tokenN=null;
				}else{
					tokenN=tokens[idxTokens+1];
					if (tokenN.pinyin=="#"){
						tokenN=null;
					}
				}
				
				var model=[];
				if(tokenP!=null){
					var hzModelP=this.get(token.tone+"WithP"+tokenP.tone);
					if(hzModelP==null){
						token.hzModel=null;
					}
					var hzModelN=hzModelP;
					if (tokenN!=null){
						hzModelN=this.get(token.tone+"WithN"+tokenN.tone);
					}
					
					for(i=0;i<12;i++){
						if(i<4){model.push(hzModelP[i]);}
						else{model.push(hzModelN[i]);}
					}
					
					//TODO
					var offrate=0;//token.logarithmP/2/Tokens.MAX_LOG;
					//如果和前面亲的话
					//if(tokenP.pinyin!="#"&&token.logarithmP>token.logarithmN){
					//}else{
					//	offrate=0;
					//}

					if(token.tone==4||token.tone==1){//前が高い
						if(tokenP.tone==4||tokenP.tone==3){//後が低い
							if(token.tone==4&&tokenP.tone==4){
								offset-=Tokens.MAX_HZ_CHANGED*offrate;//下げる
							}else{
								offset-=Tokens.MAX_HZ_CHANGED*offrate/10;
							}
						}else{
							offset=0;
						}
					}else if(token.tone==2||token.tone==3){
						if(tokenP.tone==2||tokenP.tone==1){
							if(token.tone==2&&tokenP.tone==2){
								offset+=Tokens.MAX_HZ_CHANGED*offrate;
							}else{
								offset+=Tokens.MAX_HZ_CHANGED*offrate/10;
							}
						}else{
							offset=0;
						}
					}else{
						offset=0;
					}
					//P　Ｎ都有的话,Ｎ｀也可能影响　ｈｚ
					if (tokenN!=null){
						offrate=(token.logarithmN)/2/Tokens.MAX_LOG;
						//如果和前面亲的话
						if(tokenN.pinyin!="#"&&token.logarithmP<token.logarithmN){
						}else{
							offrate=0;
						}
						if(token.tone==1||token.tone==2){//後が高い
							if(tokenN.tone==2||tokenN.tone==3){//前が低い
								if(token.tone==2&&tokenN.tone==2){
									offset-=Tokens.MAX_HZ_CHANGED*offrate;
								}else{
									offset-=Tokens.MAX_HZ_CHANGED*offrate/10;
								}
							}else{
								offset=0;
							}
						}else if(token.tone==4||token.tone==3){
							if(tokenN.tone==1||tokenN.tone==4){//前が低い
								if(token.tone==4&&tokenN.tone==4){
									offset+=Tokens.MAX_HZ_CHANGED*offrate;
								}else{
									offset+=Tokens.MAX_HZ_CHANGED*offrate/10;
								}
							}else{
								offset=0;
							}
						}else{
							offset=0;
						}
					}
					for(i=0;i<12;i++){
						model[i]+=offset;//TODO
						if (model[i]<80)model[i]=80;
						if (model[i]>200)model[i]=200;
					}
					
				}else if(tokenN!=null){
					model=this.get(token.tone+"WithN"+tokenN.tone);
				}else{
					model=this.get(token.tone+"Single");
				}
				token.hzModel=model;
			}
		}
		////////////////TODO
		var allhzModel=[];
		for(idxTokens=0;idxTokens<tokens.length;idxTokens++){
			tokenP=tokens[idxTokens-1];
			token=tokens[idxTokens];
			allhzModel=allhzModel.concat(token.hzModel);
		}
		for(i=1;i<allhzModel.length-1;i++){
			allhzModel[i]=(
				+allhzModel[i-1]
				+allhzModel[i]
				+allhzModel[i+1]
				)/3;
		}
		for(idxTokens=0;idxTokens<tokens.length;idxTokens++){
			token=tokens[idxTokens];
			for(i=0;i<12;i++){
				token.hzModel[i]=allhzModel[idxTokens*12+i];
			}
		}
		
		return tokens;
	};
	/**
	 * modelFlag:
	 * #,
	 * Single9,
	 * 9WithN9,
	 * 9WithP9,
	 * 
	 * 0123456
	 * 
	 **/
	this.get= function(hzModel){
		var model=null;
		var selfTone;
		var nextTone;
		var previousTone;
		if(hzModel=="#"){
		}else if (hzModel.indexOf("Single")>-1){
			selfTone=new Number(hzModel.substr(0,1));
			model=this.data["Single"][selfTone];
		}else if (hzModel.indexOf("WithN")>-1){
			selfTone=new Number(hzModel.substr(0,1));
			nextTone=new Number(hzModel.substr(6,1));
			model=this.data["WithN"][selfTone][nextTone];
		}else if (hzModel.indexOf("WithP")>-1){
			selfTone=new Number(hzModel.substr(0,1));
			previousTone=new Number(hzModel.substr(6,1));
			model=this.data["WithP"][selfTone][previousTone];
		}else {
			model=null;
		}
		if(model!=null){
			var ret=[];
			for(var i=0;i<model.length;i++){
				ret.push(model[i]);
			}
			return ret;
		}else{
			return null;
		}
	};
	this.data={
			"Single":[
[90,90,90,90,90,90,90,90,90,90,90,90],
[140,140,140,140,140,140,140,140,140,140,140,140],
[100, 98, 95, 95, 98,101,104,108,115,122,132,135],
[100,100,100,100,100, 97, 92, 86, 82, 80, 90,100],
[140,140,145,150,145,137,130,120,108, 96, 87, 80],
			],
			"WithN":[
				[//0
[90,90,90,90,90,90,90,90,90,90,100,100],
[90,90,90,90,90,90,90,90,90,90,100,110],
[90,90,90,90,90,90,90,90,90,90,100,100],
[90,90,90,90,90,90,90,90,90,90,100,110],
[90,90,90,90,90,90,90,90,90,90,100,100],
				],
				[//1
[140,140,140,140,140,140,140,140,140,138,135,130],
[140,140,140,140,140,140,140,140,140,140,140,140],
[140,140,140,140,140,140,140,140,140,138,135,130],
[140,140,140,140,140,140,140,140,140,138,135,130],
[140,140,140,140,140,140,140,140,140,140,140,140],
				],
				[//2
[100, 98, 95, 95, 98,102,104,107,111,116,122,125],
[100, 98, 95, 95,100,104,108,112,118,125,130,135],
[100, 98, 95, 95, 98,102,104,107,111,116,122,125],
[100, 98, 95, 95, 98,102,104,107,111,116,122,125],
[100, 98, 95, 95,100,104,108,112,118,125,130,135],


				],
				[//3
[100,100,100,100,100, 97, 92, 86, 82, 80, 80, 90],
[100,100,100,100,100, 97, 92, 86, 82, 80, 90,110],
[100,100,100,100,100, 97, 92, 86, 82, 80, 90,100],
[100,100,100,100,100, 97, 92, 86, 82, 80, 90,100],
[100,100,100,100,100, 97, 92, 86, 82, 80, 90,110],
				],
				[//4
[140,140,140,140,140,137,133,127,120,110,100, 90],
[140,140,140,140,140,137,133,127,120,110,102,100],
[140,140,140,140,140,137,133,127,120,110,100, 90],
[140,140,140,140,140,137,133,127,120,110,100, 90],
[140,140,145,150,145,137,133,127,120,110,102,100],
				],
			],
			"WithP":[
				[//0
[100,100,100,100,90,90,90,90,90,90,90,100],
[130,120,110,100,90,90,90,90,90,90,90,100],
[130,120,110,100,90,90,90,90,90,90,90,100],
[100,100,100,100,90,90,90,90,90,90,90,100],
[100,100,100,100,90,90,90,90,90,90,90,100],
				],
				[//1
[120,128,133,137,140,140,140,140,140,140,140,140],
[140,140,140,140,140,140,140,140,140,140,140,140],
[140,140,140,140,140,140,140,140,140,140,140,140],
[120,128,133,137,140,140,140,140,140,140,140,140],
[120,128,133,137,140,140,140,140,140,140,140,140],
				],
				[//2
[100, 98, 95, 95, 98,101,104,108,115,122,132,135],
[130,120,110,105,100,100,104,108,115,122,132,135],
[130,120,110,105,100,100,104,108,115,122,132,135],
[100, 98, 95, 95, 98,101,104,108,115,122,132,135],
[100, 98, 95, 95, 98,101,104,108,115,122,132,135],
				],
				[//3
[100,100,100,100,100, 97, 92, 86, 82, 80, 80, 90],
[130,120,110,105,100, 97, 92, 86, 82, 80, 90,100],
[130,120,110,105,100, 97, 92, 86, 82, 80, 90,100],
[100,100,100,100,100, 97, 92, 86, 82, 80, 90,100],
[100,100,100,100,100, 97, 92, 86, 82, 80, 90,100],
				],
				[//4
[120,128,133,137,145,137,130,120,108, 96, 87, 80],
[140,140,145,150,145,137,130,120,108, 96, 87, 80],
[140,140,145,150,145,137,130,120,108, 96, 87, 80],
[120,128,137,145,145,137,130,120,108, 96, 87, 80],
[120,128,137,145,145,137,130,120,108, 96, 87, 80],

				]
			]
		};
}