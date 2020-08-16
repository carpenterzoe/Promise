const resolvePromise = (promise2, x, resolve, reject) => {

  // 判断x的状态

}

class Promise {
  constructor(executor) {
    // * 参数校验
    if (typeof executor !== 'function') {
      throw new Error(`Promise resolver ${executor} is not a function`)
    }

    this.initValue()
    this.initBind()

    // try catch 捕获的是同步异常 ???
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)    // 让 new Promise中的异常能够被reject拿到
    }
  }

  // * 将函数调用的this一直指向当前实例
  initBind() {
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  initValue() {
    this.value = null       // * 终值
    this.reason = null      // * 拒因
    this.state = Promise.PENDING  // * promise状态
    this.onFulfilledCallbacks = []
    this.ononRejectedCallbacks = []
  }
  
  // * 成功后的一系列操作 (promise状态的改变，成功回调的执行)
  resolve(value) {
    if (this.state === Promise.PENDING) {
      this.state = Promise.FULFILLED
      this.value = value

      this.onFulfilledCallbacks.forEach((fn) => fn(this.value))
    }
  }

  // * 失败后的一系列操作 (promise状态的改变，失败回调的执行)
  reject(reason) {
    if (this.state === Promise.PENDING) {
      this.state = Promise.REJECTED
      this.reason = reason

      this.onRejectedCallbacks.forEach((fn) => fn(this.reason))
    }
  }

  then(onFulfilled, onRejected) {

    // * 根据promise/A+ 规范，then的两个参数必须是函数
    // * 如果不是，这里处理一层，把结果包裹成函数返回
    if (typeof onFulfilled !== 'function') {
      onFulfilled = function(value) {
        return value
      }
    }

    if (typeof onRejected !== 'function') {
      onRejected = function(reason) {
        throw reason
      }
    }

    let promise2 = new Promise((resolve, reject) => {
      
      // !!! 这里面的内容，也是 class中  executor 的内容
      // !!! 只不过内部执行时有异步，导致异常无法在捕获executor时捕获  

      // 把原有的then里面 不同状态的处理，放到新的promise中
      // 这样在后面的then中，可以拿到这个then resolve 或 reject的值，实现链式调用
      if (this.state === Promise.FULFILLED) {

        // * 处理 .then 使其不能在new Promise之后就立即同步执行
        // * 而是必须等第一梯队的事件处理完了，第二轮拿到resolve的值 才执行 onFulfilled 成功回调
        // ? 这种处理只有在 resolve() 没有异步执行的时候才生效 ?????

        setTimeout(() => {

          // 链式调用的异常由于是异步的，无法被Class内部 new Promise的try catch捕获
          // 所以只能在内部的setTimeout中再包裹一层try catch

          try {

            let x = onFulfilled(this.value)
            // resolve(x)     // x可能是普通值，也可能是promise 所以不能直接resolve

            // 如果没有定时器,  这里promise2 拿不到值
            // 因为 new Promise立即执行了，此时还没赋值给前文声明的promise2 
            resolvePromise(promise2, x, resolve, reject)
            // resolvePromise 作用 --- 判断 x 的值 => 推导 promise2的状态
            
          } catch(e) {
            reject(e)
          }
        })
      }
  
      if (this.state === Promise.REJECTED) {
        // * 这里跟上面 onFulfilled 处理同理
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        })
      }
  
      if (this.state === Promise.PENDING) {
        this.onFulfilledCallbacks.push((value) => {
          setTimeout(() => {
            try {
              // console.log(value, 'value 从哪来的')   ---  state改变时，fn依次执行传入
              let x = onFulfilled(value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
  
        this.ononRejectedCallbacks.push((reason) => {
          setTimeout(() => {
            try {
              let x = onRejected(reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })

    return promise2
  }
}

Promise.PENDING = 'pending'
Promise.FULFILLED = 'fulfilled'
Promise.REJECTED = 'rejected'

module.exports = Promise