import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { type ConfigEnv, type UserConfigExport, loadEnv } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import svgLoader from 'vite-svg-loader'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
export default (configEnv: ConfigEnv): UserConfigExport => {
  console.log('load vite config...')
  const viteCfg = loadEnv(configEnv.mode, process.cwd()) as any

  return defineConfig({
    base: viteCfg.VITE_BASE_PATH,
    plugins: [
      vue(),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      // 支持将 SVG 文件导入为 Vue 组件
      svgLoader({
        defaultImport: 'url',
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  // @see https://github.com/svg/svgo/issues/1128
                  removeViewBox: false
                }
              }
            }
          ]
        }
      }),
      // 自动按需导入 API
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'types/auto/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()]
      }),
      // 自动按需导入组件
      Components({
        dts: 'types/auto/components.d.ts',
        resolvers: [ElementPlusResolver()]
      }),
      /** 将 SVG 静态图转化为 Vue 组件 */
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]'
      }),
      // 链接：https://juejin.cn/post/7159410085460983839
      // uncomment it when analyze performence issue
      visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: 'test.html', //分析图生成的文件名
        open: false //如果存在本地服务端口，将在打包后自动展示
      })
    ],
    /** Vitest 单元测试配置：https://cn.vitest.dev/config */
    resolve: {
      alias: {
        //这里猜测应该是一个map，key为别名，value为你要别名的路径
        '@': path.resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 两种方式都可以
          additionalData: '@import "@/assets/scss/global.scss";'
          // additionalData: '@use "@/assets/scss/global.scss" as *;'
        }
      }
    },
    server: {
      host: '127.0.0.1', // 默认是 localhost
      port: 3001, // 默认是 3000 端口
      open: false, // 浏览器自动打开
      proxy: {
        // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
        '/api/': {
          // target: 'http://localhost:8080/', // 后端服务实际地址
          target: 'http://101.43.221.193:8080/', // 后端服务实际地址
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      // 是否允许跨域
      cors: true,
      // 预热常用文件，提高初始页面加载速度
      warmup: {
        clientFiles: ['./src/layouts/**/*.*', './src/pinia/**/*.*', './src/router/**/*.*']
      }
    },
    build: {
      /** 单个 chunk 文件的大小超过 2048KB 时发出警告 */
      chunkSizeWarningLimit: 2048,
      /** 禁用 gzip 压缩大小报告 */
      reportCompressedSize: false,
      /** 打包后静态资源目录 */
      assetsDir: 'static',
      rollupOptions: {
        output: {
          /**
           * 分块策略
           * 1. 注意这些包名必须存在，否则打包会报错
           * 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
           */
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            antDesign: ['ant-design-vue', '@ant-design/icons-vue'],
            echarts: ['echarts']
          }
          // 拆分js到模块文件夹
          // chunkFileNames: (chunkInfo) => {
          //   const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : []
          //   const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]'
          //   return `js/${fileName}/[name].[hash].js`
          // }
        }
      }
    },
    /** 混淆器 */
    esbuild: {
      /** 打包时移除 console.log */
      pure: ['console.log'],
      /** 打包时移除 debugger */
      drop: ['debugger'],
      /** 打包时移除所有注释 */
      legalComments: 'none'
    }
  })
}
