(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TIMELINE_DEFAULT_WIDTH=860,exports.TIMELINE_DEFAULT_ZOOM=.1,exports.TIMELINE_MIN_ZOOM=.00390625,exports.TIMELINE_MAX_ZOOM=.4,exports.TIMELINE_TICK_WIDTH=100,exports.TIMELINE_CANVAS_WIDTH=360,exports.TIMELINE_CANVAS_HEIGHT=90,exports.TIMELINE_CANVAS_LEVEL_WIDTH=2,exports.TIMELINE_CANVAS_LEVEL_HEIGHT=exports.TIMELINE_CANVAS_HEIGHT/100,exports.TIMELINE_CANVAS_LEVEL_MARGIN=1,exports.TIMELINE_CANVAS_LEVEL_STEP=exports.TIMELINE_CANVAS_LEVEL_WIDTH+exports.TIMELINE_CANVAS_LEVEL_MARGIN,exports.TIMELINE_CANVAS_LEVEL_COLOR="#c5cae9",exports.TIMELINE_CANVAS_RECORDED_LEVEL_COLOR="#4caf50",exports.KEYBOARD_ARROW_UP_KEY_CODE=38,exports.KEYBOARD_ARROW_RIGHT_KEY_CODE=39,exports.KEYBOARD_ARROW_DOWN_KEY_CODE=40,exports.KEYBOARD_ARROW_LEFT_KEY_CODE=37,exports.KEYBOARD_ENTER_KEY_CODE=13,exports.SCRIPT_PROCESSOR_BUFFER_SIZE=4096,exports.FIRST_LAYER_ID=5558112e5;
},{}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var message_type_1=require("./message-type"),callbacks={};exports.CallbackRegistry={register:function(e,s){callbacks[e]=s},call:function(e,s){var a=this;(0,callbacks[e])(s,function(s){a.postMessage(e,s)})},postMessage:function(e,s){postMessage({type:e,payload:s},void 0)},onRecordChange:function(e){this.postMessage(message_type_1.MessageType.ON_RECORD_CHANGE,e)},onLayerChange:function(e){this.postMessage(message_type_1.MessageType.ON_LAYER_CHANGE,e)},onHistoryChange:function(e){this.postMessage(message_type_1.MessageType.ON_HISTORY_CHANGE,e)}};
},{"./message-type":19}],3:[function(require,module,exports){
"use strict";function undo(){record_history_1.RecordHistory.rollback()}function redo(){record_history_1.RecordHistory.applyRollback()}Object.defineProperty(exports,"__esModule",{value:!0});var record_history_1=require("../history/record-history");exports.undo=undo,exports.redo=redo;
},{"../history/record-history":16}],4:[function(require,module,exports){
"use strict";function addLayer(e,r){record_factory_1.RecordFactory.createLayer(),r(record_store_1.RecordStore.record.getLayerIds())}function removeLayer(e,r){var o=record_store_1.RecordStore.record,t=o.getLayerById(e);record_history_1.RecordHistory.applyTransition(new remove_layer_transaction_1.RemoveLayerTransaction(o,t)),r(record_store_1.RecordStore.record.getLayerIds())}function setLayerVolume(e){record_store_1.RecordStore.record.getLayerById(e.layerId).volume=e.volume}function getLayerLevels(e,r){r(record_store_1.RecordStore.record.getLayerById(e.layerId).getLevels(helpers_1.convertMillisecondsToFloat32ArrayIndex(e.startPosition),helpers_1.convertMillisecondsToFloat32ArrayIndex(e.length),helpers_1.convertMillisecondsToFloat32ArrayIndex(e.step)))}Object.defineProperty(exports,"__esModule",{value:!0});var record_store_1=require("../record.store"),record_history_1=require("../history/record-history"),record_factory_1=require("../factories/record.factory"),remove_layer_transaction_1=require("../history/remove-layer-transaction"),helpers_1=require("../helpers");exports.addLayer=addLayer,exports.removeLayer=removeLayer,exports.setLayerVolume=setLayerVolume,exports.getLayerLevels=getLayerLevels;
},{"../factories/record.factory":12,"../helpers":13,"../history/record-history":16,"../history/remove-layer-transaction":17,"../record.store":21}],5:[function(require,module,exports){
"use strict";function getRecordData(e,r){r(record_store_1.RecordStore.record.getData(helpers_1.convertMillisecondsToFloat32ArrayIndex(e)))}function getCompiledRecord(e,r){var o=record_store_1.RecordStore.record.getData(0);r(compile_1.compile(o))}function getRecordLength(e,r){r(record_store_1.RecordStore.record.endPositionInMilliseconds)}Object.defineProperty(exports,"__esModule",{value:!0});var helpers_1=require("../helpers"),record_store_1=require("../record.store"),compile_1=require("../compile");exports.getRecordData=getRecordData,exports.getCompiledRecord=getCompiledRecord,exports.getRecordLength=getRecordLength;
},{"../compile":7,"../helpers":13,"../record.store":21}],6:[function(require,module,exports){
"use strict";function startRecording(r){record_store_1.RecordStore.startRecording(r)}function stopRecording(r,e){record_store_1.RecordStore.recording.stop(),e(record_store_1.RecordStore.recording.sample.sampleData)}function addRecordingProgress(r,e){record_store_1.RecordStore.recording.sample.appendData(r),e(record_store_1.RecordStore.recording.getLevels())}Object.defineProperty(exports,"__esModule",{value:!0});var record_store_1=require("../record.store");exports.startRecording=startRecording,exports.stopRecording=stopRecording,exports.addRecordingProgress=addRecordingProgress;
},{"../record.store":21}],7:[function(require,module,exports){
"use strict";function compile(e){isCompilerNotLoaded()&&loadCompiler();var o,r=self.lamejs,t=new r.Mp3Encoder(1,44100,128),n=[],a=new Int16Array(e.length),i=new DataView(a.buffer);floatTo16BitPcm(i,0,e),a=new Int16Array(i.buffer);for(var l=0;l<a.length;l+=1152)o=t.encodeBuffer(a.subarray(l,l+1152)),o.length>0&&n.push(o);return o=t.flush(),o.length>0&&n.push(new Int8Array(o)),n}function floatTo16BitPcm(e,o,r){for(var t,n=r.length,a=0;a<n;a++,o+=2)t=Math.max(-1,Math.min(1,r[a])),e.setInt16(o,t<0?32768*t:32767*t,!0)}function isCompilerNotLoaded(){return!1===compilerIsLoaded}function loadCompiler(){importScripts("compiler.js"),compilerIsLoaded=!0}Object.defineProperty(exports,"__esModule",{value:!0});var compilerIsLoaded=!1;exports.compile=compile;
},{}],8:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var helpers_1=require("../helpers"),callback_registry_1=require("../callback-registry"),Layer=function(){function t(t,e){void 0===e&&(e=Date.now()),this.record=t,this.id=e,this.samples=[],this.data=new Float32Array(0),this.endPosition=0,this.volume=1}return Object.defineProperty(t.prototype,"layerData",{get:function(){var t=helpers_1.convertFloat32ArrayIndexToMilliseconds(this.endPosition);return{layerId:this.id,length:t}},enumerable:!0,configurable:!0}),t.prototype.getResultingData=function(t){var e=this.data.slice(t);return 1===this.volume?e:helpers_1.mute(e,this.volume)},t.prototype.getLevels=function(t,e,r){return helpers_1.sliceFloat32Array(this.data,r,t,t+e).map(helpers_1.convertFloat32ArrayToLevel)},t.prototype.popSample=function(){var t=this.samples.pop();return this.update(),t},t.prototype.addSample=function(t){this.samples.push(t),this.update()},t.prototype.update=function(){this.updateEndPosition(),this.updateData(),this.record.onLayerUpdate(this),callback_registry_1.CallbackRegistry.onLayerChange(this.layerData)},t.prototype.updateData=function(){var t=new Float32Array(this.endPosition);this.samples.forEach(function(e){return t.set(e.data,e.startPosition)}),this.data=t},t.prototype.updateEndPosition=function(){this.endPosition=this.getSamplesEndPosition()},t.prototype.getSamplesEndPosition=function(){return this.samples.reduce(function(t,e){return e.endPosition>t?e.endPosition:t},0)},t}();exports.Layer=Layer;
},{"../callback-registry":2,"../helpers":13}],9:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var layer_1=require("./layer"),helpers_1=require("../helpers"),callback_registry_1=require("../callback-registry"),constants_1=require("../../../src/app/constants"),Record=function(){function e(){this.layers=[],this.endPosition=0,this.layers.push(new layer_1.Layer(this,constants_1.FIRST_LAYER_ID))}return Object.defineProperty(e.prototype,"endPositionInMilliseconds",{get:function(){return helpers_1.convertFloat32ArrayIndexToMilliseconds(this.endPosition)},enumerable:!0,configurable:!0}),e.prototype.getLayerById=function(e){for(var t=0,r=this.layers;t<r.length;t++){var n=r[t];if(n.id===e)return n}},e.prototype.getData=function(e){var t=this.layers.filter(function(e){return e.volume}).map(function(t){return t.getResultingData(e)}).filter(function(e){return e.length>0});switch(t.length){case 0:return new Float32Array(0);case 1:return t[0];default:return this.mergeLayersData(t)}},e.prototype.mergeLayersData=function(e){for(var t=helpers_1.getMaxPropertyValue(e,"length"),r=new Float32Array(t),n=0;n<t;++n){for(var o=0,a=0,i=e;a<i.length;a++){o+=i[a][n]||0}r[n]=o}return r},e.prototype.popLayer=function(){var e=this.layers.pop();return this.update(),e},e.prototype.addLayer=function(e){this.layers.push(e),this.update()},e.prototype.removeLayer=function(e){this.layers.splice(e,1),this.update()},e.prototype.returnLayer=function(e,t){this.layers.splice(t,0,e),this.update()},e.prototype.onLayerUpdate=function(e){this.update()},e.prototype.getLayerIds=function(){return this.layers.map(function(e){return e.id})},e.prototype.update=function(){this.endPosition=helpers_1.getMaxPropertyValue(this.layers,"endPosition"),callback_registry_1.CallbackRegistry.onRecordChange(this.recordData)},Object.defineProperty(e.prototype,"recordData",{get:function(){return{layerIds:this.getLayerIds(),length:this.endPositionInMilliseconds}},enumerable:!0,configurable:!0}),e}();exports.Record=Record;
},{"../../../src/app/constants":1,"../callback-registry":2,"../helpers":13,"./layer":8}],10:[function(require,module,exports){
"use strict";function convertLevelsToTimelineCanvasLevels(e,t,s,r){return e.map(function(e,o){var i=s+o*r;return{layerId:t,startPosition:i,endPosition:i+r,level:e}})}Object.defineProperty(exports,"__esModule",{value:!0});var helpers_1=require("../helpers"),record_factory_1=require("../factories/record.factory"),Recording=function(){function e(e){this.config=e,this.lastLevelsIndex=0,this.step=helpers_1.convertMillisecondsToFloat32ArrayIndex(e.step),this.sample=record_factory_1.RecordFactory.createSample(e.layerId,helpers_1.convertMillisecondsToFloat32ArrayIndex(e.position))}return e.prototype.stop=function(){this.sample.finish(),record_factory_1.RecordFactory.addSampleToLayer(this.sample)},e.prototype.getLevels=function(){var e=helpers_1.getLevels(this.sample.data,this.step,this.lastLevelsIndex,this.sample.length),t=this.sample.layerId,s=helpers_1.convertFloat32ArrayIndexToMilliseconds(this.lastLevelsIndex)+this.config.position;return this.lastLevelsIndex=this.lastLevelsIndex+e.length*this.step,convertLevelsToTimelineCanvasLevels(e,t,s,this.config.step)},e}();exports.Recording=Recording;
},{"../factories/record.factory":12,"../helpers":13}],11:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var helpers_1=require("../helpers"),DATA_SIZE_INCREASING_STEP=44100,Sample=function(){function t(t,e){this.layerId=t,this.startPosition=e,this.data=new Float32Array(0),this.endPosition=this.startPosition,this.length=0}return t.prototype.appendData=function(t){this.shouldDataSizeIncrease(t)&&this.increaseDataSize(),this.data.set(t,this.length),this.length+=t.length,this.endPosition+=t.length},t.prototype.shouldDataSizeIncrease=function(t){return this.length+t.length>this.data.length},t.prototype.increaseDataSize=function(){var t=new Float32Array(this.data.length+DATA_SIZE_INCREASING_STEP);t.set(this.data),this.data=t},t.prototype.finish=function(){this.removeUnnecessaryData()},t.prototype.removeUnnecessaryData=function(){this.data=this.data.subarray(0,this.length)},Object.defineProperty(t.prototype,"sampleData",{get:function(){return{layerId:this.layerId,startPosition:helpers_1.convertFloat32ArrayIndexToMilliseconds(this.startPosition),endPosition:helpers_1.convertFloat32ArrayIndexToMilliseconds(this.endPosition)}},enumerable:!0,configurable:!0}),t}();exports.Sample=Sample;
},{"../helpers":13}],12:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var add_layer_transaction_1=require("../history/add-layer-transaction"),layer_1=require("../entities/layer"),record_store_1=require("../record.store"),record_history_1=require("../history/record-history"),sample_1=require("../entities/sample"),app_sample_transaction_1=require("../history/app-sample-transaction");exports.RecordFactory={createLayer:function(){var r=record_store_1.RecordStore.record,e=new layer_1.Layer(r);return record_history_1.RecordHistory.applyTransition(new add_layer_transaction_1.AddLayerTransaction(r,e)),e},createSample:function(r,e){return new sample_1.Sample(r,e)},addSampleToLayer:function(r){var e=record_store_1.RecordStore.record.getLayerById(r.layerId);record_history_1.RecordHistory.applyTransition(new app_sample_transaction_1.AddSampleTransaction(e,r))}};
},{"../entities/layer":8,"../entities/sample":11,"../history/add-layer-transaction":14,"../history/app-sample-transaction":15,"../history/record-history":16,"../record.store":21}],13:[function(require,module,exports){
"use strict";function getMaxPropertyValue(e,r){for(var t=0,o=0,n=e;o<n.length;o++){var a=n[o];a[r]>t&&(t=a[r])}return t}function getMaxValue(e){for(var r=0,t=0,o=e;t<o.length;t++){var n=o[t];n>r&&(r=n)}return r}function convertFloat32ArrayToLevel(e){for(var r=0,t=0;t<e.length;t+=8){var o=Math.abs(e[t]);o>r&&(r=o)}return Math.round(100*r)}function roundValue(e,r){return Math.round(e/r)*r}function convertMillisecondsToFloat32ArrayIndex(e){return Math.round(44.1*e)}function convertFloat32ArrayIndexToMilliseconds(e){return Math.round(e/44.1)}function getLevels(e,r,t,o){return void 0===t&&(t=0),void 0===o&&(o=e.length),sliceFloat32Array(e,r,t,o).map(convertFloat32ArrayToLevel)}function sliceFloat32Array(e,r,t,o){void 0===t&&(t=0),void 0===o&&(o=e.length);for(var n=[],a=t;a<o;a+=r)n.push(e.slice(a,a+r));return n}function mute(e,r){var t=new Float32Array(e.length);return e.forEach(function(e,o){return t[o]=e*r}),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.getMaxPropertyValue=getMaxPropertyValue,exports.getMaxValue=getMaxValue,exports.convertFloat32ArrayToLevel=convertFloat32ArrayToLevel,exports.roundValue=roundValue,exports.convertMillisecondsToFloat32ArrayIndex=convertMillisecondsToFloat32ArrayIndex,exports.convertFloat32ArrayIndexToMilliseconds=convertFloat32ArrayIndexToMilliseconds,exports.getLevels=getLevels,exports.sliceFloat32Array=sliceFloat32Array,exports.mute=mute;
},{}],14:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var AddLayerTransaction=function(){function r(r,e){this.record=r,this.layer=e}return r.prototype.apply=function(){this.record.addLayer(this.layer)},r.prototype.rollback=function(){this.record.popLayer()},r}();exports.AddLayerTransaction=AddLayerTransaction;
},{}],15:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var AddSampleTransaction=function(){function e(e,t){this.layer=e,this.sample=t}return e.prototype.apply=function(){this.layer.addSample(this.sample)},e.prototype.rollback=function(){this.layer.popSample()},e}();exports.AddSampleTransaction=AddSampleTransaction;
},{}],16:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var callback_registry_1=require("../callback-registry"),appliedTransactions=[],rollbackTransactions=[];exports.RecordHistory={applyTransition:function(a){a.apply(),appliedTransactions.push(a),rollbackTransactions.length=0,this.change()},rollback:function(){var a=appliedTransactions.pop();a&&(a.rollback(),rollbackTransactions.push(a),this.change())},applyRollback:function(){var a=rollbackTransactions.pop();a&&(a.apply(),appliedTransactions.push(a),this.change())},change:function(){callback_registry_1.CallbackRegistry.onHistoryChange({appliedTransactionsNumber:appliedTransactions.length,rollbackTransactionsNumber:rollbackTransactions.length})}};
},{"../callback-registry":2}],17:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var RemoveLayerTransaction=function(){function e(e,r){this.record=e,this.layer=r,this.layerIndex=this.record.layers.indexOf(this.layer)}return e.prototype.apply=function(){this.record.removeLayer(this.layerIndex)},e.prototype.rollback=function(){this.record.returnLayer(this.layer,this.layerIndex)},e}();exports.RemoveLayerTransaction=RemoveLayerTransaction;
},{}],18:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var message_type_1=require("./message-type"),callback_registry_1=require("./callback-registry"),recording_1=require("./callbacks/recording"),layer_1=require("./callbacks/layer"),record_1=require("./callbacks/record"),history_1=require("./callbacks/history");require("./polyfills"),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.GET_RECORD_LENGTH,record_1.getRecordLength),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.START_RECORDING,recording_1.startRecording),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.STOP_RECORDING,recording_1.stopRecording),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.ADD_RECORDING_PROGRESS,recording_1.addRecordingProgress),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.ADD_LAYER,layer_1.addLayer),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.REMOVE_LAYER,layer_1.removeLayer),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.GET_LEVELS,layer_1.getLayerLevels),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.GET_RECORD_DATA,record_1.getRecordData),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.GET_COMPILED_RECORD,record_1.getCompiledRecord),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.SET_LAYER_VOLUME,layer_1.setLayerVolume),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.UNDO,history_1.undo),callback_registry_1.CallbackRegistry.register(message_type_1.MessageType.REDO,history_1.redo),addEventListener("message",function(e){callback_registry_1.CallbackRegistry.call(e.data.type,e.data.payload)});
},{"./callback-registry":2,"./callbacks/history":3,"./callbacks/layer":4,"./callbacks/record":5,"./callbacks/recording":6,"./message-type":19,"./polyfills":20}],19:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var MessageType;!function(E){E[E.ADD_RECORDING_PROGRESS=0]="ADD_RECORDING_PROGRESS",E[E.ADD_LAYER=1]="ADD_LAYER",E[E.REMOVE_LAYER=2]="REMOVE_LAYER",E[E.GET_LEVELS=3]="GET_LEVELS",E[E.START_RECORDING=4]="START_RECORDING",E[E.STOP_RECORDING=5]="STOP_RECORDING",E[E.GET_RECORD_DATA=6]="GET_RECORD_DATA",E[E.GET_COMPILED_RECORD=7]="GET_COMPILED_RECORD",E[E.SET_LAYER_VOLUME=8]="SET_LAYER_VOLUME",E[E.GET_RECORD_LENGTH=9]="GET_RECORD_LENGTH",E[E.UNDO=10]="UNDO",E[E.REDO=11]="REDO",E[E.ON_LAYER_CHANGE=12]="ON_LAYER_CHANGE",E[E.ON_RECORD_CHANGE=13]="ON_RECORD_CHANGE",E[E.ON_HISTORY_CHANGE=14]="ON_HISTORY_CHANGE"}(MessageType=exports.MessageType||(exports.MessageType={}));
},{}],20:[function(require,module,exports){
Float32Array.prototype.slice||Object.defineProperty(Float32Array.prototype,"slice",{value:Array.prototype.slice});
},{}],21:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var recording_1=require("./entities/recording"),record_1=require("./entities/record");exports.RecordStore={record:new record_1.Record,recording:null,startRecording:function(e){this.recording=new recording_1.Recording(e)}};
},{"./entities/record":9,"./entities/recording":10}]},{},[18]);
