import { ref, onUnmounted } from "vue";


/**
 *  创建一个worker实例
 **/
const createWorker = (workerScript)=>{
	const blob =new Blob([`(${workerScript.toString()})()`],{type:"text/javascript"});
	const url = window.URL.createObjectURL(blob);
	return new Worker(url);
}


/**
 * WebWorker hooks
 * @example
 * 		import { useWebWorker } from "@daoxin/vue-hooks"
 * 		const workerScript = function(){
 * 			self.onmessage = function(e){
 * 				self.postMessage(`Worker received:${e.data}`)
 * 			}
 * 		}
 * 
 * 		const { postMessage,mesage,error } = useWebWorker(workerScript)
 * 
 * 
 * 		<button @click="postMessage('Hello Worker!')">发送消息</button>
 * 		<div>{{mesasge}}</div>
 * 		<div>{{error}}</div>
 */
export function useWebWorker(workerScript){
	const worker = ref(createWorker(workerScript));
	const message = ref(null);
	const error = ref(null)

	worker.value.onmessage = (e) => {
		message.value = e.data;
		error.value = null;
	}

	worker.value.onerror = (e) => {
		message.value = null;
		error.value = e;
	}

	const postMessage = (msg) => {
		worker.value.postMessage(msg);
	}

	// 卸载
	onUnmounted(()=>{
		worker.value.terminate();
	})

	return { postMessage, message, error}

}