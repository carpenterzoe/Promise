class Promise {
  constructor(executor) {
    // * 参数校验
    if (typeof executor !== 'function') {
      throw new Error(`Promise resolver ${executor} is not a function`)
    }

    this.initValue()
    this.initBind()

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

      this.ononRejectedCallbacks.forEach((fn) => fn(this.reason))
    }
  }

  then(onFulfilled, onRejected) {
    //  * 根据promise/A+ 规范，then的两个参数必须是函数
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

    if (this.state === Promise.FULFILLED) {
      setTimeout(() => {
        onFulfilled(this.value)
      })
    }

    if (this.state === Promise.REJECTED) {
      setTimeout(() => {
        onRejected(this.reason)
      })
    }
  }
}

Promise.PENDING = 'pending'
Promise.FULFILLED = 'fulfilled'
Promise.REJECTED = 'rejected'

module.exports = Promise