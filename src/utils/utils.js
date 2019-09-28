import {getRequest} from './api'
import {Message} from 'element-ui'

export const isNotNullORBlank = (...args) => {
  for (var i = 0; i < args.length; i++) {
    var argument = args[i];
    if (argument == null || argument == '' || argument == undefined) {
      Message.warning({message: '数据不能为空!'})
      return false;
    }
  }
  return true;
}

export const initMenu = (router, store) => {
  if (store.state.routes.length > 0) {
    return;
  }

  //获取用户的菜单列表
  getRequest("/permission/userMenuTree").then(resp => {
    if (resp && resp.status === 200 && resp.data.errCode === 0) {
      let fmtRoutes = formatRoutes(resp.data.data.menus);

      let components = formatComponents(resp.data.data.components);
      fmtRoutes.push(components);

      router.addRoutes(fmtRoutes);
      store.commit('initMenu', fmtRoutes);
      store.dispatch('connect');

    }
  })
}

//构建菜单
export const formatRoutes = (routes) => {
  let fmRoutes = [];
  routes.forEach(router => {
    let {
      path,
      component,
      name,
      meta,
      iconCls,
      isMenu,
      isPage,
      children
    } = router;
    if (children && children instanceof Array) {
      children = formatRoutes(children);
    }
    if (isMenu === 1) {
      let fmRouter = {
        path: path,
        component(resolve) {
          if (component.startsWith("Home")) {
            require(['../components/' + component + '.vue'], resolve)
          } else if (component.startsWith("Emp")) {
            require(['../components/emp/' + component + '.vue'], resolve)
          } else if (component.startsWith("Per")) {
            require(['../components/personnel/' + component + '.vue'], resolve)
          } else if (component.startsWith("Sal")) {
            require(['../components/salary/' + component + '.vue'], resolve)
          } else if (component.startsWith("Sta")) {
            require(['../components/statistics/' + component + '.vue'], resolve)
          } else if (component.startsWith("Sys")) {
            require(['../components/system/' + component + '.vue'], resolve)
          } else if (component.startsWith("Product")) {
            require(['../components/product/' + component + '.vue'], resolve)
          }
        },
        name: name,
        iconCls: iconCls,
        meta: meta,
        hidden: isMenu === 0 && isPage === 1,
        children: children
      };
      fmRoutes.push(fmRouter);
    }
  })
  return fmRoutes;
}

//构建Component
export const formatComponents = (components) => {
  let fmComponents = [];
  components.forEach(router => {
    let {
      path,
      component,
      name,
      meta,
      iconCls
    } = router;
    let fmRouter = {
      path: path,
      component(resolve) {
        if (component.startsWith("Home")) {
          require(['../components/' + component + '.vue'], resolve)
        } else if (component.startsWith("Emp")) {
          require(['../components/emp/' + component + '.vue'], resolve)
        } else if (component.startsWith("Per")) {
          require(['../components/personnel/' + component + '.vue'], resolve)
        } else if (component.startsWith("Sal")) {
          require(['../components/salary/' + component + '.vue'], resolve)
        } else if (component.startsWith("Sta")) {
          require(['../components/statistics/' + component + '.vue'], resolve)
        } else if (component.startsWith("Sys")) {
          require(['../components/system/' + component + '.vue'], resolve)
        } else if (component.startsWith("Product")) {
          require(['../components/product/' + component + '.vue'], resolve)
        }
      },
      name: name,
      iconCls: iconCls,
      meta: meta,
      hidden: true
    };
    fmComponents.push(fmRouter);
  });
  return {
    path: '/home',
    component(resolve) {
      require(['../components/Home.vue'], resolve)
    },
    name: 'homePage',
    iconCls: '',
    hidden: true,
    children: fmComponents
  };
}


