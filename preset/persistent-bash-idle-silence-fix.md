# minimal-fast 持久 bash 优化说明

## 根因

- `dsh-terminal-bash` 期望提示符为 `dsh> `；
- `dsh-tool-bash-persistent` 将 PS1 覆盖为 `__DSH_PERSISTENT_BASH_PROMPT__ `；
- 两者不一致，导致 PTY 后端无法走快速完成路径，回退到 `idleSilenceMs + handoffGraceMs ≈ 3.5s`。

## 为什么标准模式没有此问题

- `standard` 使用非持久化 `@deepseek-ai/dsh-tool-bash`，通过 `bash -c` 子进程管道直接等待进程退出，没有 PTY 完成检测开销。
- `minimal` 使用持久化 PTY bash，需要推断命令是否结束，因此引入静默等待。

## 为什么 minimal 要保留持久 shell

- 当前目录、环境变量、函数、别名等状态跨调用保留；
- 更接近连续终端操作，适合逐步探索和验证；
- 减少重复传 `workdir` 和重新初始化环境的成本。

## minimal-fast 是否破坏 minimal 特性

- 不破坏核心特性：仍使用 persistent bash，仍只有 `bash` + `str_replace_editor`，persona 不变。
- 仅修改 `terminal-bash`：
  - 使用自定义 rcfile 将 PS1 对齐为 `dsh> `；
  - 降低 `pollIntervalMs` 到 `10`。

## 严格检查结果

- DSH `discoverPresets`：`minimal-fast` 可被发现，`broken=false`。
- 与内置 `minimal` diff：仅增加 `terminal-bash` 配置，无其他功能变化。
- PTY 实测：
  - 初始提示符为 `dsh> `；
  - `PS1` 和 `PROMPT_COMMAND` 正确；
  - 普通命令执行正常。

## 已知风险

- 正常路径无问题。
- 极端场景：命令输出过大导致结束标记被截断，或命令异常终止时，DSH 的“提示符兜底”依赖 `__DSH_PERSISTENT_BASH_PROMPT__ `，而本 preset 使用 `dsh> `，可能导致无法及时返回部分输出。
- 该风险概率低，但严格来说不是绝对零风险。

## 关键文件

- `~/.dsh/dsh-bashrc`
- `~/.dsh/.agent-presets/minimal-fast/agent.cordis.yml`
