# dsh-minimal-fast-preset

基于 DSH `minimal` 的本地 agent preset，优化 persistent bash 的 PTY 完成检测，降低单次 bash 调用延迟。

## 内容

- `preset.yml`：preset 元数据
- `agent.cordis.yml`：preset 组合配置
- `dsh-bashrc`：persistent bash 使用的 rcfile
- `persistent-bash-idle-silence-fix.md`：优化说明与风险记录

## 安装方法

### 1. 克隆仓库

```bash
git clone https://github.com/sd1g1/dsh-minimal-fast-preset.git
cd dsh-minimal-fast-preset
```

### 2. 安装 preset 文件

```bash
mkdir -p ~/.dsh/.agent-presets/minimal-fast
cp preset.yml agent.cordis.yml ~/.dsh/.agent-presets/minimal-fast/
cp persistent-bash-idle-silence-fix.md ~/.dsh/.agent-presets/minimal-fast/
cp dsh-bashrc ~/.dsh/dsh-bashrc
```

### 3. 使用 npx dsh 启动

```bash
npx dsh web
```

启动后在 DSH 中选择 `minimal-fast` preset。

## 验证

```bash
echo "PS1=[$PS1]"
```

如果输出：

```text
PS1=[dsh> ]
```

说明快速路径已生效。
