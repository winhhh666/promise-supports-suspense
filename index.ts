function wrapPromise(promise: Promise<any>) {
	//设置两个变量, 一个是表示当前状态的变量, 一个是结果变量
    let status = 'pending'
    let result : any;
    //利用传入的promise改变自身状态
    const suspender = promise.then((r) => {
        status = 'success',
        result = r
    }, (e) => {
        status = 'error',
        result = e
    })
    return({
        //将read包裹在对象中暴露出去
        read() {
            if(status === 'pending') throw suspender
            else if(status === 'error') throw result
            else if(status === 'success') return result
        }
    })
}

export default function fetchData(url: string) {
	const promise = axios.get(url).then(res => res.data)
    return wrapPromise(promise)
}