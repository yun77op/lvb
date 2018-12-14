# lvb

一个简单的微博客户端，使用react native编写。

## 缘由

一开始是碰到了https://microsoft.github.io/reactxp/ 这个项目，在react native的基础上再做了层封装，可以实现同一个项目开发适配多个平台的应用，就想着拿它来练个手。练手的话最好有真实数据，所以做个微博客户端很合适，但weibo的接口现在有很多限制，比如关注关系、单条微博等，如果不是当前用户的，就不会返回数据。可能防爬虫是其中一个原因，新浪商业上的考量才是最核心的原因。其实twitter也是这么干的，所以就算做得再完备，也是没法取代官方的微博客户端的。

## 一些值得提一下的库

### ReSub

https://github.com/Microsoft/ReSub

ReSub和mobx类似，与redux集中管理数据不同的，resub是单独的一个一个store。首先遇到的一个问题是，微博的accessToken怎么保存到本地，下次刷新时再从本地取出来。

如果用redux的话，可以使用persist插件，但resub是没有提供这样的功能的。所以只能自己去实现，数据变化时就保存到本地，[StoreBaseWithPersist.ts](https://github.com/yun77op/lvb/blob/master/src/store/StoreBaseWithPersist.ts)。

ReSub有个特性是提供了阻止视图更新的功能（StoreBase.pushTriggerBlock），个人觉得在一些场景下是很有用的。

本人使用的导航组件是react-navigation，页面切换时，会先把页面渲染好再执行动画切换页面，但这样会有两个问题。首选是如果页面渲染比较费时，最好在切换后再渲染。其次一般页面都是依赖外部数据的，如果在页面切换中，数据获取到了再重新渲染，个人觉得这样体验不好的。

```javascript
  public async componentDidMount() {
    StoreBase.pushTriggerBlock();

    await CommentsStore.fetch({
      id: this.props.id,
      maxId: '0'
    });

    InteractionManager.runAfterInteractions(async () => {
      StoreBase.popTriggerBlock();
      // ...
    })
  }
```
如果页面切换中重新渲染了会不会使得切换卡顿？文档里切换动画是用原生线程实现的，应该不会。


### Typescript

一开始觉得是负担，后来发现对代码健壮性很有帮助，比如取了对象上不存在的属性或者调用了一个函数返回值可能为undefined都会有提示。

### FlatList

长列表在现实应用中很常见，用的官方的FlatList组件实现。

开发过程中遇到FlatList组件组件会提示警告"VirtualizedList: You have a large list that is slow to update"，觉得还是要深入看下问题出在哪。

首先要搞明白在什么情况下会出现性能提示。组件会监听ScrollView的滚动，滚动事件触发时，取当前时间和上次时间比对取差值，如果超过了阀值就表示太多时间花在了列表渲染上。

后来发现了[recyclerlistview](https://github.com/Flipkart/recyclerlistview)，声称能提供高性能的列表实现，其核心理念是回收listitem，并重复使用，而不是摧毁listitem并重现创建listitem。但这个组件需要提供listitem的layout信息，或准确或接近准确。其实像微博这种情况，没法提供准确信息的，接近准确的话，会有一个重新定位的过程，视觉上listitem会移动，所以后来就放弃了这个组件。

但是这种思路是好的，可以借鉴来用在FlatList上。那如何做到回收listitem呢？关在在于key

| item1 key:1
| item2 key:2

| item2 key:2
| item3 key:1


上面举的例子，只要重复利用key就可以了。

本人也试着在FlatList实现了回收listitem重利用的功能，其实性能提升并不显著，不管怎样给react-native发了个[PR](https://github.com/facebook/react-native/pull/22576)，也想听听官方维护人员的意见，不过目前还没进展。