// vite.config.ts
import { defineConfig } from "file:///D:/my-project/bpmn-nest-fe/node_modules/.pnpm/vite@6.2.2_sass@1.69.5/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/my-project/bpmn-nest-fe/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@6.2.2_vue@3.5.13/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { loadEnv } from "file:///D:/my-project/bpmn-nest-fe/node_modules/.pnpm/vite@6.2.2_sass@1.69.5/node_modules/vite/dist/node/index.js";
import vueJsx from "file:///D:/my-project/bpmn-nest-fe/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.1.1_vite@6.2.2_vue@3.5.13/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/my-project/bpmn-nest-fe/node_modules/.pnpm/unplugin-auto-import@19.0.0_@vueuse+core@10.11.1/node_modules/unplugin-auto-import/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/my-project/bpmn-nest-fe/node_modules/.pnpm/unplugin-vue-components@28.0.0_vue@3.5.13/node_modules/unplugin-vue-components/dist/resolvers.js";
import Components from "file:///D:/my-project/bpmn-nest-fe/node_modules/.pnpm/unplugin-vue-components@28.0.0_vue@3.5.13/node_modules/unplugin-vue-components/dist/vite.js";
import svgLoader from "file:///D:/my-project/bpmn-nest-fe/node_modules/.pnpm/vite-svg-loader@5.1.0_vue@3.5.13/node_modules/vite-svg-loader/index.js";
import { visualizer } from "file:///D:/my-project/bpmn-nest-fe/node_modules/.pnpm/rollup-plugin-visualizer@5.14.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { createSvgIconsPlugin } from "file:///D:/my-project/bpmn-nest-fe/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@6.2.2/node_modules/vite-plugin-svg-icons/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\my-project\\bpmn-nest-fe";
var vite_config_default = (configEnv) => {
  console.log("load vite config...");
  const viteCfg = loadEnv(configEnv.mode, process.cwd());
  return defineConfig({
    base: viteCfg.VITE_BASE_PATH,
    plugins: [
      vue(),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      // 支持将 SVG 文件导入为 Vue 组件
      svgLoader({
        defaultImport: "url",
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
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
        imports: ["vue", "vue-router", "pinia"],
        dts: "types/auto/auto-imports.d.ts",
        resolvers: [ElementPlusResolver()]
      }),
      // 自动按需导入组件
      Components({
        dts: "types/auto/components.d.ts",
        resolvers: [ElementPlusResolver()]
      }),
      /** 将 SVG 静态图转化为 Vue 组件 */
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]"
      }),
      // 链接：https://juejin.cn/post/7159410085460983839
      // uncomment it when analyze performence issue
      visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: "test.html",
        //分析图生成的文件名
        open: false
        //如果存在本地服务端口，将在打包后自动展示
      })
    ],
    /** Vitest 单元测试配置：https://cn.vitest.dev/config */
    resolve: {
      alias: {
        //这里猜测应该是一个map，key为别名，value为你要别名的路径
        "@": path.resolve(__vite_injected_original_dirname, "src")
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
      host: "127.0.0.1",
      // 默认是 localhost
      port: 3001,
      // 默认是 3000 端口
      open: false,
      // 浏览器自动打开
      proxy: {
        // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
        "/blog/": {
          // target: 'http://localhost:8080/', // 后端服务实际地址
          target: "http://101.43.221.193:8080/",
          // 后端服务实际地址
          changeOrigin: true,
          ws: true,
          rewrite: (path2) => path2.replace(/^\/blog/, "")
        },
        "/api/": {
          target: "http://127.0.0.1:11434/",
          // 后端服务实际地址
          changeOrigin: true,
          ws: true
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      // 是否允许跨域
      cors: true,
      // 预热常用文件，提高初始页面加载速度
      warmup: {
        clientFiles: ["./src/layouts/**/*.*", "./src/pinia/**/*.*", "./src/router/**/*.*"]
      }
    },
    build: {
      /** 单个 chunk 文件的大小超过 2048KB 时发出警告 */
      chunkSizeWarningLimit: 2048,
      /** 禁用 gzip 压缩大小报告 */
      reportCompressedSize: false,
      /** 打包后静态资源目录 */
      assetsDir: "static",
      rollupOptions: {
        output: {
          /**
           * 分块策略
           * 1. 注意这些包名必须存在，否则打包会报错
           * 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
           */
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            antDesign: ["ant-design-vue", "@ant-design/icons-vue"],
            echarts: ["echarts"]
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
      pure: ["console.log"],
      /** 打包时移除 debugger */
      drop: ["debugger"],
      /** 打包时移除所有注释 */
      legalComments: "none"
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxteS1wcm9qZWN0XFxcXGJwbW4tbmVzdC1mZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcbXktcHJvamVjdFxcXFxicG1uLW5lc3QtZmVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L215LXByb2plY3QvYnBtbi1uZXN0LWZlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IHR5cGUgQ29uZmlnRW52LCB0eXBlIFVzZXJDb25maWdFeHBvcnQsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnXG5leHBvcnQgZGVmYXVsdCAoY29uZmlnRW52OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnRXhwb3J0ID0+IHtcbiAgY29uc29sZS5sb2coJ2xvYWQgdml0ZSBjb25maWcuLi4nKVxuICBjb25zdCB2aXRlQ2ZnID0gbG9hZEVudihjb25maWdFbnYubW9kZSwgcHJvY2Vzcy5jd2QoKSkgYXMgYW55XG5cbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XG4gICAgYmFzZTogdml0ZUNmZy5WSVRFX0JBU0VfUEFUSCxcbiAgICBwbHVnaW5zOiBbXG4gICAgICB2dWUoKSxcbiAgICAgIHZ1ZUpzeCh7XG4gICAgICAgIC8vIG9wdGlvbnMgYXJlIHBhc3NlZCBvbiB0byBAdnVlL2JhYmVsLXBsdWdpbi1qc3hcbiAgICAgIH0pLFxuICAgICAgLy8gXHU2NTJGXHU2MzAxXHU1QzA2IFNWRyBcdTY1ODdcdTRFRjZcdTVCRkNcdTUxNjVcdTRFM0EgVnVlIFx1N0VDNFx1NEVGNlxuICAgICAgc3ZnTG9hZGVyKHtcbiAgICAgICAgZGVmYXVsdEltcG9ydDogJ3VybCcsXG4gICAgICAgIHN2Z29Db25maWc6IHtcbiAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdwcmVzZXQtZGVmYXVsdCcsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIG92ZXJyaWRlczoge1xuICAgICAgICAgICAgICAgICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vc3ZnL3N2Z28vaXNzdWVzLzExMjhcbiAgICAgICAgICAgICAgICAgIHJlbW92ZVZpZXdCb3g6IGZhbHNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NjMwOVx1OTcwMFx1NUJGQ1x1NTE2NSBBUElcbiAgICAgIEF1dG9JbXBvcnQoe1xuICAgICAgICBpbXBvcnRzOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3BpbmlhJ10sXG4gICAgICAgIGR0czogJ3R5cGVzL2F1dG8vYXV0by1pbXBvcnRzLmQudHMnLFxuICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldXG4gICAgICB9KSxcbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NjMwOVx1OTcwMFx1NUJGQ1x1NTE2NVx1N0VDNFx1NEVGNlxuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIGR0czogJ3R5cGVzL2F1dG8vY29tcG9uZW50cy5kLnRzJyxcbiAgICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXVxuICAgICAgfSksXG4gICAgICAvKiogXHU1QzA2IFNWRyBcdTk3NTlcdTYwMDFcdTU2RkVcdThGNkNcdTUzMTZcdTRFM0EgVnVlIFx1N0VDNFx1NEVGNiAqL1xuICAgICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgICAgICAvLyBTcGVjaWZ5IHRoZSBpY29uIGZvbGRlciB0byBiZSBjYWNoZWRcbiAgICAgICAgaWNvbkRpcnM6IFtwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hc3NldHMvaWNvbnMnKV0sXG4gICAgICAgIC8vIFNwZWNpZnkgc3ltYm9sSWQgZm9ybWF0XG4gICAgICAgIHN5bWJvbElkOiAnaWNvbi1bZGlyXS1bbmFtZV0nXG4gICAgICB9KSxcbiAgICAgIC8vIFx1OTRGRVx1NjNBNVx1RkYxQWh0dHBzOi8vanVlamluLmNuL3Bvc3QvNzE1OTQxMDA4NTQ2MDk4MzgzOVxuICAgICAgLy8gdW5jb21tZW50IGl0IHdoZW4gYW5hbHl6ZSBwZXJmb3JtZW5jZSBpc3N1ZVxuICAgICAgdmlzdWFsaXplcih7XG4gICAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgICBicm90bGlTaXplOiB0cnVlLFxuICAgICAgICBlbWl0RmlsZTogZmFsc2UsXG4gICAgICAgIGZpbGVuYW1lOiAndGVzdC5odG1sJywgLy9cdTUyMDZcdTY3OTBcdTU2RkVcdTc1MUZcdTYyMTBcdTc2ODRcdTY1ODdcdTRFRjZcdTU0MERcbiAgICAgICAgb3BlbjogZmFsc2UgLy9cdTU5ODJcdTY3OUNcdTVCNThcdTU3MjhcdTY3MkNcdTU3MzBcdTY3MERcdTUyQTFcdTdBRUZcdTUzRTNcdUZGMENcdTVDMDZcdTU3MjhcdTYyNTNcdTUzMDVcdTU0MEVcdTgxRUFcdTUyQThcdTVDNTVcdTc5M0FcbiAgICAgIH0pXG4gICAgXSxcbiAgICAvKiogVml0ZXN0IFx1NTM1NVx1NTE0M1x1NkQ0Qlx1OEJENVx1OTE0RFx1N0Y2RVx1RkYxQWh0dHBzOi8vY24udml0ZXN0LmRldi9jb25maWcgKi9cbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAvL1x1OEZEOVx1OTFDQ1x1NzMxQ1x1NkQ0Qlx1NUU5NFx1OEJFNVx1NjYyRlx1NEUwMFx1NEUyQW1hcFx1RkYwQ2tleVx1NEUzQVx1NTIyQlx1NTQwRFx1RkYwQ3ZhbHVlXHU0RTNBXHU0RjYwXHU4OTgxXHU1MjJCXHU1NDBEXHU3Njg0XHU4REVGXHU1Rjg0XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpXG4gICAgICB9XG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgc2Nzczoge1xuICAgICAgICAgIC8vIFx1NEUyNFx1NzlDRFx1NjVCOVx1NUYwRlx1OTBGRFx1NTNFRlx1NEVFNVxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiAnQGltcG9ydCBcIkAvYXNzZXRzL3Njc3MvZ2xvYmFsLnNjc3NcIjsnXG4gICAgICAgICAgLy8gYWRkaXRpb25hbERhdGE6ICdAdXNlIFwiQC9hc3NldHMvc2Nzcy9nbG9iYWwuc2Nzc1wiIGFzICo7J1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6ICcxMjcuMC4wLjEnLCAvLyBcdTlFRDhcdThCQTRcdTY2MkYgbG9jYWxob3N0XG4gICAgICBwb3J0OiAzMDAxLCAvLyBcdTlFRDhcdThCQTRcdTY2MkYgMzAwMCBcdTdBRUZcdTUzRTNcbiAgICAgIG9wZW46IGZhbHNlLCAvLyBcdTZENEZcdTg5QzhcdTU2NjhcdTgxRUFcdTUyQThcdTYyNTNcdTVGMDBcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIC8vIFx1NjcyQ1x1NTczMFx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1OTAxQVx1OEZDN1x1NEVFM1x1NzQwNlx1NUI5RVx1NzNCMFx1OERFOFx1NTdERlx1RkYwQ1x1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NEY3Rlx1NzUyOCBuZ2lueCBcdThGNkNcdTUzRDFcbiAgICAgICAgJy9ibG9nLyc6IHtcbiAgICAgICAgICAvLyB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjgwODAvJywgLy8gXHU1NDBFXHU3QUVGXHU2NzBEXHU1MkExXHU1QjlFXHU5NjQ1XHU1NzMwXHU1NzQwXG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEwMS40My4yMjEuMTkzOjgwODAvJywgLy8gXHU1NDBFXHU3QUVGXHU2NzBEXHU1MkExXHU1QjlFXHU5NjQ1XHU1NzMwXHU1NzQwXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHdzOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9ibG9nLywgJycpXG4gICAgICAgIH0sXG4gICAgICAgICcvYXBpLyc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjExNDM0LycsIC8vIFx1NTQwRVx1N0FFRlx1NjcwRFx1NTJBMVx1NUI5RVx1OTY0NVx1NTczMFx1NTc0MFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICB3czogdHJ1ZVxuICAgICAgICAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJylcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIFx1NjYyRlx1NTQyNlx1NTE0MVx1OEJCOFx1OERFOFx1NTdERlxuICAgICAgY29yczogdHJ1ZSxcbiAgICAgIC8vIFx1OTg4NFx1NzBFRFx1NUUzOFx1NzUyOFx1NjU4N1x1NEVGNlx1RkYwQ1x1NjNEMFx1OUFEOFx1NTIxRFx1NTlDQlx1OTg3NVx1OTc2Mlx1NTJBMFx1OEY3RFx1OTAxRlx1NUVBNlxuICAgICAgd2FybXVwOiB7XG4gICAgICAgIGNsaWVudEZpbGVzOiBbJy4vc3JjL2xheW91dHMvKiovKi4qJywgJy4vc3JjL3BpbmlhLyoqLyouKicsICcuL3NyYy9yb3V0ZXIvKiovKi4qJ11cbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICAvKiogXHU1MzU1XHU0RTJBIGNodW5rIFx1NjU4N1x1NEVGNlx1NzY4NFx1NTkyN1x1NUMwRlx1OEQ4NVx1OEZDNyAyMDQ4S0IgXHU2NUY2XHU1M0QxXHU1MUZBXHU4QjY2XHU1NDRBICovXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIwNDgsXG4gICAgICAvKiogXHU3OTgxXHU3NTI4IGd6aXAgXHU1MzhCXHU3RjI5XHU1OTI3XHU1QzBGXHU2MkE1XHU1NDRBICovXG4gICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsXG4gICAgICAvKiogXHU2MjUzXHU1MzA1XHU1NDBFXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHU3NkVFXHU1RjU1ICovXG4gICAgICBhc3NldHNEaXI6ICdzdGF0aWMnLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBcdTUyMDZcdTU3NTdcdTdCNTZcdTc1NjVcbiAgICAgICAgICAgKiAxLiBcdTZDRThcdTYxMEZcdThGRDlcdTRFOUJcdTUzMDVcdTU0MERcdTVGQzVcdTk4N0JcdTVCNThcdTU3MjhcdUZGMENcdTU0MjZcdTUyMTlcdTYyNTNcdTUzMDVcdTRGMUFcdTYyQTVcdTk1MTlcbiAgICAgICAgICAgKiAyLiBcdTU5ODJcdTY3OUNcdTRGNjBcdTRFMERcdTYwRjNcdTgxRUFcdTVCOUFcdTRFNDkgY2h1bmsgXHU1MjA2XHU1MjcyXHU3QjU2XHU3NTY1XHVGRjBDXHU1M0VGXHU0RUU1XHU3NkY0XHU2M0E1XHU3OUZCXHU5NjY0XHU4RkQ5XHU2QkI1XHU5MTREXHU3RjZFXG4gICAgICAgICAgICovXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICB2dWU6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnXSxcbiAgICAgICAgICAgIGFudERlc2lnbjogWydhbnQtZGVzaWduLXZ1ZScsICdAYW50LWRlc2lnbi9pY29ucy12dWUnXSxcbiAgICAgICAgICAgIGVjaGFydHM6IFsnZWNoYXJ0cyddXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFx1NjJDNlx1NTIwNmpzXHU1MjMwXHU2QTIxXHU1NzU3XHU2NTg3XHU0RUY2XHU1OTM5XG4gICAgICAgICAgLy8gY2h1bmtGaWxlTmFtZXM6IChjaHVua0luZm8pID0+IHtcbiAgICAgICAgICAvLyAgIGNvbnN0IGZhY2FkZU1vZHVsZUlkID0gY2h1bmtJbmZvLmZhY2FkZU1vZHVsZUlkID8gY2h1bmtJbmZvLmZhY2FkZU1vZHVsZUlkLnNwbGl0KCcvJykgOiBbXVxuICAgICAgICAgIC8vICAgY29uc3QgZmlsZU5hbWUgPSBmYWNhZGVNb2R1bGVJZFtmYWNhZGVNb2R1bGVJZC5sZW5ndGggLSAyXSB8fCAnW25hbWVdJ1xuICAgICAgICAgIC8vICAgcmV0dXJuIGBqcy8ke2ZpbGVOYW1lfS9bbmFtZV0uW2hhc2hdLmpzYFxuICAgICAgICAgIC8vIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgLyoqIFx1NkRGN1x1NkRDNlx1NTY2OCAqL1xuICAgIGVzYnVpbGQ6IHtcbiAgICAgIC8qKiBcdTYyNTNcdTUzMDVcdTY1RjZcdTc5RkJcdTk2NjQgY29uc29sZS5sb2cgKi9cbiAgICAgIHB1cmU6IFsnY29uc29sZS5sb2cnXSxcbiAgICAgIC8qKiBcdTYyNTNcdTUzMDVcdTY1RjZcdTc5RkJcdTk2NjQgZGVidWdnZXIgKi9cbiAgICAgIGRyb3A6IFsnZGVidWdnZXInXSxcbiAgICAgIC8qKiBcdTYyNTNcdTUzMDVcdTY1RjZcdTc5RkJcdTk2NjRcdTYyNDBcdTY3MDlcdTZDRThcdTkxQ0EgKi9cbiAgICAgIGxlZ2FsQ29tbWVudHM6ICdub25lJ1xuICAgIH1cbiAgfSlcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1EsU0FBUyxvQkFBb0I7QUFDblMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixTQUFnRCxlQUFlO0FBQy9ELE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUNwQyxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGVBQWU7QUFDdEIsU0FBUyxrQkFBa0I7QUFDM0IsU0FBUyw0QkFBNEI7QUFWckMsSUFBTSxtQ0FBbUM7QUFXekMsSUFBTyxzQkFBUSxDQUFDLGNBQTJDO0FBQ3pELFVBQVEsSUFBSSxxQkFBcUI7QUFDakMsUUFBTSxVQUFVLFFBQVEsVUFBVSxNQUFNLFFBQVEsSUFBSSxDQUFDO0FBRXJELFNBQU8sYUFBYTtBQUFBLElBQ2xCLE1BQU0sUUFBUTtBQUFBLElBQ2QsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osT0FBTztBQUFBO0FBQUEsTUFFUCxDQUFDO0FBQUE7QUFBQSxNQUVELFVBQVU7QUFBQSxRQUNSLGVBQWU7QUFBQSxRQUNmLFlBQVk7QUFBQSxVQUNWLFNBQVM7QUFBQSxZQUNQO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixRQUFRO0FBQUEsZ0JBQ04sV0FBVztBQUFBO0FBQUEsa0JBRVQsZUFBZTtBQUFBLGdCQUNqQjtBQUFBLGNBQ0Y7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGLENBQUM7QUFBQTtBQUFBLE1BRUQsV0FBVztBQUFBLFFBQ1QsU0FBUyxDQUFDLE9BQU8sY0FBYyxPQUFPO0FBQUEsUUFDdEMsS0FBSztBQUFBLFFBQ0wsV0FBVyxDQUFDLG9CQUFvQixDQUFDO0FBQUEsTUFDbkMsQ0FBQztBQUFBO0FBQUEsTUFFRCxXQUFXO0FBQUEsUUFDVCxLQUFLO0FBQUEsUUFDTCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxNQUNuQyxDQUFDO0FBQUE7QUFBQSxNQUVELHFCQUFxQjtBQUFBO0FBQUEsUUFFbkIsVUFBVSxDQUFDLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxrQkFBa0IsQ0FBQztBQUFBO0FBQUEsUUFFMUQsVUFBVTtBQUFBLE1BQ1osQ0FBQztBQUFBO0FBQUE7QUFBQSxNQUdELFdBQVc7QUFBQSxRQUNULFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxRQUNaLFVBQVU7QUFBQSxRQUNWLFVBQVU7QUFBQTtBQUFBLFFBQ1YsTUFBTTtBQUFBO0FBQUEsTUFDUixDQUFDO0FBQUEsSUFDSDtBQUFBO0FBQUEsSUFFQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUE7QUFBQSxRQUVMLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxNQUNwQztBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQTtBQUFBLFVBRUosZ0JBQWdCO0FBQUE7QUFBQSxRQUVsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUE7QUFBQSxNQUNOLE1BQU07QUFBQTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFDTixPQUFPO0FBQUE7QUFBQSxRQUVMLFVBQVU7QUFBQTtBQUFBLFVBRVIsUUFBUTtBQUFBO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxJQUFJO0FBQUEsVUFDSixTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxXQUFXLEVBQUU7QUFBQSxRQUMvQztBQUFBLFFBQ0EsU0FBUztBQUFBLFVBQ1AsUUFBUTtBQUFBO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxJQUFJO0FBQUE7QUFBQSxRQUVOO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxNQUFNO0FBQUE7QUFBQSxNQUVOLFFBQVE7QUFBQSxRQUNOLGFBQWEsQ0FBQyx3QkFBd0Isc0JBQXNCLHFCQUFxQjtBQUFBLE1BQ25GO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBO0FBQUEsTUFFTCx1QkFBdUI7QUFBQTtBQUFBLE1BRXZCLHNCQUFzQjtBQUFBO0FBQUEsTUFFdEIsV0FBVztBQUFBLE1BQ1gsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQU1OLGNBQWM7QUFBQSxZQUNaLEtBQUssQ0FBQyxPQUFPLGNBQWMsT0FBTztBQUFBLFlBQ2xDLFdBQVcsQ0FBQyxrQkFBa0IsdUJBQXVCO0FBQUEsWUFDckQsU0FBUyxDQUFDLFNBQVM7QUFBQSxVQUNyQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBT0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxTQUFTO0FBQUE7QUFBQSxNQUVQLE1BQU0sQ0FBQyxhQUFhO0FBQUE7QUFBQSxNQUVwQixNQUFNLENBQUMsVUFBVTtBQUFBO0FBQUEsTUFFakIsZUFBZTtBQUFBLElBQ2pCO0FBQUEsRUFDRixDQUFDO0FBQ0g7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
