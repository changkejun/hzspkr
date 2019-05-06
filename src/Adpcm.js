var Adpcm=new function(){
	/* Intel ADPCM step variation table */
	this.indexTable=[-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];
	this.stepsizeTable=[
		7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
		19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
		50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
		130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
		337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
		876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
		2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
		5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
		15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767];
	/*暗号化*/
	this.adpcm_coder=function(indata,valpred,index){
	    //indataの入力は、short単位、つまりintのまま、byteではない
		var outdata=[];
		
		var val;				/* Current input sample value */
		var sign;				/* Current adpcm sign bit */
		var delta;				/* Current adpcm output value */
		var diff;				/* Difference between val and valprev */
		var udiff;				/* unsigned value of diff */
		var step;				/* Stepsize */
		var vpdiff;				/* Current change to valpred */
		var outputbuffer = 0;	/* place to keep previous 4-bit value */
		var bufferstep;			/* toggle between outputbuffer/output */    

		step = this.stepsizeTable[index];

		bufferstep = false;
		var len=indata.length;

		var j=0;
		for (var i=0;i<len;i++){
			val = indata[j];j++;

			/* Step 1 - compute difference with previous value */
			diff = val - valpred;
			if(diff < 0){
				sign = 8;
				diff = (-diff);
			}else{
				sign = 0;
			}
			/* diff will be positive at this point */
			udiff = diff;

			/* Step 2 - Divide and clamp */
			/* Note:
			** This code *approximately* computes:
			**    delta = diff*4/step;
			**    vpdiff = (delta+0.5)*step/4;
			** but in shift step bits are dropped. The net result of this is
			** that even if you have fast mul/div hardware you cannot put it to
			** good use since the fixup would be too expensive.
			*/
			delta = 0;
			vpdiff = (step >> 3);

			if ( udiff >= step ) {
				delta = 4;
				udiff -= step;
				vpdiff += step;
			}
			step >>= 1;
			if ( udiff >= step  ) {
				delta |= 2;
				udiff -= step;
				vpdiff += step;
			}
			step >>= 1;
			if ( udiff >= step ) {
				delta |= 1;
				vpdiff += step;
			}

			/* Phil Frisbie combined steps 3 and 4 */
			/* Step 3 - Update previous value */
			/* Step 4 - Clamp previous value to 16 bits */
			if ( sign != 0 ) {
				valpred -= vpdiff;
				if ( valpred < -32768 )
					valpred = -32768;
			}else{
				valpred += vpdiff;
				if ( valpred > 32767 )
					valpred = 32767;
			}

			/* Step 5 - Assemble value, update index and step values */
			delta |= sign;

			index += this.indexTable[delta];
			if ( index < 0 ) index = 0;
			if ( index > 88 ) index = 88;
			step = this.stepsizeTable[index];

			/* Step 6 - Output value */
			if ( bufferstep != true ) {
				outputbuffer = (delta << 4);
			} else {
				outdata.push(delta | outputbuffer);
			}
			bufferstep = !bufferstep;
		}

		/* Output last step, if needed */
		if ( bufferstep == true ) {
			outdata.push(outputbuffer);
		}
		var bytes=outdata;
		outdata=[];
		var outdataLength=parseInt(bytes.length/2);
		for( var i = 0; i < outdataLength; i++ ) {
			outdata.push( ((bytes[i*2+1]<<24)>>16) | bytes[i*2] );
		}

		return outdata;
	};
	/*復号化*/
	this.adpcm_decoder=function(indata,valpred,index){

		var bytes = [];
		for (var i=0; i<indata.length;i++){
			var data=indata[i];
			var small=(data<<24)>>>24;
			var big=(data<<16)>>>24;
			bytes.push(small);
			bytes.push(big);
		}
		
		var indata=bytes;
	
		var outdata=[];
		var sign;				/* Current adpcm sign bit */
		var delta;				/* Current adpcm output value */
		var step;				/* Stepsize */
		var vpdiff;				/* Current change to valpred */
		var inputbuffer = 0;	/* place to keep next 4-bit value */
		var bufferstep;			/* toggle between inputbuffer/input */

		step = this.stepsizeTable[index];
		bufferstep = true;
		var len=indata.length*2;

		var j=0;

		for (var i=0;i<len;i++){
			/* Step 1 - get the delta value */
			if ( bufferstep != true ) {
				delta = inputbuffer & 0xf;
			} else {
				inputbuffer = indata[j];j++;
				delta = (inputbuffer >> 4);
			}
			bufferstep = !bufferstep;

			/* Step 2 - Find new index value (for later) */
			index += this.indexTable[delta];
			if ( index < 0 ) index = 0;
			if ( index > 88 ) index = 88;

			/* Step 3 - Separate sign and magnitude */
			sign = delta & 8;
			delta = delta & 7;

			/* Phil Frisbie combined steps 4 and 5 */
			/* Step 4 - Compute difference and new predicted value */
			/* Step 5 - clamp output value */
			/*
			** Computes 'vpdiff = (delta+0.5)*step/4', but see comment
			** in adpcm_coder.
			*/
			vpdiff = step >> 3;
			if ( (delta & 4) != 0 ) vpdiff += step;
			if ( (delta & 2) != 0 ) vpdiff += step>>1;
			if ( (delta & 1) != 0 ) vpdiff += step>>2;

			if ( sign != 0 ){
				valpred -= vpdiff;
				if ( valpred < -32768 )
					valpred = -32768;
			}else{
				valpred += vpdiff;
				if ( valpred > 32767 )
					valpred = 32767;
			}

			/* Step 6 - Update step value */
			step = this.stepsizeTable[index];

			/* Step 7 - Output value */
			outdata.push(valpred);
		}

		return outdata;

	};
}
