var Pinyin=new function(){
	/**
	 * token={
	 * 		hanzi:string,
	 * 		pinyins:[
	 * 			"pinyin1",
	 * 			"pinyin2",
	 * 			...
	 * 		],
	 * 		pinyin:string,
	 * 		logarithmP:number,
	 * 		logarithmN:number,
	 * 		tone:number,//0 1 2 3 4
	 * 		initial:string,//b p m f...
	 * 		core:string,
	 * 		middle:string,
	 * 		tail:string,
	 * 		hzModel:[] | null,
	 * 		vlModel:[] | null, 
	 * 		timeLength:
	 * 		volume:
	 * }
	 **/
	//把拼音转换成声韵母部件模型
	this.fire= function(tokens){
		var idxSentence;
		for(idxSentence=0;idxSentence<tokens.length;idxSentence++){
			this.setTonePartId(tokens[idxSentence]);
		}
		return tokens;
	};
	/**
	 * 拼音的部品
	 **/
	this.setTonePartId= function (token){
		var initial;
		var head;
		var head0;
		var core;
		var middle;
		var tail;
		var pinyin;
		var tone;
		var headTips;
		var headTeeth;
		var headMouth;
		var middleTips;
		var middleTeeth;
		var middleMouth;
		var tailTips;
		var tailTeeth;
		var tailMouth;
		
		pinyin=token.pinyin;
		if (pinyin=="#"){
			token.tone=0;
			token.initial="";
			token.head="";
			token.head0="";
			token.core="";
			token.middle="";
			token.tail="";
			token.headTips=0;
			token.headTeeth=0;
			token.headMouth=0;
			token.middleTips=0;
			token.middleTeeth=0;
			token.middleMouth=0;
			token.tailTips=0;
			token.tailTeeth=0;
			token.tailMouth=0;
			return ;//#的时候不处理
		}
		//抽取四声tone
		if(pinyin.indexOf("1")>-1){		tone=1;	pinyin=pinyin.substr(0,pinyin.length-1);}
		else if(pinyin.indexOf("2")>-1){tone=2;	pinyin=pinyin.substr(0,pinyin.length-1);}
		else if(pinyin.indexOf("3")>-1){tone=3;	pinyin=pinyin.substr(0,pinyin.length-1);}
		else if(pinyin.indexOf("4")>-1){tone=4;	pinyin=pinyin.substr(0,pinyin.length-1);}
		else {tone=0;}
		token.tone=tone;
		//抽取声母initial
		if(pinyin.indexOf("a")==0){			initial="";		head="a";	head0="a";	headTips=5;		headTeeth=5;	headMouth=5;}
		else if(pinyin.indexOf("ba")==0){	initial="";		head="ba";	head0="be";	headTips=1;		headTeeth=3;	headMouth=5;}
		else if(pinyin.indexOf("bo")==0){	initial="";		head="bo";	head0="be";	headTips=1;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("be")==0){	initial="";		head="be";	head0="be";	headTips=1;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("bi")==0){	initial="";		head="bi";	head0="bi";	headTips=1;		headTeeth=3;	headMouth=2;}
		else if(pinyin.indexOf("bu")==0){	initial="";		head="bu";	head0="bu";	headTips=1;		headTeeth=3;	headMouth=3;}
		else if(pinyin.indexOf("ca")==0){	initial="c";	head="ca";	head0="ce";	headTips=2;		headTeeth=1;	headMouth=5;}
		else if(pinyin.indexOf("co")==0){	initial="c";	head="co";	head0="ce";	headTips=2;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("ce")==0){	initial="c";	head="ce";	head0="ce";	headTips=2;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("ci")==0){	initial="c";	head="ci";	head0="ci";	headTips=2;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("cu")==0){	initial="c";	head="cu";	head0="cu";	headTips=2;		headTeeth=1;	headMouth=3;}
		else if(pinyin.indexOf("cha")==0){	initial="ch";	head="cha";	head0="che";headTips=4;		headTeeth=4;	headMouth=5;}
		else if(pinyin.indexOf("cho")==0){	initial="ch";	head="cho";	head0="che";headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("che")==0){	initial="ch";	head="che";	head0="che";headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("chi")==0){	initial="ch";	head="chi";	head0="chi";headTips=4;		headTeeth=4;	headMouth=2;}
		else if(pinyin.indexOf("chu")==0){	initial="ch";	head="chu";	head0="chu";headTips=4;		headTeeth=4;	headMouth=3;}
		else if(pinyin.indexOf("da")==0){	initial="";		head="da";	head0="de";	headTips=3;		headTeeth=1;	headMouth=5;}
		else if(pinyin.indexOf("do")==0){	initial="";		head="do";	head0="de";	headTips=3;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("de")==0){	initial="";		head="de";	head0="de";	headTips=3;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("di")==0){	initial="";		head="di";	head0="di";	headTips=3;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("du")==0){	initial="";		head="du";	head0="du";	headTips=3;		headTeeth=1;	headMouth=3;}
		else if(pinyin.indexOf("e")==0){	initial="";		head="e";	head0="e";	headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("fa")==0){	initial="f";	head="a";	head0="a";	headTips=1;		headTeeth=1;	headMouth=5;}
		else if(pinyin.indexOf("fo")==0){	initial="f";	head="o";	head0="o";	headTips=1;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("fe")==0){	initial="f";	head="e";	head0="e";	headTips=1;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("fu")==0){	initial="f";	head="u";	head0="u";	headTips=1;		headTeeth=1;	headMouth=3;}
		else if(pinyin.indexOf("ga")==0){	initial="g";	head="ga";	head0="ge";	headTips=3;		headTeeth=3;	headMouth=5;}
		else if(pinyin.indexOf("go")==0){	initial="g";	head="go";	head0="ge";	headTips=3;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("ge")==0){	initial="g";	head="ge";	head0="ge";	headTips=3;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("gu")==0){	initial="g";	head="gu";	head0="gu";	headTips=3;		headTeeth=3;	headMouth=3;}
		else if(pinyin.indexOf("ha")==0){	initial="";		head="ha";	head0="he";	headTips=3;		headTeeth=3;	headMouth=5;}
		else if(pinyin.indexOf("ho")==0){	initial="";		head="ho";	head0="he";	headTips=3;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("he")==0){	initial="";		head="he";	head0="he";	headTips=3;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("hu")==0){	initial="";		head="hu";	head0="hu";	headTips=3;		headTeeth=3;	headMouth=3;}
		else if(pinyin.indexOf("ji")==0){	initial="j";	head="ji";	head0="ji";	headTips=2;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("jv")==0){	initial="j";	head="jv";	head0="ji";	headTips=2;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("ka")==0){	initial="k";	head="ga";	head0="ge";	headTips=3;		headTeeth=3;	headMouth=5;}
		else if(pinyin.indexOf("ko")==0){	initial="k";	head="go";	head0="ge";	headTips=3;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("ke")==0){	initial="k";	head="ge";	head0="ge";	headTips=3;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("ku")==0){	initial="k";	head="gu";	head0="gu";	headTips=3;		headTeeth=3;	headMouth=3;}
		else if(pinyin.indexOf("la")==0){	initial="";		head="la";	head0="le";	headTips=3;		headTeeth=1;	headMouth=5;}
		else if(pinyin.indexOf("lo")==0){	initial="";		head="lo";	head0="le";	headTips=3;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("le")==0){	initial="";		head="le";	head0="le";	headTips=3;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("li")==0){	initial="";		head="li";	head0="li";	headTips=3;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("lu")==0){	initial="";		head="lu";	head0="lu";	headTips=3;		headTeeth=1;	headMouth=3;}
		else if(pinyin.indexOf("lv")==0){	initial="";		head="lv";	head0="li";	headTips=3;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("ma")==0){	initial="";		head="ma";	head0="me";	headTips=1;		headTeeth=3;	headMouth=5;}
		else if(pinyin.indexOf("mo")==0){	initial="";		head="mo";	head0="me";	headTips=1;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("me")==0){	initial="";		head="me";	head0="me";	headTips=1;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("mi")==0){	initial="";		head="mi";	head0="mi";	headTips=1;		headTeeth=3;	headMouth=2;}
		else if(pinyin.indexOf("mu")==0){	initial="";		head="mu";	head0="mu";	headTips=1;		headTeeth=3;	headMouth=3;}
		else if(pinyin.indexOf("na")==0){	initial="";		head="na";	head0="ne";	headTips=3;		headTeeth=1;	headMouth=5;}
		else if(pinyin.indexOf("no")==0){	initial="";		head="no";	head0="ne";	headTips=3;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("ne")==0){	initial="";		head="ne";	head0="ne";	headTips=3;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("ni")==0){	initial="";		head="ni";	head0="ni";	headTips=3;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("nu")==0){	initial="";		head="nu";	head0="nu";	headTips=3;		headTeeth=1;	headMouth=3;}
		else if(pinyin.indexOf("nv")==0){	initial="";		head="nv";	head0="ni";	headTips=3;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("o")==0){	initial="";		head="o";	head0="o";	headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("pa")==0){	initial="p";	head="ba";	head0="be";	headTips=1;		headTeeth=3;	headMouth=5;}
		else if(pinyin.indexOf("po")==0){	initial="p";	head="bo";	head0="be";	headTips=1;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("pe")==0){	initial="p";	head="be";	head0="be";	headTips=1;		headTeeth=3;	headMouth=4;}
		else if(pinyin.indexOf("pi")==0){	initial="p";	head="bi";	head0="bi";	headTips=1;		headTeeth=3;	headMouth=2;}
		else if(pinyin.indexOf("pu")==0){	initial="p";	head="bu";	head0="bu";	headTips=1;		headTeeth=3;	headMouth=3;}
		else if(pinyin.indexOf("qi")==0){	initial="q";	head="qi";	head0="qi";	headTips=2;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("qv")==0){	initial="q";	head="qv";	head0="qi";	headTips=2;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("ra")==0){	initial="";		head="ra";	head0="re";	headTips=4;		headTeeth=4;	headMouth=5;}
		else if(pinyin.indexOf("ro")==0){	initial="";		head="ro";	head0="re";	headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("re")==0){	initial="";		head="re";	head0="re";	headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("ri")==0){	initial="";		head="ri";	head0="ri";	headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("ru")==0){	initial="";		head="ru";	head0="ru";	headTips=4;		headTeeth=4;	headMouth=3;}
		else if(pinyin.indexOf("sa")==0){	initial="s";	head="sa";	head0="se";	headTips=2;		headTeeth=1;	headMouth=5;}
		else if(pinyin.indexOf("so")==0){	initial="s";	head="so";	head0="se";	headTips=2;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("se")==0){	initial="s";	head="se";	head0="se";	headTips=2;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("si")==0){	initial="s";	head="si";	head0="si";	headTips=2;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("su")==0){	initial="s";	head="su";	head0="su";	headTips=2;		headTeeth=1;	headMouth=3;}
		else if(pinyin.indexOf("sha")==0){	initial="sh";	head="sha";	head0="she";headTips=4;		headTeeth=4;	headMouth=5;}
		else if(pinyin.indexOf("sho")==0){	initial="sh";	head="sho";	head0="she";headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("she")==0){	initial="sh";	head="she";	head0="she";headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("shi")==0){	initial="sh";	head="shi";	head0="shi";headTips=4;		headTeeth=4;	headMouth=2;}
		else if(pinyin.indexOf("shu")==0){	initial="sh";	head="shu";	head0="shu";headTips=4;		headTeeth=4;	headMouth=3;}
		else if(pinyin.indexOf("ta")==0){	initial="t";	head="ta";	head0="de";	headTips=3;		headTeeth=1;	headMouth=5;}
		else if(pinyin.indexOf("to")==0){	initial="t";	head="to";	head0="de";	headTips=3;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("te")==0){	initial="t";	head="de";	head0="de";	headTips=3;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("ti")==0){	initial="t";	head="di";	head0="di";	headTips=3;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("tu")==0){	initial="t";	head="du";	head0="du";	headTips=3;		headTeeth=1;	headMouth=3;}
		else if(pinyin.indexOf("w")==0){	initial="";		head="u";	head0="u";	headTips=3;		headTeeth=3;	headMouth=5;}
		else if(pinyin.indexOf("xi")==0){	initial="x";	head="xi";	head0="xi";	headTips=2;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("xv")==0){	initial="x";	head="xv";	head0="xi";	headTips=2;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("yv")==0){	initial="";		head="v";	head0="i";	headTips=2;		headTeeth=2;	headMouth=2;}
		else if(pinyin.indexOf("y")==0){	initial="";		head="i";	head0="i";	headTips=2;		headTeeth=2;	headMouth=2;}
		else if(pinyin.indexOf("za")==0){	initial="z";	head="za";	head0="ze";	headTips=2;		headTeeth=1;	headMouth=5;}
		else if(pinyin.indexOf("zo")==0){	initial="z";	head="zo";	head0="ze";	headTips=2;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("ze")==0){	initial="z";	head="ze";	head0="ze";	headTips=2;		headTeeth=1;	headMouth=4;}
		else if(pinyin.indexOf("zi")==0){	initial="z";	head="zi";	head0="zi";	headTips=2;		headTeeth=1;	headMouth=2;}
		else if(pinyin.indexOf("zu")==0){	initial="z";	head="zu";	head0="zu";	headTips=2;		headTeeth=1;	headMouth=3;}
		else if(pinyin.indexOf("zha")==0){	initial="zh";	head="zha";	head0="zhe";headTips=4;		headTeeth=4;	headMouth=5;}
		else if(pinyin.indexOf("zho")==0){	initial="zh";	head="zho";	head0="zhe";headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("zhe")==0){	initial="zh";	head="zhe";	head0="zhe";headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("zhi")==0){	initial="zh";	head="zhi";	head0="zhi";headTips=4;		headTeeth=4;	headMouth=4;}
		else if(pinyin.indexOf("zhu")==0){	initial="zh";	head="zhu";	head0="zhu";headTips=4;		headTeeth=4;	headMouth=3;}
		
		token.initial=initial;
		token.head=head;
		token.head0=head0;
		token.headTips=headTips;
		token.headTeeth=headTeeth;
		token.headMouth=headMouth;
		
		//抽取结尾
		var firstChar=pinyin.charAt(0);
		if (firstChar!="a"&&firstChar!="o"&&firstChar!="e"){//有声母的话
			pinyin=pinyin.substr(1);//去一个头字母
			if (pinyin.length>1 && pinyin.charAt(0)=="h"){//如果下一个字母是h
				pinyin=pinyin.substr(1);//再去一个头字母
			}
		}

		//韵母取得
		//y####
		if(head=="i" && pinyin=="a"){		core="ia";	middle="a";		middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(head=="i" && pinyin=="o"){	core="iao";	middle="o";		middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(head=="i" && pinyin=="e"){	core="ie";	middle="ie";	middleTips=3;	middleTeeth=3;	middleMouth=3;}
		else if(head=="i" && pinyin=="ou"){	core="iu";	middle="ou";	middleTips=4;	middleTeeth=4;	middleMouth=4;}//TODO 这个是不是 ou
		else if(head=="i" && pinyin=="ao"){	core="iao";	middle="ao";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(head=="i" && pinyin=="an"){	core="ian";	middle="an";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(head=="i" && pinyin=="ang"){core="iang";middle="ang";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(head=="i" && pinyin=="ong"){core="iong";middle="ong";	middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if (pinyin=="i"&&(initial=="c"||initial=="s"||initial=="z")){
											core="zcs";middle="zcs";	middleTips=2;	middleTeeth=1;	middleMouth=1;}
		else if (pinyin=="i"&&(initial.indexOf("ch")>-1||initial.indexOf("sh")>-1||initial.indexOf("zh")>-1||head=="ri")){
											core="zcsh";middle="zcsh";	middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(head=="u" && pinyin=="a"){	core="a";	middle="a";		middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(head=="u" && pinyin=="o"){	core="o";	middle="o";		middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(head=="u" && pinyin=="ai"){	core="ai";	middle="ai";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(head=="u" && pinyin=="ei"){	core="ei";	middle="ei";	middleTips=3;	middleTeeth=3;	middleMouth=3;}
		else if(head=="u" && pinyin=="an"){	core="an";	middle="an";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(head=="u" && pinyin=="en"){	core="en";	middle="en";	middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(head=="u" && pinyin=="ang"){core="ang";middle="ang";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(head=="u" && pinyin=="eng"){core="eng";middle="eng";	middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(pinyin=="a"){				core="a";	middle="a";		middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="ai"){				core="ai";	middle="ai";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="an"){				core="an";	middle="an";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="ang"){				core="ang";	middle="ang";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="ao"){				core="ao";	middle="ao";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="o"){				core="o";	middle="o";		middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(pinyin=="ou"){				core="ou";	middle="ou";	middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(pinyin=="e"){				core="e";	middle="e";		middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(pinyin=="ei"){				core="ei";	middle="ei";	middleTips=3;	middleTeeth=3;	middleMouth=3;}
		else if(pinyin=="en"){				core="en";	middle="en";	middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(pinyin=="eng"){				core="eng";	middle="eng";	middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(pinyin=="er"){				core="er";	middle="er";	middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(pinyin=="ia"){				core="ia";	middle="a";		middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="ian"){				core="ian";	middle="an";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="iang"){			core="iang";middle="ang";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="iao"){				core="iao";	middle="ao";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="ie"){				core="ie";	middle="ie";	middleTips=3;	middleTeeth=3;	middleMouth=3;}
		else if(pinyin=="i"){				core="i";	middle="i";		middleTips=2;	middleTeeth=2;	middleMouth=2;}
		else if(pinyin=="in"){				core="in";	middle="in";	middleTips=2;	middleTeeth=2;	middleMouth=2;}
		else if(pinyin=="ing"){				core="ing";	middle="ing";	middleTips=2;	middleTeeth=2;	middleMouth=2;}
		else if(pinyin=="iong"){			core="iong";middle="ong";	middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(pinyin=="iu"){				core="iu";	middle="iu";	middleTips=2;	middleTeeth=2;	middleMouth=2;}
		else if(pinyin=="v"){				core="v";	middle="v";		middleTips=2;	middleTeeth=2;	middleMouth=2;}
		else if(pinyin=="van"){				core="van";	middle="an";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="ve"){				core="ve";	middle="ve";	middleTips=2;	middleTeeth=2;	middleMouth=2;}
		else if(pinyin=="vn"){				core="vn";	middle="vn";	middleTips=2;	middleTeeth=2;	middleMouth=2;}
		else if(pinyin=="ua"){				core="ua";	middle="a";		middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="uai"){				core="uai";	middle="ai";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="uan"){				core="uan";	middle="an";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="uang"){			core="uang";middle="ang";	middleTips=5;	middleTeeth=5;	middleMouth=5;}
		else if(pinyin=="ui"){				core="ui";	middle="ei";	middleTips=3;	middleTeeth=3;	middleMouth=3;}
		else if(pinyin=="un"){				core="un";	middle="en";	middleTips=3;	middleTeeth=3;	middleMouth=3;}
		else if(pinyin=="uo"){				core="uo";	middle="o";		middleTips=4;	middleTeeth=4;	middleMouth=4;}
		else if(pinyin=="u"){				core="u";	middle="u";		middleTips=3;	middleTeeth=3;	middleMouth=3;}
		else if(pinyin=="ong"){				core="iong";middle="ong";	middleTips=4;	middleTeeth=4;	middleMouth=4;}

		token.core=core;
		token.middle=middle;
		token.middleTips=middleTips;
		token.middleTeeth=middleTeeth;
		token.middleMouth=middleMouth;
		
		if (pinyin.indexOf("ng")>-1){
										tail="ng";	tailTips=4;		tailTeeth=4;	tailMouth=4;}
		else if (pinyin.indexOf("er")>-1){
										tail="er";	tailTips=4;		tailTeeth=4;	tailMouth=4;}
		else if (pinyin=="i"&&(initial=="c"||initial=="s"||initial=="z")){
										tail="zcs";	tailTips=2;		tailTeeth=1;	tailMouth=1;}
		else if (pinyin=="i"&&(initial.indexOf("ch")>-1||initial.indexOf("sh")>-1||initial.indexOf("zh")>-1||head=="ri")){
										tail="zcsh";tailTips=4;		tailTeeth=4;	tailMouth=4;}/////
		else if (pinyin.indexOf("n")==pinyin.length-1){
										tail="n";	tailTips=3;		tailTeeth=1;	tailMouth=2;}
		else if (pinyin.indexOf("a")==pinyin.length-1){
										tail="a";	tailTips=5;		tailTeeth=5;	tailMouth=5;}
		else if (core=="uo"||core=="o"){
										tail="e";	tailTips=4;		tailTeeth=4;	tailMouth=4;}
		else if (pinyin.indexOf("o")==pinyin.length-1){
										tail="o";	tailTips=4;		tailTeeth=4;	tailMouth=4;}
		else if (pinyin.indexOf("e")==pinyin.length-1){
										tail="e";	tailTips=4;		tailTeeth=4;	tailMouth=4;}
		else if (pinyin.indexOf("ai")>-1){
										tail="aei";	tailTips=3;		tailTeeth=3;	tailMouth=3;}
		else if (pinyin.indexOf("ei")>-1){
										tail="aei";	tailTips=3;		tailTeeth=3;	tailMouth=3;}
		else if (pinyin.indexOf("ui")>-1){
										tail="aei";	tailTips=3;		tailTeeth=3;	tailMouth=3;}
		else if (pinyin.indexOf("i")==pinyin.length-1){
										tail="i";	tailTips=2;		tailTeeth=2;	tailMouth=2;}
		else if (pinyin.indexOf("u")==pinyin.length-1){
										tail="u";	tailTips=3;		tailTeeth=3;	tailMouth=3;}
		else if (pinyin.indexOf("v")==pinyin.length-1){
										tail="v";	tailTips=2;		tailTeeth=2;	tailMouth=2;}

		token.tail=tail;
		token.tailTips=tailTips;
		token.tailTeeth=tailTeeth;
		token.tailMouth=tailMouth;
		return ;						
	};
}