var fenci={};
fenci.name="fenci";
fenci.paramsFormat={};
fenci.fire=function(params){
	var folders=file.list("",true);
	for(var fdidx=0;fdidx<folders.length;fdidx++){
		var folder=folders[fdidx].name;
		if (folder=="output") continue;
		if (folder=="error") continue;
		
		var files=file.list(folder,true);
		for(var flidx=0;flidx<files.length;flidx++){
			var srcpathname=folder+"/"+files[flidx].name;
			var destpath="output"+"/"+folder;
			var destpathname="output"+"/"+folder+"/"+files[flidx].name;
			var errorpathname="error"+"/"+files[flidx].name;
			try{
				
				var words=Packages.org.apdplat.word.WordSegmenter.segWithStopWords(file.readAllLines(srcpathname));
				var ary=[];
				for (var i=0;i<words.size();i++){
					var v=""+words[i];
					v=v.replace(/[a-z/]*/g,"");
					ary.push(v);
				}
				file.makeDir(destpath);
				file.makeFile(destpathname);
				file.writeAllLines(destpathname,ary.join(" "));
				file.remove(srcpathname);
			}catch(e){
				file.duplicate(srcpathname,errorpathname);
				file.remove(srcpathname);
			}
		}
	}
	
	return (new Result()).alert("OVER");
};


