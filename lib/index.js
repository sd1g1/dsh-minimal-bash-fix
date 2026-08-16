/**
 * dsh-minimal-bash-fix host plugin
 *
 * 职责：把随包分发的 agent preset（preset/ 目录）同步安装到
 * `$DSH_HOME/.agent-presets/minimal-fast`，并把 `dsh-bashrc` 安装到
 * `$DSH_HOME/dsh-bashrc`。
 *
 * 同步策略（幂等，可安全重启）：
 *   - 逐文件内容比对，目标缺失或内容与包内不一致时才写入；
 *   - 不删除目标目录中包内没有的文件，避免破坏用户手工修改。
 */
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readdir, readFile } from "node:fs/promises";
import os from "node:os";

export const name = "dsh-minimal-bash-fix";

export const inject = ["fs", "sandboxPolicy"];

const PRESET_ID = "minimal-fast";

const PRESET_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "preset");

const BASH_RC_SOURCE = join(dirname(fileURLToPath(import.meta.url)), "..", "dsh-bashrc");

function dshHome() {
  return process.env.DSH_HOME || join(os.homedir(), ".dsh");
}

async function syncFile(ctx, fullPolicy, sourcePath, targetPath) {
  const expected = await readFile(sourcePath, "utf8");
  let current = null;
  try {
    current = await readFile(targetPath, "utf8");
  } catch {
    current = null;
  }
  if (current === expected) return false;
  const target = await ctx.fs.resolve(targetPath);
  await ctx.fs.writeText(target, expected, undefined, undefined, fullPolicy);
  return true;
}

async function syncPreset(ctx, fullPolicy, targetDir) {
  await mkdir(targetDir, { recursive: true });
  const entries = await readdir(PRESET_DIR, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  const updated = [];
  for (const file of files) {
    if (await syncFile(ctx, fullPolicy, join(PRESET_DIR, file), join(targetDir, file))) {
      updated.push(file);
    }
  }
  return updated;
}

export function apply(ctx) {
  const fullPolicy = ctx.sandboxPolicy.resolve({ mode: "danger-full-access" });
  const presetTarget = join(dshHome(), ".agent-presets", PRESET_ID);
  const bashRcTarget = join(dshHome(), "dsh-bashrc");

  return Promise.all([
    syncPreset(ctx, fullPolicy, presetTarget),
    syncFile(ctx, fullPolicy, BASH_RC_SOURCE, bashRcTarget).then((updated) => updated ? ["dsh-bashrc"] : []),
  ]).then(([presetUpdated, bashUpdated]) => {
    const updated = [...presetUpdated, ...bashUpdated];
    ctx.logger.info(
      `${name}: preset "${PRESET_ID}" ready at ${presetTarget}` +
        (updated.length > 0 ? " (files: " + updated.join(", ") + ")" : " (up to date)"),
    );
  }).catch((error) => {
    ctx.logger.warn(`${name}: preset sync skipped: ${error && error.message ? error.message : error}`);
  });
}
