# lvb

一个简单的微博客户端，使用react native编写。

## 缘由

一开始是碰到了https://microsoft.github.io/reactxp/ 这个项目，在react native的基础上再做了层封装，可以实现同一个项目开发适配多个平台的应用，就想着拿它来练个手。练手的话最好有真实数据，所以做个微博客户端很合适，但weibo的接口现在有很多限制，比如关注关系、单条微博等，如果不是当前用户的，就不会返回数据。可能防爬虫是其中一个原因，新浪商业上的考量才是最核心的原因。其实twitter也是这么干的，所以就算做得再完备，也是没法取代官方的微博客户端的。

## 一些值得提一下的库

### ReSub

https://github.com/Microsoft/ReSub

ReSub和mobx类似，与redux集中管理数据不同的，resub是单独的一个一个store。首先遇到的一个问题是，微博的accessToken怎么保存到本地，下次刷新时再从本地取出来。

如果用redux的话，可以使用persist插件，但resub是没有提供这样的功能的。所以只能自己去实现，数据变化时就保存到本地，StoreBaseWithPersist.ts。

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


### typescript

一开始觉得是负担，后来发现对代码健壮性很有帮助，比如取了对象上不存在的属性或者调用了一个函数返回值可能为undefined都会有提示。

### flatlist
