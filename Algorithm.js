var Algorithm=new function(){
	this.SECOND_WIDTH=44100;
	this.BLANK_WIDTH=14700;
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
		var periodDatalength=300;
		var idxAry=[
			Math.round(periodDatalength/1),
			Math.round(periodDatalength/2),
			Math.round(periodDatalength/3),
			Math.round(periodDatalength/4),
			Math.round(periodDatalength/5),
			Math.round(periodDatalength/6),
			Math.round(periodDatalength/7),
			Math.round(periodDatalength/8),
			Math.round(periodDatalength/9),
			Math.round(periodDatalength/10),
			Math.round(periodDatalength/11),
			Math.round(periodDatalength/12),
			Math.round(periodDatalength/13),
			Math.round(periodDatalength/14),
			Math.round(periodDatalength/15),
			Math.round(periodDatalength/16),
			Math.round(periodDatalength/17),
			Math.round(periodDatalength/18),
			Math.round(periodDatalength/19),
			Math.round(periodDatalength/20),
			Math.round(periodDatalength/21),
			Math.round(periodDatalength/22),
			Math.round(periodDatalength/23),
			Math.round(periodDatalength/24),
			Math.round(periodDatalength/25),
			Math.round(periodDatalength/26),
			Math.round(periodDatalength/27),
			Math.round(periodDatalength/28),
			Math.round(periodDatalength/29),
			Math.round(periodDatalength/30)
			];
			
		var paramAry=[
			1/Math.pow(1,3),
			1/Math.pow(2,3),
			1/Math.pow(3,3),
			1/Math.pow(4,3),
			1/Math.pow(5,3),
			1/Math.pow(6,3),
			1/Math.pow(7,3),
			1/Math.pow(8,3),
			1/Math.pow(9,3),
			1/Math.pow(10,3),
			1/Math.pow(11,3),
			1/Math.pow(12,3),
			1/Math.pow(13,3),
			1/Math.pow(14,3),
			1/Math.pow(15,3),
			1/Math.pow(16,3),
			1/Math.pow(17,3),
			1/Math.pow(18,3),
			1/Math.pow(19,3),
			1/Math.pow(20,3),
			1/Math.pow(21,3),
			1/Math.pow(22,3),
			1/Math.pow(23,3),
			1/Math.pow(24,3),
			1/Math.pow(25,3),
			1/Math.pow(26,3),
			1/Math.pow(27,3),
			1/Math.pow(28,3),
			1/Math.pow(29,3),
			1/Math.pow(30,3)
		];
		for(i=0;i<array.length;i++){
			var datatemp=1*array[i];
			for(j=0;j<idxAry.length;j++){
				if (i-idxAry[j]>=0){
					datatemp+=paramAry[j]*array[i-idxAry[j]];
				}else{
					datatemp+=paramAry[j]*array[i];
				}
			}
			datatemp=datatemp/2;
			array[i]=datatemp;
		}
		
		for(i=0;i<array.length;i++){
			var dataOrg=array[i];
			var data;
			if(dataOrg>32767||dataOrg==Number.POSITIVE_INFINITY){
				data=32767;
			}else if(dataOrg<-32768||dataOrg==Number.NEGATIVE_INFINITY){
				data=-32768;
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
			lengthbit=(token.timeLength)*this.SECOND_WIDTH/1000;
		}else{
			lengthbit=(token.timeLength+200)*this.SECOND_WIDTH/1000;
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
		var timeLength=(token.timeLength+token.timeLengthCi/2-112)/7;
		var lastTimeLength=timeLength+token.timeLengthCi/2;

		var hd=token.head;

		if(token.tone==1||token.tone==3||token.tone==0){
			if(tailP0!=null)retData=this.createTonePart(retData,tailP0,tailP0,0,hzModel,vlModel,timeLength);
			if(tailP0!=null)retData=this.createTonePart(retData,tailP0,head0,1,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,head0,head,2,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,head,head,3,hzModel,vlModel,28);
			retData=this.createTonePart(retData,head,core,4,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,core,core,5,hzModel,vlModel,28);
			retData=this.createTonePart(retData,core,middle,6,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,middle,middle,7,hzModel,vlModel,28);
			retData=this.createTonePart(retData,middle,tail,8,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,tail,tail,9,hzModel,vlModel,28);
			retData=this.createTonePart(retData,tail,tail,10,hzModel,vlModel,lastTimeLength);
		}else if(token.tone==2){
			if(tailP0!=null)retData=this.createTonePart(retData,tailP0,tailP0,0,hzModel,vlModel,timeLength);
			if(tailP0!=null)retData=this.createTonePart(retData,tailP0,head0,1,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,head0,head,2,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,head,head,3,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,head,core,4,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,core,core,5,hzModel,vlModel,28);
			retData=this.createTonePart(retData,core,middle,6,hzModel,vlModel,28);
			retData=this.createTonePart(retData,middle,middle,7,hzModel,vlModel,28);
			retData=this.createTonePart(retData,middle,tail,8,hzModel,vlModel,28);
			retData=this.createTonePart(retData,tail,tail,9,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,tail,tail,10,hzModel,vlModel,lastTimeLength);
		}else if(token.tone==4){
			if(tailP0!=null)retData=this.createTonePart(retData,tailP0,tailP0,0,hzModel,vlModel,timeLength);
			if(tailP0!=null)retData=this.createTonePart(retData,tailP0,head0,1,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,head0,head,2,hzModel,vlModel,28);
			retData=this.createTonePart(retData,head,head,3,hzModel,vlModel,28);
			retData=this.createTonePart(retData,head,core,4,hzModel,vlModel,28);
			retData=this.createTonePart(retData,core,core,5,hzModel,vlModel,28);
			retData=this.createTonePart(retData,core,middle,6,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,middle,middle,7,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,middle,tail,8,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,tail,tail,9,hzModel,vlModel,timeLength);
			retData=this.createTonePart(retData,tail,tail,10,hzModel,vlModel,lastTimeLength);
		}

		if (initial==null){
			initialData=[];
		}else{
			initialData=this.createToneInitialPart(initial,token.volume/2);//声母部分加大提高分辨
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
			var periodSize=(this.SECOND_WIDTH/periodHzF+this.SECOND_WIDTH/periodHzT)/2;
			var periodSizeF=this.SECOND_WIDTH/periodHzF;
			var periodSizeT=this.SECOND_WIDTH/periodHzT;
			
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
		else if (85>=hz){return 9;}				//80
		return 0;
	};

	this.restorePeriod= function(tonePart,initFlag,index){
		var defaultwidth=0;
		var data;
		var lastint;
		
		if(initFlag){
			if (tonePart.length==1){
				defaultwidth=1320;//static
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