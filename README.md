# dsh-minimal-fast-preset

基于 DSH `minimal` 的本地 agent preset，优化 persistent bash 的 PTY 完成检测，降低单次 bash 调用延迟。

## 内容

- `preset.yml`：preset 元数据
- `agent.cordis.yml`：preset 组合配置
- `dsh-bashrc`：persistent bash 使用的 rcfile
- `persistent-bash-idle-silence-fix.md`：优化说明与风险记录

## 使用

将 `preset.yml` 和 `agent.cordis.yml` 放到：

```text
~/.dsh/.agent-presets/minimal-fast/
```

将 `dsh-bashrc` 放到：

```text
~/.dsh/dsh-bashrc
```

然后在 DSH 中选择 `minimal-fast` preset。
