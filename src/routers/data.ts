export const routerlist = [
  {
    id: '1',
    name: 'menu.example',
    icon: 'icon-gongzuotai',
    path: '/example',
    redirect: '/example/enumer',
    ignore: false,
    type: false,
    childMenuList: [
      {
        id: '1-1',
        name: 'menu.example.enumer',
        path: '/example/enumer',
        ignore: false,
        type: true
      },
      {
        id: '1-2',
        name: 'menu.example.table',
        path: '/example/table',
        ignore: false,
        type: true
      },
      {
        id: '1-3',
        name: 'menu.example.components',
        path: '/example/components',
        ignore: false,
        type: true
      },
      {
        id: '1-4',
        name: 'menu.example.workFlow',
        path: '/example/workFlow',
        ignore: false,
        type: true
      },
      {
        id: '1-5',
        name: 'menu.example.print',
        path: '/example/print',
        ignore: false,
        type: true
      }
    ]
  }
  // {
  //   id: '2',
  //   name: 'menu.three',
  //   icon: 'icon-gongzuotai',
  //   path: '/three',
  //   redirect: '/three/init',
  //   ignore: false,
  //   type: false,
  //   childMenuList: [
  //     {
  //       id: '2-1',
  //       name: 'menu.three.init',
  //       path: '/three/init',
  //       ignore: false,
  //       type: true
  //     }
  //   ]
  // }
]
