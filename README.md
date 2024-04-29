# promise-supports-suspense

##功能描述
将 Promise 转为 Suspense 支持的 数据结构
Translate the Promise into a data structure that supports Suspense.

##使用步骤 1.确保项目安装了 axios 2.确保项目支持 typescript

wrapPromise 的工作机制:

接收 Promise 作为参数

当 Promise resolved , 返回 resolved value

当 Promise rejected , 返回 rejected value

当 Promise pending , 返回 Promise 这个对象

暴露一个对应的 read 方法, 来读取 Promise 的状态

实现原理:

suspense 内部有对内部组件状态的捕获机制, 如果是等待或者出现错误, 直接 throw 即可

如果 Promise 有数据就正常返回即可
如果 Promise 有数据就正常返回即可

```tsx
function wrapPromise(promise: Primise<any>) {
  //设置两个变量, 一个是表示当前状态的变量, 一个是结果变量
  let status = "pending";
  let result: amy;
  //利用传入的promise改变自身状态
  suspender = promise.then(
    (r) => {
      (status = "success"), (result = r);
    },
    (e) => {
      (status = "error"), (result = e);
    }
  );
  return {
    //将read包裹在对象中暴露出去
    read() {
      if (status === "pending") throw suspender;
      else if (status === "error") throw result;
      else if (status === "success") return result;
    },
  };
}

export default function fetchData(url: string) {
  promise = axios.get(url).then((res) => res.data);
  return wrapPromise(promise);
}
```

下面是使用该转换器的案例

这个是 DogPic.tsx

```tsx
import React, { FC } from "react";
import fetchData from "./fetchData";
const data = fetchData("https://dog.ceo/api/breeds/image/random");
const DogPic: FC = () => {
  const dogData = data.read();
  return <image src={dogData.message}></image>;
};
export default DogPic;
```

这个是 App.tsx

```tsx
import {FC}, Suspense from 'react'
import DogPic from './DogPic'

const App:FC = () => {
    return (
    <Suspense fallback={<h2>fetching your dog</h2>}
    <DogPic/>
   	</Suspense>

    )
}
```
