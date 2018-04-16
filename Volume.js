var Volume=new function(){
	/**
	 * toneType:0 连续,1 摩擦, 2 爆破
	 **/
	///////////////////////////////////////////////////////////////////////
	/**
	 * 把拼音转换成Vl模型
	 **/
	this.fire= function(tokens){
		var idxTokens;
		var token;
		var tokenP;
		var tokenN;
		var i;
		for(idxTokens=0;idxTokens<tokens.length;idxTokens++){
			token=tokens[idxTokens];
			if(token.pinyin=="#"){
				token.vlModel=[0,0,0,0,0,0,0,0,0,0,0,0];
			}else{
				var toneType;
				if (token.initial!=""){//如果有声母部分 z c s 等
					toneType=1;
					if(token.tone==0)toneType=4;
				}else if (
					token.head.length==1			//a o e i u v
					||token.head.indexOf("l")>-1
					||token.head.indexOf("m")>-1
					||token.head.indexOf("n")>-1
					||token.head.indexOf("r")>-1
				){
					toneType=0;
					if(token.tone==0)toneType=3;
				}else{
					toneType=2;
					if(token.tone==0)toneType=5;
				}
				tokenP=null;
				tokenN=null;
				if (idxTokens==0){
					tokenP=null;
				}else{
					tokenP=tokens[idxTokens-1];
					if (tokenP.pinyin=="#"){
						tokenP=null;
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
				var model=this.get(toneType,token.tone);
				for(i=1;i<model.length-1;i++){
					model[i]=model[i]*token.volume;//把音高加入模型
				}
				if(tokenP!=null){
					var offrate=token.logarithmP/Tokens.MAX_LOG;
					var modelP=tokenP.vlModel;
					if(modelP!=null){
						model[0]=modelP[modelP.length-1];
					}
					for(i=1;i<model.length-1;i++){
						model[i]=(model[i-1]*offrate+model[i]+model[i+1]*offrate)/(1+offrate*2);
					}
				}else{
					model[0]=0;//model[1]=model[1]*0.666;
				}
				token.vlModel=model;
				//如果一个声音和前后的关系紧密,前后声音就高一些.
				token.vlModel[0]=token.vlModel[0]*token.logarithmP/Tokens.MAX_LOG;
				token.vlModel[11]=token.vlModel[11]*token.logarithmN/Tokens.MAX_LOG;
			}
		}
		for(idxTokens=0;idxTokens<tokens.length;idxTokens++){
			tokenP=tokens[idxTokens-1];
			token=tokens[idxTokens];
			if (token.vlModel!=null){
				if (tokenP!=null){
					token.vlModel[0]=(tokenP.vlModel[tokenP.vlModel.length-2]+token.vlModel[0]+token.vlModel[1])/3;
					tokenP.vlModel[tokenP.vlModel.length-1]=token.vlModel[0];
				}
				if(token.initial==""){
					for(i=1;i<token.vlModel.length-1;i++){
						token.vlModel[i]=(token.vlModel[i-1]+token.vlModel[i]+token.vlModel[i+1])/3;
					}
				}else{
					for(i=1;i<4;i++){
						token.vlModel[i]=(token.vlModel[i-1]+token.vlModel[i]+token.vlModel[i+1])/3;
					}
				}
			}
		}
		//声音的整体高度调整
		var allvlModel=[];
		for(idxTokens=0;idxTokens<tokens.length;idxTokens++){
			tokenP=tokens[idxTokens-1];
			token=tokens[idxTokens];
			
			if (tokenP==null){//如果前面是空白,音量为零
				token.vlModel[0]=0;
			}
			allvlModel=allvlModel.concat(token.vlModel);
		}
		for(i=1;i<allvlModel.length-1;i++){
			allvlModel[i]=(
				+allvlModel[i-1]
				+allvlModel[i]
				+allvlModel[i+1]
				)/3;
		}

		for(idxTokens=0;idxTokens<tokens.length;idxTokens++){
			token=tokens[idxTokens];
			for(i=0;i<12;i++){
				token.vlModel[i]=allvlModel[idxTokens*12+i];
			}
		}
		return tokens;
	};
	
	this.get= function(toneType,tone){
		var ret=[];
		var model=this.data[toneType];
		var model2=[];
		if (tone==0){
			model2=this.data2[0];
		}else if (tone==1){
			model2=this.data2[1];
		}else if (tone==2){
			model2=this.data2[2];
		}else if (tone==3){
			model2=this.data2[3];
		}else if (tone==4){
			model2=this.data2[4];
		}
		for (var i=0;i<model.length;i++){
			ret.push(model[i]*model2[i]);
		}
		return ret;
	};
		
	this.data=[
		[0.6,0.6,0.70,0.76,0.90,0.98,1.00,0.98,0.95,0.85,0.75,0.6],//0 type
		[0.6,0.00,0.15,0.30,1.00,1.00,0.98,0.95,0.90,0.83,0.75,0.6],//1
		[0.6,0.00,0.00,0.00,0.80,0.90,0.93,0.90,0.85,0.80,0.75,0.6],//2

		[0.6,0.6,0.70,0.76,0.90,0.98,1.00,0.98,0.8,0.6,0,0],//3
		[0.6,0.00,0.15,0.30,1.00,1.00,0.98,0.95,0.8,0.6,0,0],//4
		[0.6,0.00,0.00,0.00,0.80,0.90,0.93,0.90,0.8,0.6,0,0],//5
	];
		
	this.data2=[
		[1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],//0 tone
		[1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],//1
		[0.5,0.5,0.5,0.5,0.6,0.7,0.8,0.9,1.0,1.0,1.0,1.0],//2
		[1.0,1.0,1.0,1.0,1.0,0.9,0.8,0.7,0.6,0.5,0.5,0.5],//3
		[1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0],//4
	];
}