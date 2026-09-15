import gulp from "gulp";
import {build} from "esbuild";
import {resolve} from "node:path";
import {readdirSync} from "node:fs";

import {filePaths} from "../config/paths.js";
import {logger} from "../config/logger.js";
import {reprefix} from "../config/project.js";

const jsSrcDir = resolve("src/js");

// Точки входа — все .js прямо в src/js/ (scripts.js + опциональные module__*.js).
// Файлы из src/js/modules/ не входят: они подключаются через import в scripts.js.
const getEntryPoints = () =>
  readdirSync(jsSrcDir)
    .filter((f) => f.endsWith(".js"))
    .map((f) => resolve(jsSrcDir, f));

// jQuery берётся из глобала (CDN), а не вшивается в бандл — через шим-алиас.
const jqueryShim = resolve("src/js/lib/jquery-global.js");

/**
 * Сборка JS через esbuild: чистый IIFE без рантайм-обёртки.
 * dev   → без минификации, инлайн source-map
 * build → минификация, без source-map
 * Swiper и прочие npm-пакеты вшиваются (tree-shaking), jQuery — внешний глобал.
 */
const javascript = async (isDev, serverInstance) => {
  await build({
    entryPoints: getEntryPoints(),
    outdir: filePaths.build.js,
    entryNames: "[name].min",
    bundle: true,
    format: "iife",
    target: "es2015",
    charset: "utf8",
    minify: !isDev,
    sourcemap: isDev ? "inline" : false,
    legalComments: "none",
    logLevel: "warning",
    alias: {jquery: jqueryShim},
  });

  // Постобработка: классовая уникальность (<basePrefix>__ → <prefix>__) + рестрим в browserSync.
  return gulp
    .src(`${filePaths.build.js}*.min.js`)
    .pipe(logger.handleError("JS"))
    .pipe(reprefix())
    .pipe(gulp.dest(filePaths.build.js))
    .pipe(serverInstance.stream());
};

export {javascript};
