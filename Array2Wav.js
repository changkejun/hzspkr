var Array2Wav=new function(){
	// �o�C�g�z��ɕ��������������
	this.writeString=function(bytes, val, offset) {
	    for (var i = 0, l = val.length; i < l; i++) {
	        bytes[offset + i] = val.charCodeAt(i);
	    }
	};

	// �o�C�g�z��� 32-bit ��������������
	this.writeInt32=function(bytes, val, offset) {
	    bytes[offset] = val & 255;
	    val >>>= 8;
	    bytes[offset + 1] = val & 255;
	    val >>>= 8;
	    bytes[offset + 2] = val & 255;
	    val >>>= 8;
	    bytes[offset + 3] = val & 255;
	};

	// �o�C�g�z��� 16-bit ��������������
	this.writeInt16=function(bytes, val, offset) {
	    bytes[offset] = val & 255;
	    val >>>= 8;
	    bytes[offset + 1] = val & 255;
	};

	// -----------------------------------------------------------------------------
	this.fire=function(array){
		var size = array.length*2;// �f�[�^�T�C�Y (byte)
		var channel = 1;         // �`�����l���� (1:���m���� or 2:�X�e���I)
		var bytesPerSec = 44100; // �T���v�����O���[�g
		var bitsPerSample = 16;  // �T���v��������̃r�b�g�� (8 or 16)

		var offset = 44;         // �w�b�_�����̃T�C�Y
	
		// �o�C�g�z����쐬
		var bytes = new Uint8Array(offset + size);
		// �w�b�_��������
		this.writeString(bytes, 'RIFF', 0);                 // RIFF �w�b�_
		this.writeInt32(bytes, offset + size - 8, 4);       // �t�@�C���T�C�Y - 8
		this.writeString(bytes, 'WAVE', 8);                 // WAVE �w�b�_
		this.writeString(bytes, 'fmt ', 12);                // fmt �`�����N
		this.writeInt32(bytes, 16, 16);                     // fmt �`�����N�̃o�C�g��
		this.writeInt16(bytes, 1, 20);                      // �t�H�[�}�b�gID
		this.writeInt16(bytes, channel, 22);                // �`�����l����
		this.writeInt32(bytes, bytesPerSec, 24);            // �T���v�����O���[�g
		this.writeInt32(bytes, bytesPerSec * (bitsPerSample >>> 3) * channel, 28); // �f�[�^���x
		this.writeInt16(bytes, (bitsPerSample >>> 3) * channel, 32); // �u���b�N�T�C�Y
		this.writeInt16(bytes, bitsPerSample, 34);          // �T���v��������̃r�b�g��
		this.writeString(bytes, 'data', 36);                // data �`�����N
		this.writeInt32(bytes, size, 40);                   // �g�`�f�[�^�̃o�C�g��

		// �g�`�f�[�^�������� (�T�C���g)
		var i;
		for (i = 0; i < array.length; i ++) {
		    this.writeInt16(bytes, array[i], offset + i*2);
		}

		// �o�C�g�z��𕶎���ɕϊ�
		var temp = '';
		for (i = 0; i < bytes.length; i++) {
		    temp += String.fromCharCode(bytes[i]);
		}

		// ������� Data URI �ɕϊ�
		var datauri = 'data:audio/wav;base64,' + btoa(temp);
		
		return datauri;
	};

}
