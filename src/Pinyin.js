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
	 * 		isCiP:boolean,
	 * 		isCiN:boolean,
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
		
		pinyin=token.pinyin;
		if (pinyin=="#"){
			token.tone=0;
			token.initial="";
			token.head="";
			token.head0="";
			token.core="";
			token.middle="";
			token.tail="";
			return ;//#的时候不处理
		}
		//抽取四声tone
		if(pinyin.indexOf("1")>-1){		tone=1;	pinyin=pinyin.substr(0,pinyin.length-1);}
		else if(pinyin.indexOf("2")>-1){tone=2;	pinyin=pinyin.substr(0,pinyin.length-1);}
		else if(pinyin.indexOf("3")>-1){tone=3;	pinyin=pinyin.substr(0,pinyin.length-1);}
		else if(pinyin.indexOf("4")>-1){tone=4;	pinyin=pinyin.substr(0,pinyin.length-1);}
		else {tone=0;}
		token.tone=tone;
		token.pinyinWithoutTone=pinyin;
		//抽取声母initial
		if(pinyin.indexOf("a")==0){			initial="";		head="a";	head0="a";	}
		else if(pinyin.indexOf("ba")==0){	initial="";		head="ba";	head0="be";	}
		else if(pinyin.indexOf("bo")==0){	initial="";		head="bo";	head0="be";	}
		else if(pinyin.indexOf("be")==0){	initial="";		head="be";	head0="be";	}
		else if(pinyin.indexOf("bi")==0){	initial="";		head="bi";	head0="bi";	}
		else if(pinyin.indexOf("bu")==0){	initial="";		head="bu";	head0="bu";	}
		else if(pinyin.indexOf("ca")==0){	initial="c";	head="ca";	head0="ce";	}
		else if(pinyin.indexOf("co")==0){	initial="c";	head="co";	head0="ce";	}
		else if(pinyin.indexOf("ce")==0){	initial="c";	head="ce";	head0="ce";	}
		else if(pinyin.indexOf("ci")==0){	initial="c";	head="ci";	head0="ci";	}
		else if(pinyin.indexOf("cu")==0){	initial="c";	head="cu";	head0="cu";	}
		else if(pinyin.indexOf("cha")==0){	initial="ch";	head="cha";	head0="che";}
		else if(pinyin.indexOf("cho")==0){	initial="ch";	head="cho";	head0="che";}
		else if(pinyin.indexOf("che")==0){	initial="ch";	head="che";	head0="che";}
		else if(pinyin.indexOf("chi")==0){	initial="ch";	head="chi";	head0="chi";}
		else if(pinyin.indexOf("chu")==0){	initial="ch";	head="chu";	head0="chu";}
		else if(pinyin.indexOf("da")==0){	initial="";		head="da";	head0="de";	}
		else if(pinyin.indexOf("do")==0){	initial="";		head="do";	head0="de";	}
		else if(pinyin.indexOf("de")==0){	initial="";		head="de";	head0="de";	}
		else if(pinyin.indexOf("di")==0){	initial="";		head="di";	head0="di";	}
		else if(pinyin.indexOf("du")==0){	initial="";		head="du";	head0="du";	}
		else if(pinyin.indexOf("e")==0){	initial="";		head="e";	head0="e";	}
		else if(pinyin.indexOf("fa")==0){	initial="f";	head="a";	head0="a";	}
		else if(pinyin.indexOf("fo")==0){	initial="f";	head="o";	head0="o";	}
		else if(pinyin.indexOf("fe")==0){	initial="f";	head="e";	head0="e";	}
		else if(pinyin.indexOf("fu")==0){	initial="f";	head="u";	head0="u";	}
		else if(pinyin.indexOf("ga")==0){	initial="g";	head="ga";	head0="ge";	}
		else if(pinyin.indexOf("go")==0){	initial="g";	head="go";	head0="ge";	}
		else if(pinyin.indexOf("ge")==0){	initial="g";	head="ge";	head0="ge";	}
		else if(pinyin.indexOf("gu")==0){	initial="g";	head="gu";	head0="gu";	}
		else if(pinyin.indexOf("ha")==0){	initial="";		head="ha";	head0="he";	}
		else if(pinyin.indexOf("ho")==0){	initial="";		head="ho";	head0="he";	}
		else if(pinyin.indexOf("he")==0){	initial="";		head="he";	head0="he";	}
		else if(pinyin.indexOf("hu")==0){	initial="";		head="hu";	head0="hu";	}
		else if(pinyin.indexOf("ji")==0){	initial="j";	head="i";	head0="ji";	}//
		else if(pinyin.indexOf("jv")==0){	initial="j";	head="v";	head0="jv";	}//
		else if(pinyin.indexOf("ka")==0){	initial="k";	head="ga";	head0="ge";	}
		else if(pinyin.indexOf("ko")==0){	initial="k";	head="go";	head0="ge";	}
		else if(pinyin.indexOf("ke")==0){	initial="k";	head="ge";	head0="ge";	}
		else if(pinyin.indexOf("ku")==0){	initial="k";	head="gu";	head0="gu";	}
		else if(pinyin.indexOf("la")==0){	initial="";		head="a";	head0="la";	}//
		else if(pinyin.indexOf("lo")==0){	initial="";		head="o";	head0="lo";	}//
		else if(pinyin.indexOf("le")==0){	initial="";		head="e";	head0="le";	}//
		else if(pinyin.indexOf("li")==0){	initial="";		head="i";	head0="li";	}//特殊
		else if(pinyin.indexOf("lu")==0){	initial="";		head="u";	head0="lu";	}//
		else if(pinyin.indexOf("lv")==0){	initial="";		head="v";	head0="lv";	}//
		else if(pinyin.indexOf("ma")==0){	initial="";		head="a";	head0="ma";	}//
		else if(pinyin.indexOf("mo")==0){	initial="";		head="o";	head0="mo";	}//
		else if(pinyin.indexOf("me")==0){	initial="";		head="e";	head0="me";	}//
		else if(pinyin.indexOf("mi")==0){	initial="";		head="i";	head0="mi";	}//
		else if(pinyin.indexOf("mu")==0){	initial="";		head="u";	head0="mu";	}//
		else if(pinyin.indexOf("na")==0){	initial="";		head="a";	head0="na";	}//
		else if(pinyin.indexOf("no")==0){	initial="";		head="o";	head0="no";	}//
		else if(pinyin.indexOf("ne")==0){	initial="";		head="e";	head0="ne";	}//
		else if(pinyin.indexOf("ni")==0){	initial="";		head="i";	head0="ni";	}//
		else if(pinyin.indexOf("nu")==0){	initial="";		head="u";	head0="nu";	}//
		else if(pinyin.indexOf("nv")==0){	initial="";		head="v";	head0="nv";	}//特殊
		else if(pinyin.indexOf("o")==0){	initial="";		head="o";	head0="o";	}
		else if(pinyin.indexOf("pa")==0){	initial="p";	head="ba";	head0="be";	}
		else if(pinyin.indexOf("po")==0){	initial="p";	head="bo";	head0="be";	}
		else if(pinyin.indexOf("pe")==0){	initial="p";	head="be";	head0="be";	}
		else if(pinyin.indexOf("pi")==0){	initial="p";	head="bi";	head0="bi";	}
		else if(pinyin.indexOf("pu")==0){	initial="p";	head="bu";	head0="bu";	}
		else if(pinyin.indexOf("qi")==0){	initial="q";	head="i";	head0="qi";	}//
		else if(pinyin.indexOf("qv")==0){	initial="q";	head="v";	head0="qv";	}//
		else if(pinyin.indexOf("ra")==0){	initial="";		head="ra";	head0="re";	}
		else if(pinyin.indexOf("ro")==0){	initial="";		head="ro";	head0="re";	}
		else if(pinyin.indexOf("re")==0){	initial="";		head="re";	head0="re";	}
		else if(pinyin.indexOf("ri")==0){	initial="";		head="ri";	head0="ri";	}
		else if(pinyin.indexOf("ru")==0){	initial="";		head="ru";	head0="ru";	}
		else if(pinyin.indexOf("sa")==0){	initial="s";	head="sa";	head0="se";	}
		else if(pinyin.indexOf("so")==0){	initial="s";	head="so";	head0="se";	}
		else if(pinyin.indexOf("se")==0){	initial="s";	head="se";	head0="se";	}
		else if(pinyin.indexOf("si")==0){	initial="s";	head="si";	head0="si";	}
		else if(pinyin.indexOf("su")==0){	initial="s";	head="su";	head0="su";	}
		else if(pinyin.indexOf("sha")==0){	initial="sh";	head="sha";	head0="she";}
		else if(pinyin.indexOf("sho")==0){	initial="sh";	head="sho";	head0="she";}
		else if(pinyin.indexOf("she")==0){	initial="sh";	head="she";	head0="she";}
		else if(pinyin.indexOf("shi")==0){	initial="sh";	head="shi";	head0="shi";}
		else if(pinyin.indexOf("shu")==0){	initial="sh";	head="shu";	head0="shu";}
		else if(pinyin.indexOf("ta")==0){	initial="t";	head="ta";	head0="de";	}
		else if(pinyin.indexOf("to")==0){	initial="t";	head="to";	head0="de";	}
		else if(pinyin.indexOf("te")==0){	initial="t";	head="de";	head0="de";	}
		else if(pinyin.indexOf("ti")==0){	initial="t";	head="di";	head0="di";	}
		else if(pinyin.indexOf("tu")==0){	initial="t";	head="du";	head0="du";	}
		else if(pinyin.indexOf("w")==0){	initial="";		head="u";	head0="u";	}
		else if(pinyin.indexOf("xi")==0){	initial="x";	head="i";	head0="xi";	}//
		else if(pinyin.indexOf("xv")==0){	initial="x";	head="v";	head0="xv";	}//
		else if(pinyin.indexOf("yv")==0){	initial="";		head="v";	head0="i";	}
		else if(pinyin.indexOf("y")==0){	initial="";		head="i";	head0="i";	}
		else if(pinyin.indexOf("za")==0){	initial="z";	head="za";	head0="ze";	}
		else if(pinyin.indexOf("zo")==0){	initial="z";	head="zo";	head0="ze";	}
		else if(pinyin.indexOf("ze")==0){	initial="z";	head="ze";	head0="ze";	}
		else if(pinyin.indexOf("zi")==0){	initial="z";	head="zi";	head0="zi";	}
		else if(pinyin.indexOf("zu")==0){	initial="z";	head="zu";	head0="zu";	}
		else if(pinyin.indexOf("zha")==0){	initial="zh";	head="zha";	head0="zhe";}
		else if(pinyin.indexOf("zho")==0){	initial="zh";	head="zho";	head0="zhe";}
		else if(pinyin.indexOf("zhe")==0){	initial="zh";	head="zhe";	head0="zhe";}
		else if(pinyin.indexOf("zhi")==0){	initial="zh";	head="zhi";	head0="zhi";}
		else if(pinyin.indexOf("zhu")==0){	initial="zh";	head="zhu";	head0="zhu";}

		token.initial=initial;
		token.head=head;
		token.head0=head0;
		
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
		if(head=="i" && pinyin=="a"){		core="ia";	middle="a";		}
		else if(head=="i" && pinyin=="o"){	core="iao";	middle="o";		}
		else if(head=="i" && pinyin=="e"){	core="ie";	middle="ie";	}
		else if(head=="i" && pinyin=="ou"){	core="iu";	middle="ou";	}//TODO 这个是不是 ou
		else if(head=="i" && pinyin=="ao"){	core="iao";	middle="ao";	}
		else if(head=="i" && pinyin=="an"){	core="ian";	middle="an";	}
		else if(head=="i" && pinyin=="ang"){core="iang";middle="ang";	}
		else if(head=="i" && pinyin=="ong"){core="iong";middle="ong";	}
		else if (pinyin=="i"&&(initial=="c"||initial=="s"||initial=="z")){
											core="zcs";middle="zcs";	}
		else if (pinyin=="i"&&(initial.indexOf("ch")>-1||initial.indexOf("sh")>-1||initial.indexOf("zh")>-1||head=="ri")){
											core="zcsh";middle="zcsh";	}
		else if(head=="u" && pinyin=="a"){	core="a";	middle="a";		}
		else if(head=="u" && pinyin=="o"){	core="o";	middle="o";		}
		else if(head=="u" && pinyin=="ai"){	core="ai";	middle="ai";	}
		else if(head=="u" && pinyin=="ei"){	core="ei";	middle="ei";	}
		else if(head=="u" && pinyin=="an"){	core="an";	middle="an";	}
		else if(head=="u" && pinyin=="en"){	core="en";	middle="en";	}
		else if(head=="u" && pinyin=="ang"){core="ang";middle="ang";	}
		else if(head=="u" && pinyin=="eng"){core="eng";middle="eng";	}
		else if(pinyin=="a"){				core="a";	middle="a";		}
		else if(pinyin=="ai"){				core="ai";	middle="ai";	}
		else if(pinyin=="an"){				core="an";	middle="an";	}
		else if(pinyin=="ang"){				core="ang";	middle="ang";	}
		else if(pinyin=="ao"){				core="ao";	middle="ao";	}
		else if(pinyin=="o"){				core="o";	middle="o";		}
		else if(pinyin=="ou"){				core="ou";	middle="ou";	}
		else if(pinyin=="e"){				core="e";	middle="e";		}
		else if(pinyin=="ei"){				core="ei";	middle="ei";	}
		else if(pinyin=="en"){				core="en";	middle="en";	}
		else if(pinyin=="eng"){				core="eng";	middle="eng";	}
		else if(pinyin=="er"){				core="er";	middle="er";	}
		else if(pinyin=="ia"){				core="ia";	middle="a";		}
		else if(pinyin=="ian"){				core="ian";	middle="an";	}
		else if(pinyin=="iang"){			core="iang";middle="ang";	}
		else if(pinyin=="iao"){				core="iao";	middle="ao";	}
		else if(pinyin=="ie"){				core="ie";	middle="ie";	}
		else if(pinyin=="i"){				core="i";	middle="i";		}
		else if(pinyin=="in"){				core="in";	middle="in";	}
		else if(pinyin=="ing"){				core="ing";	middle="ing";	}
		else if(pinyin=="iong"){			core="iong";middle="ong";	}
		else if(pinyin=="iu"){				core="iu";	middle="iu";	}
		else if(pinyin=="v"){				core="v";	middle="v";		}
		else if(pinyin=="van"){				core="van";	middle="an";	}
		else if(pinyin=="ve"){				core="ve";	middle="ve";	}
		else if(pinyin=="vn"){				core="vn";	middle="vn";	}
		else if(pinyin=="ua"){				core="ua";	middle="a";		}
		else if(pinyin=="uai"){				core="uai";	middle="ai";	}
		else if(pinyin=="uan"){				core="uan";	middle="an";	}
		else if(pinyin=="uang"){			core="uang";middle="ang";	}
		else if(pinyin=="ui"){				core="ui";	middle="ei";	}
		else if(pinyin=="un"){				core="un";	middle="en";	}
		else if(pinyin=="uo"){				core="uo";	middle="o";		}
		else if(pinyin=="u"){				core="u";	middle="u";		}
		else if(pinyin=="ong"){				core="iong";middle="ong";	}

		token.core=core;
		token.middle=middle;
			
		if (pinyin.indexOf("ng")>-1){tail="ng";	}
		else if (pinyin.indexOf("er")>-1){tail="er";	}
		else if (pinyin=="i"&&(initial=="c"||initial=="s"||initial=="z")){tail="zcs";	}
		else if (pinyin=="i"&&(initial.indexOf("ch")>-1||initial.indexOf("sh")>-1||initial.indexOf("zh")>-1||head=="ri")){tail="zcsh";}
		else if (pinyin.indexOf("n")==pinyin.length-1){tail="n";	}
		else if (pinyin.indexOf("a")==pinyin.length-1){tail="a";	}
		else if (core=="uo"||core=="o"){tail="e";	}
		else if (pinyin.indexOf("o")==pinyin.length-1){tail="o";	}
		else if (pinyin.indexOf("e")==pinyin.length-1){tail="e";	}
		else if (pinyin.indexOf("ai")>-1){tail="aei";	}
		else if (pinyin.indexOf("ei")>-1){tail="aei";	}
		else if (pinyin.indexOf("ui")>-1){tail="aei";	}
		else if (pinyin.indexOf("i")==pinyin.length-1){tail="i";	}
		else if (pinyin.indexOf("u")==pinyin.length-1){tail="u";	}
		else if (pinyin.indexOf("v")==pinyin.length-1){tail="v";	}

		token.tail=tail;
		return ;
	};
}
