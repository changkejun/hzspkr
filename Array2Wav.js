var Array2Wav=new function(){
	// バイト配列に文字列を書き込む
	this.writeString=function(bytes, val, offset) {
	    for (var i = 0, l = val.length; i < l; i++) {
	        bytes[offset + i] = val.charCodeAt(i);
	    }
	};

	// バイト配列に 32-bit 整数を書き込む
	this.writeInt32=function(bytes, val, offset) {
	    bytes[offset] = val & 255;
	    val >>>= 8;
	    bytes[offset + 1] = val & 255;
	    val >>>= 8;
	    bytes[offset + 2] = val & 255;
	    val >>>= 8;
	    bytes[offset + 3] = val & 255;
	};

	// バイト配列に 16-bit 整数を書き込む
	this.writeInt16=function(bytes, val, offset) {
	    bytes[offset] = val & 255;
	    val >>>= 8;
	    bytes[offset + 1] = val & 255;
	};

	// -----------------------------------------------------------------------------
	this.fire=function(array){
		var size = array.length*2;// データサイズ (byte)
		var channel = 1;         // チャンネル数 (1:モノラル or 2:ステレオ)
		var bytesPerSec = 44100; // サンプリングレート
		var bitsPerSample = 16;  // サンプルあたりのビット数 (8 or 16)

		var offset = 44;         // ヘッダ部分のサイズ
	
		// バイト配列を作成
		var bytes = new Uint8Array(offset + size);
		// ヘッダ書き込み
		this.writeString(bytes, 'RIFF', 0);                 // RIFF ヘッダ
		this.writeInt32(bytes, offset + size - 8, 4);       // ファイルサイズ - 8
		this.writeString(bytes, 'WAVE', 8);                 // WAVE ヘッダ
		this.writeString(bytes, 'fmt ', 12);                // fmt チャンク
		this.writeInt32(bytes, 16, 16);                     // fmt チャンクのバイト数
		this.writeInt16(bytes, 1, 20);                      // フォーマットID
		this.writeInt16(bytes, channel, 22);                // チャンネル数
		this.writeInt32(bytes, bytesPerSec, 24);            // サンプリングレート
		this.writeInt32(bytes, bytesPerSec * (bitsPerSample >>> 3) * channel, 28); // データ速度
		this.writeInt16(bytes, (bitsPerSample >>> 3) * channel, 32); // ブロックサイズ
		this.writeInt16(bytes, bitsPerSample, 34);          // サンプルあたりのビット数
		this.writeString(bytes, 'data', 36);                // data チャンク
		this.writeInt32(bytes, size, 40);                   // 波形データのバイト数

		// 波形データ書き込み (サイン波)
		var i;
		for (i = 0; i < array.length; i ++) {
		    this.writeInt16(bytes, array[i], offset + i*2);
		}

		// バイト配列を文字列に変換
		var temp = '';
		for (i = 0; i < bytes.length; i++) {
		    temp += String.fromCharCode(bytes[i]);
		}

		// 文字列を Data URI に変換
		var datauri = 'data:audio/wav;base64,' + btoa(temp);
		
		return datauri;
	};

}
