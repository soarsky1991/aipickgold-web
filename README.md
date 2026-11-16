# AI拾金术 Web · 0.2.0

方案 A 的正式代码版本：宇宙星系首页、Codex 学习地图和主理人关于页。保留已有游戏列表与游戏详情入口。

## 运行与检查

Node.js 20.19+ 或 22.12+，使用锁文件安装：

```sh
npm ci
npm test
npm run check
npm run build
npm run dev -- --host 127.0.0.1
```

构建输出为 `dist/`。`npm run preview -- --host 127.0.0.1` 可验收生产构建。

| 入口 | 内容 |
| --- | --- |
| `/` | 星系首页 |
| `/?view=learn` | 学习地图 |
| `/?view=about` | 关于主理人 |
| `/games.html` | 原游戏列表 |
| `/game.html?id=...` | 原游戏详情 |

无效 view 回到首页；旧 concept 参数不再切换方案。本站使用相对资源地址，支持部署在子路径。

## 代码职责

- `src/site/app.js`：页面装配。
- `src/site/site.js`、`pages.js`：导航、首页和内容页模板。
- `src/site/galaxy-controller.js`：输入、镜头、地标、降级与动画生命周期。
- `src/site/galaxy-scene.js`：程序化星系、远景、前景尘埃和着色器。
- `src/site/styles.css`：基础布局；`galaxy-theme.css`：共享深色视觉；`pages.css`：内容页。
- `src/main.ts`、`render.ts`、`data.ts`：保留的游戏入口和数据读取。

Three.js 固定为 0.160.0，由 Vite 打包，无运行时 CDN 请求。星系是程序化视觉模型，不是天文模拟。Three.js 来源与 MIT 许可见 https://github.com/mrdoob/three.js/tree/r160 。

## 维护与发布

[设计与交互蒸馏](docs/design.md)记录本版边界。修改游戏数据使用 `public/games.json`。课程正文仍在外部学习站，本仓库不复制 60 篇课程，也不把未上线专题写成已完成。

现有 GitHub Actions 在 main 更新时构建并部署 GitHub Pages。提交 PR 本身不会发布；合并到 main 会发布。域名、凭据和托管设置不由本次代码更新修改。
