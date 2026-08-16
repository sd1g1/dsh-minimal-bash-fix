# dsh-minimal-fast-preset

基于 DSH `minimal` 的 agent preset，优化 persistent bash 的 PTY 完成检测，降低单次 bash 调用延迟。

## 安装

### 通过 DSH bundle 安装（推荐）

```bash
dsh plugin --profile web add -w github:sd1g1/dsh-minimal-fast-preset#v0.1.0
```

重启 DSH 后，插件会自动：

- 安装 preset 到 `~/.dsh/.agent-presets/minimal-fast/`
- 安装 `dsh-bashrc` 到 `~/.dsh/dsh-bashrc`

然后在 DSH 中选择 `minimal-fast` preset。

### 手动安装

```bash
git clone https://github.com/sd1g1/dsh-minimal-fast-preset.git
cd dsh-minimal-fast-preset

mkdir -p ~/.dsh/.agent-presets/minimal-fast
cp preset/preset.yml preset/agent.cordis.yml ~/.dsh/.agent-presets/minimal-fast/
cp preset/persistent-bash-idle-silence-fix.md ~/.dsh/.agent-presets/minimal-fast/
cp dsh-bashrc ~/.dsh/dsh-bashrc
```

## 验证

```bash
echo "PS1=[$PS1]"
```

如果输出：

```text
PS1=[dsh> ]
```

说明快速路径已生效。

## 内容

- `preset/`：agent preset 本体
- `dsh-bashrc`：persistent bash 使用的 rcfile
- `lib/index.js`：DSH bundle 安装插件
- `cordis.patch.yml`：bundle 补丁层
