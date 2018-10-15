
// var initProxy;

// {
//   var hasProxy =
//     typeof Proxy !== 'undefined' &&
//     Proxy.toString().match(/native code/);

//   var hasHandler = {
//     has: function has (target, key) {
//       var has = key in target;
//       return has || !isAllowed
//     }
//   };

//   var getHandler = {
//     get: function get (target, key) {
     
//       return target[key]
//     }
//   };

//   initProxy = function initProxy (vm) {
//     if (hasProxy) {
//       // determine which proxy handler to use
//       var options = vm.$options;
//       var handlers = options.render && options.render._withStripped
//         ? getHandler
//         : hasHandler;
//       vm._renderProxy = new Proxy(vm, handlers);
//     } else {
//       vm._renderProxy = vm;
//     }
//   };
// }
// let c = {
//     $options:{
//         data:'1222'
//     }
// }
// console.log(initProxy)


let a = {
    b:"1"
}
a.p = new Proxy(a,{
    has: function(target, prop) {
        console.log("call " + prop);
    }
})
a.p.b