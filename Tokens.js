var Tokens=new function(){
	this.MAX_LOG=16; 
	this.MAX_HZ_CHANGED=32;
	this.UNIT_DYZ_WEIGHT=100;
	///////////////////////////////////////////////////////////////////////
	/**
	 * 算出字数组的最佳拼音
	 **/
	this.fire= function(sentence,param){
		var tokens;
		//句子转换成tokens
		tokens=Hanzi.fire(sentence);
		//多音字问题
		tokens=Duoyinzi.fire(tokens);
		//计算各个音的使用频率
		tokens=Logarithm.fire(tokens);
		//方言转换和33音变
		tokens=this.transformToFangYan(tokens,param.fangyan);
		//把拼音转换成声韵母部件模型
		tokens=Pinyin.fire(tokens);
		//计算各个音长ms
		tokens=this.calculateTimeLength(tokens);
		//计算各个音高
		tokens=this.calculateVolume(tokens);
		//把拼音转换成Hz模型
		tokens=Hertz.fire(tokens);
		//把拼音转换成Vl模型
		tokens=Volume.fire(tokens);

		return tokens;
	};
	///////////////////////////////////////////////////////////////////////
	/**
	 * 方言变换和33音变
	 **/
	this.transformToFangYan= function(tokens,fangyan){
		var idxSentence;
		var pinyin;
		var pinyinNext;
		var token;
		var tokenNext;
		for(idxSentence=0;idxSentence<tokens.length;idxSentence++){
			token=tokens[idxSentence];
			pinyin=token.pinyin;
			if (fangyan=="henanhua"){
				if (pinyin.indexOf("1",0)>-1){pinyin=pinyin.replace("1","2");}
				else if (pinyin.indexOf("2",0)>-1){pinyin=pinyin.replace("2","4");}
				else if (pinyin.indexOf("3",0)>-1){pinyin=pinyin.replace("3","1");}
				else if (pinyin.indexOf("4",0)>-1){pinyin=pinyin.replace("4","3");}
			}
			if (fangyan=="sichuanhua"){
				if (pinyin.indexOf("ch",0)>-1){pinyin=pinyin.replace("ch","c");}
				else if (pinyin.indexOf("sh",0)>-1){pinyin=pinyin.replace("sh","s");}
				else if (pinyin.indexOf("zh",0)>-1){pinyin=pinyin.replace("zh","z");}
				if (pinyin.indexOf("1",0)>-1){pinyin=pinyin.replace("1","1");}
				else if (pinyin.indexOf("2",0)>-1){pinyin=pinyin.replace("2","3");}
				else if (pinyin.indexOf("3",0)>-1){pinyin=pinyin.replace("3","1");}
				else if (pinyin.indexOf("4",0)>-1){pinyin=pinyin.replace("4","3");}
			}
			if (fangyan=="hunanhua"){
				if (pinyin.indexOf("1",0)>-1){pinyin=pinyin.replace("1","3");}
				else if (pinyin.indexOf("2",0)>-1){pinyin=pinyin.replace("2","3");}
				else if (pinyin.indexOf("3",0)>-1){pinyin=pinyin.replace("3","1");}
				else if (pinyin.indexOf("4",0)>-1){pinyin=pinyin.replace("4","1");}					
			}
			token.pinyin=pinyin;
		}
		//从后往前处理
		for(idxSentence=tokens.length-2;idxSentence>=0;idxSentence--){
			token=tokens[idxSentence];
			tokenNext=tokens[idxSentence+1];
			pinyin=token.pinyin;
			pinyinNext=tokenNext.pinyin;
			//3声的转换 33转23 
			if (pinyin.indexOf("3")>-1 && pinyinNext.indexOf("3")>-1){
				token.pinyin=pinyin.replace("3","2");
			}
			if ( token.hanzi=="一" && token.pinyin=="yi"){
				if(pinyinNext.indexOf("4")>-1){
					token.pinyin="yi2";
				}else{
					token.pinyin="yi4";
				}
			}
			if ( token.hanzi=="不" && token.pinyin=="bu"){
				if(pinyinNext.indexOf("4")>-1){
					token.pinyin="bu2";
				}else{
					token.pinyin="bu4";
				}
			}
		}
		
		return tokens;
	};
	///////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////////////
	/**
	 * 计算各个音长bit
	 **/
	this.calculateTimeLength= function(tokens){
		var idxTokens;
		var token;
		var tokenP;
		var tokenN;
		for(idxTokens=0;idxTokens<tokens.length;idxTokens++){
			token=tokens[idxTokens];
			tokenP=tokens[idxTokens-1];
			tokenN=tokens[idxTokens+1];

			token.timeLength=0;
			
			if (token.isCiP){
				token.timeLength+=(100+(1-token.logarithmP/this.MAX_LOG)*100)/2;
			}else{
				token.timeLength+=(175+(1-token.logarithmP/this.MAX_LOG)*100)/2;
			}
			if (token.isCiN){
				token.timeLength+=(100+(1-token.logarithmN/this.MAX_LOG)*100)/2;
			}else{
				token.timeLength+=(175+(1-token.logarithmN/this.MAX_LOG)*100)/2;
			}
			token.timeLength+=(1-token.logarithmHz/this.MAX_LOG)*25;


		}
		return tokens;
	};
	///////////////////////////////////////////////////////////////////////
	/**
	 * 计算各个音高
	 **/
	this.calculateVolume= function(tokens){
		var idxTokens;
		var token;
		var tokenP;
		var tokenN;
		var defaultVolume=0.159;
		for(idxTokens=0;idxTokens<tokens.length;idxTokens++){
			token=tokens[idxTokens];
			tokenP=tokens[idxTokens-1];
			tokenN=tokens[idxTokens+1];
			if (token.pinyin=="#"){
				token.volume=0;
			}else{
				if(token.tone==0){
					defaultVolume=0.118;
				}else if(token.tone==1){
					defaultVolume=0.199;
				}else if(token.tone==2){
					defaultVolume=0.122;
				}else if(token.tone==3){
					defaultVolume=0.118;
				}else if(token.tone==4){
					defaultVolume=0.197;
				}
				if (tokenP!=null&&tokenP.pinyin!="#"){//如果前面不是符号,就和前后大的比较.
					if (token.isCiP){
						token.volume=defaultVolume/(1-(token.logarithmP)/2/this.MAX_LOG);
					}else{
						token.volume=defaultVolume/(1-(token.logarithmP/2)/2/this.MAX_LOG);
					}
				}else{//如果前面是符号,就和后面比较.
					token.volume=defaultVolume;
				}
			}
		}
		return tokens;
	};
}
