var Algorithm=new function(){
	this.TAIL_TIME_LENGTH=100;
	///////////////////////////////////////////////////////////////////////
	/**
	 * 生成声音数据
	 **/
	this.fire= function(tokens){
		var idxTokens;
		var token;
		var tokenP;
		var array=[];
		var i;
		var j;
		//生成声音数组
		for(idxTokens=0;idxTokens<tokens.length;idxTokens++){
			token=tokens[idxTokens];
			tokenP=null;
			////////////////////////////////////////////////TODO
			if(token.pinyin!="#"){
				if(idxTokens>0){
					tokenP=tokens[idxTokens-1];
					if(tokenP.pinyin=="#"){tokenP=null;}
				}
				array=array.concat(this.calculateToken(tokenP,token,array));
			}else{
				if(idxTokens>0){
					tokenP=tokens[idxTokens-1];
					if(tokenP.pinyin=="#"){tokenP=null;}
				}
				array=array.concat(this.calculateBlank(tokenP,token,array,false));
			}
		}

		if (Period.SECOND_WIDTH==11025){
			for(i=3;i<array.length-3;i++){
				array[i]=
				(+array[i+2]*0.25
				+array[i+1]*0.5
				  +array[i]*0.618
				-array[i-1]*0.5
				-array[i-2]*0.25
				);
			}
		}else{
			for(i=10;i<array.length-10;i++){
				array[i]=
				(+array[i+9]*0.000976563
				+array[i+8]*0.001953125
				+array[i+7]*0.00390625
				+array[i+6]*0.0078125
				+array[i+5]*0.015625
				+array[i+4]*0.03125
				+array[i+3]*0.0625
				+array[i+2]*0.125
				+array[i+1]*0.25
				  +array[i]*0.5
				-array[i-1]*0.5
				-array[i-2]*0.25
				-array[i-3]*0.125
				-array[i-4]*0.0625
				-array[i-5]*0.03125
				-array[i-6]*0.015625
				-array[i-7]*0.0078125
				-array[i-8]*0.00390625
				-array[i-9]*0.001953125
				-array[i-10]*0.000976563
				);
			}
			for(i=0;i<array.length;i++){
				if (i<44){
					array[i]=array[i];
				}else{
					array[i]=array[i]+array[i-44]*0.618;
				}
			}
		}

		for(i=0;i<array.length;i++){
			var dataOrg=array[i];
			var data;
			if(dataOrg>32767){
				data=32767;
			}else if(dataOrg<-32768){
				data=-32768;
			}else if(dataOrg==null){
				data=0;
			}else{
				data=parseInt(dataOrg);
				array[i]=data;
			}
		};

		return Array2Wav.fire(array);
	};

	/**
	 * 
	 **/
	this.calculateBlank= function(tokenP,token,ret,isShort){
		var retData=[];
		if (tokenP!=null){
			var tailP=Period.get("tail",tokenP.tail);
			var hzModel=tokenP.hzModel;
			var vlModel=tokenP.vlModel;
			retData=this.createTonePart(retData,tailP,tailP,11,hzModel,vlModel,100);
		}
		var lengthbit=0;
		if (isShort){
			lengthbit=parseInt((token.timeLength)*Period.SECOND_WIDTH/1000);
		}else{
			lengthbit=parseInt((token.timeLength+200)*Period.SECOND_WIDTH/1000);
		}
		for (var i=retData.length;i<lengthbit;i++){
			retData.push(0);
		}
		return retData;
	};
	/**
	 * token单位计算声音
	 **/
	this.calculateToken= function(tokenP,token,ret){
		var idxTokens;
		var token;
		var retData=[];
		var initialData=[];
		var tailP0=null;
		var initial=null;
		if (token.initial==""){
			initial=Period.get("initial",token.initial);
		}
		var head=Period.get("head",token.head);
		var head0=Period.get("head",token.head0);
		var core=Period.get("core",token.core);
		var middle=Period.get("middle",token.middle);
		var tail=Period.get("tail",token.tail);
		
		if (tokenP!=null){
			tailP0=Period.get("tail",tokenP.tail);
		}
		var hzModel=token.hzModel;
		var vlModel=token.vlModel;
		if(tailP0==null){//句子开头的时候,tailP是null
			vlModel[2]=0;
		}
		if (token.timeLength<200)token.timeLength=200;
			
			
		var timeLengthP=0;
		var timeLengthN=0;
		
		if(token.isCiP){
			timeLengthP=20;
		}else{
			timeLengthP=0;
		}
		if(token.isCiN){
			timeLengthN=20;
		}else{
			timeLengthN=0;
		}
			
		//TODO 这样假设以下. 如果单个字的话,长度 300 如果是字字的话 长度缩短, 
		//最短 词间 200 非词间 250 
		//如何?

		var timeLength=(token.timeLength-timeLengthP*3-timeLengthN*3)/
			(5+3*(timeLengthP>0?0:1)+3*(timeLengthN>0?0:1));
		if (timeLengthP==0)timeLengthP=timeLength;
		if (timeLengthN==0)timeLengthN=timeLength;

		if(tailP0!=null)retData=this.createTonePart(retData,tailP0,tailP0,0,hzModel,vlModel,timeLengthP);
		if(tailP0!=null)retData=this.createTonePart(retData,tailP0,head0,1,hzModel,vlModel,timeLength*0.2+timeLengthP*0.8);
		retData=this.createTonePart(retData,head0,head,2,hzModel,vlModel,timeLength*0.4+timeLengthP*0.6);
		retData=this.createTonePart(retData,head,head,3,hzModel,vlModel,timeLength*0.6+timeLengthP*0.4);
		retData=this.createTonePart(retData,head,core,4,hzModel,vlModel,timeLength*0.8+timeLengthP*0.2);
		
		retData=this.createTonePart(retData,core,core,5,hzModel,vlModel,timeLength);
		
		retData=this.createTonePart(retData,core,middle,6,hzModel,vlModel,timeLength*0.8+timeLengthN*0.2);
		retData=this.createTonePart(retData,middle,middle,7,hzModel,vlModel,timeLength*0.6+timeLengthN*0.4);
		retData=this.createTonePart(retData,middle,tail,8,hzModel,vlModel,timeLength*0.4+timeLengthN*0.6);
		retData=this.createTonePart(retData,tail,tail,9,hzModel,vlModel,timeLength*0.2+timeLengthN*0.8);
		
		retData=this.createTonePart(retData,tail,tail,10,hzModel,vlModel,timeLengthN);
		
		if (initial==null){
			initialData=[];
		}else{
			initialData=this.createToneInitialPart(initial,token.volume);//声母部分加大提高分辨
		}
		for(var j=0;j<initialData.length;j++){
			if(initialData.length-1-j<retData.length)
			retData[initialData.length-1-j]+=initialData[initialData.length-1-j];
		}

		return retData;
	};

	this.createToneInitialPart= function(part,volume){
		var sample=this.restorePeriod(part,true,0);
		var ret=[];
		var idx;
		for(idx=0;idx<sample.length;idx++){
			var data=sample[idx]*volume;
			if(data>int.MAX_VALUE||data==Number.POSITIVE_INFINITY){
				data=int.MAX_VALUE;
			}else if(data<int.MIN_VALUE||data==Number.NEGATIVE_INFINITY){
				data=int.MIN_VALUE;
			}
			ret.push(data);
		}
		return ret;
	};

	this.createTonePart= function(retArray,
		partF,
		partT,
		modelIndex,
		hzModel,
		vlModel,
		timeLength
	){
		//TODO 把滤波放进去如何?
		var i,j;
		var hzF=hzModel[modelIndex];
		var hzT;if(hzModel[modelIndex+1]==null){hzT=hzF;}else{hzT=hzModel[modelIndex+1];}
		var vlF=vlModel[modelIndex];
		var vlT;if(vlModel[modelIndex+1]==null){vlT=0;}else{vlT=vlModel[modelIndex+1];}
		
		var periodCountNumber=timeLength/1000*((hzF+hzT)/2);
		var periodCount=periodCountNumber;
		if(periodCountNumber-periodCount>0.5)periodCount++;

		//返回值
		for(var periodIndex=0;periodIndex<periodCount;periodIndex++){
			//一个周期的数据
			var periodData=[];
			//周期开始时的比例
			var rateInPartF=(periodCount-periodIndex)/periodCount;
			//周期结束时的比例
			var rateInPartT=(periodCount-periodIndex-1)/periodCount;
			//周期开始时的音量
			var periodVlF=rateInPartF*vlF+(1-rateInPartF)*vlT;
			//周期结束时的音量
			var periodVlT=rateInPartT*vlF+(1-rateInPartT)*vlT;
			//周期开始时的Hz
			var periodHzF=rateInPartF*hzF+(1-rateInPartF)*hzT;
			//周期结束时的Hz
			var periodHzT=rateInPartT*hzT+(1-rateInPartT)*hzT;
			//周期开始时的采样
			var periodSampleF=this.restorePeriod(partF,false,this.getHzIndex(periodHzF));
			//周期结束时的采样
			var periodSampleT=this.restorePeriod(partT,false,this.getHzIndex(periodHzT));
			//周期的大小
			var periodSize=(Period.SECOND_WIDTH/periodHzF+Period.SECOND_WIDTH/periodHzT)/2;
			var periodSizeF=Period.SECOND_WIDTH/periodHzF;
			var periodSizeT=Period.SECOND_WIDTH/periodHzT;
			
			for(var widthIndex=0;widthIndex<periodSize;widthIndex++){

				var indexF=parseInt(periodSampleF.length*widthIndex/periodSize);
				if (indexF>=periodSampleF.length)indexF=periodSampleF.length-1;
				var indexT=parseInt(periodSampleT.length*widthIndex/periodSize);
				if (indexT>=periodSampleT.length)indexT=periodSampleT.length-1;

				var rateInPeriodFT=(periodSize-widthIndex)/periodSize;
				//这个应该是对的.按照period的段落,同时考虑period内的FT变化来算生音的成分
				var data=(periodVlF*rateInPeriodFT+periodVlT*(1-rateInPeriodFT))*
				(periodSampleF[indexF]*(
					rateInPartF*rateInPeriodFT+rateInPartT*(1-rateInPeriodFT)
				)+periodSampleT[indexT]*(
					(1-rateInPartF)*rateInPeriodFT+(1-rateInPartT)*(1-rateInPeriodFT))
				);
				periodData.push(data);
			}
			retArray=retArray.concat(periodData);
		}
		return retArray;
	};

	this.getHzIndex= function(hz){
		     if (hz>165){return 0;}				//170
		else if (165>=hz&&hz>155){return 1;}	//160
		else if (155>=hz&&hz>145){return 2;}	//150
		else if (145>=hz&&hz>135){return 3;}	//140
		else if (135>=hz&&hz>125){return 4;}	//130
		else if (125>=hz&&hz>115){return 5;}	//120
		else if (115>=hz&&hz>105){return 6;}	//110
		else if (105>=hz&&hz>95){return 7;}		//100
		else if (95>=hz&&hz>85){return 8;}		//90
		else {return 9;}				//80
	};
	this.restorePeriod= function(tonePart,initFlag,index){
		var data;
		var lastint;
		
		if(initFlag){
			if (tonePart.length==1){
				data= Adpcm.adpcm_decoder(tonePart[0],0,28);
				tonePart[1]=data;
			}else{
				data=tonePart[1];
			}
		}else{
			if (tonePart[index+10]==null){
				data= Adpcm.adpcm_decoder(tonePart[index],30000,49);
				tonePart[index+10]=data;
			}else{
				data=tonePart[index+10];
			}
		}
		
		return data;
	};
}
